import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Download, Users } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import RequirementsMonitorPanel from "@/components/editor/RequirementsMonitorPanel";
import DraftWriterPanel from "@/components/editor/DraftWriterPanel";

const CollaborativeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTender();
    }
  }, [id]);

  const fetchTender = async () => {
    try {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching tender:', error);
        toast.error("Failed to load tender");
        navigate("/");
        return;
      }

      setTender(data);
    } catch (error) {
      console.error('Error in fetchTender:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    toast.success("Draft saved successfully");
  };

  const handleExport = () => {
    toast.success("Exporting draft as Word document...");
  };

  const handleContentGenerated = (generatedContent: string) => {
    setContent(generatedContent);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <DashboardHeader />
        <main className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <DashboardHeader />
      <main className="container mx-auto px-6 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/tenders/${id}`)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tender
        </Button>

        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI-Powered Collaborative Editor</h1>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Editing
              </Badge>
              <Badge variant="secondary">Multi-Agent AI System Active</Badge>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Editor - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Response Draft</CardTitle>
              </CardHeader>
              <CardContent className="h-[600px]">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="h-full resize-none font-mono text-sm"
                  placeholder="Start writing your RFP response, or use the Draft Writer Agent to generate content..."
                />
              </CardContent>
            </Card>

            {/* Draft Writer Agent */}
            <DraftWriterPanel
              currentDraft={content}
              tenderData={tender}
              onContentGenerated={handleContentGenerated}
            />
          </div>

          {/* Right Sidebar - Requirements Monitor */}
          <div className="space-y-6">
            <RequirementsMonitorPanel
              draftContent={content}
              tenderData={tender}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollaborativeEditor;
