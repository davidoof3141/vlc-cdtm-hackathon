import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import { QuillBinding } from 'y-quill';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import 'quill/dist/quill.snow.css';

// Register the cursors module
Quill.register('modules/cursors', QuillCursors);


interface CollaborativeEditorProps {
  tenderId: string;
  onSave?: (content: string) => void;
  onContentChange?: (content: string) => void;
}

const CollaborativeEditor = ({ tenderId, onSave, onContentChange }: CollaborativeEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [ydoc] = useState(() => new Y.Doc());

  useEffect(() => {
    if (!editorRef.current) return;

    // Initialize Quill editor
    const quill = new Quill(editorRef.current, {
      theme: 'snow',
      modules: {
        cursors: true,
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          ['link', 'image'],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['clean'],
        ],
      },
      placeholder: 'Start writing your RFP draft...',
    });

    quillRef.current = quill;

    // Initialize Yjs WebSocket provider for real-time collaboration
    const wsProvider = new WebsocketProvider(
      'wss://demos.yjs.dev',
      `rfp-draft-${tenderId}`,
      ydoc
    );

    setProvider(wsProvider);

    // Get the text type from the Yjs document
    const ytext = ydoc.getText('quill');

    // Bind Quill to Yjs
    const binding = new QuillBinding(ytext, quill, wsProvider.awareness);

    // Listen for text changes to notify parent
    quill.on('text-change', () => {
      if (onContentChange) {
        const html = quill.root.innerHTML;
        onContentChange(html);
      }
    });

    // Cleanup
    return () => {
      binding.destroy();
      wsProvider?.destroy();
      quill.disable();
    };
  }, [tenderId, ydoc]);

  const handleSave = () => {
    if (quillRef.current && onSave) {
      const html = quillRef.current.root.innerHTML;
      onSave(html);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg bg-card">
      <div className="border-b p-2 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {provider?.wsconnected ? (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-success rounded-full"></span>
              Connected
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-muted rounded-full"></span>
              Connecting...
            </span>
          )}
        </div>
        <Button onClick={handleSave} size="sm">
          Save Draft
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <div ref={editorRef} className="h-full" />
      </div>
    </div>
  );
};

export default CollaborativeEditor;
