import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Requirement {
  id: string;
  title: string;
  mandatory: boolean;
  description?: string;
}

interface AIGenerateButtonProps {
  requirements: Requirement[];
  tenderInfo: any;
  existingContent: string;
  onGenerated: (content: string) => void;
}

const AIGenerateButton = ({ requirements, tenderInfo, existingContent, onGenerated }: AIGenerateButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      toast.info('AI is generating your draft... This may take a moment.');
      
      const { data, error } = await supabase.functions.invoke('generate-draft', {
        body: {
          requirements,
          tenderInfo: {
            title: tenderInfo.title,
            client: tenderInfo.client_name,
            project: tenderInfo.project_name,
            goals: tenderInfo.goals,
            scope: tenderInfo.scope,
          },
          existingContent: existingContent || ''
        }
      });

      if (error) {
        if (error.message?.includes('429')) {
          toast.error('Rate limit reached. Please wait a moment and try again.');
          return;
        }
        if (error.message?.includes('402')) {
          toast.error('AI credits depleted. Please add credits to your workspace.');
          return;
        }
        throw error;
      }

      if (data?.content) {
        onGenerated(data.content);
        toast.success('Draft generated successfully!');
      }
    } catch (error) {
      console.error('Error generating draft:', error);
      toast.error('Failed to generate draft');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={handleGenerate} 
      disabled={isGenerating}
      className="gap-2"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          AI Generate Draft
        </>
      )}
    </Button>
  );
};

export default AIGenerateButton;
