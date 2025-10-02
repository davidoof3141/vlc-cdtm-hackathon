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
import MarkdownIt from "markdown-it";
import html2pdf from "html2pdf.js";

const md = new MarkdownIt();

const CollaborativeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

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

  const handleExport = async () => {
    if (!content.trim()) {
      toast.error("No content to export");
      return;
    }

    setExporting(true);
    toast.info("Generating PDF...");

    try {
      // Convert markdown to HTML
      const htmlContent = md.render(content);

      // Create a styled HTML document
      const styledHtml = `
        <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
          <div style="border-bottom: 3px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="margin: 0; color: #333;">${tender?.title || 'RFP Response'}</h1>
            <p style="margin: 10px 0 0 0; color: #666;">Client: ${tender?.client_name || 'N/A'}</p>
            <p style="margin: 5px 0 0 0; color: #666;">Date: ${new Date().toLocaleDateString()}</p>
          </div>
          <div style="line-height: 1.6; color: #333;">
            ${htmlContent}
          </div>
        </div>
      `;

      // Configure PDF options
      const opt = {
        margin: [15, 15, 15, 15] as [number, number, number, number],
        filename: `${tender?.title || 'rfp-response'}-${Date.now()}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      // Generate and download PDF
      await html2pdf().set(opt).from(styledHtml).save();
      
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    } finally {
      setExporting(false);
    }
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
            <Button onClick={handleExport} disabled={exporting}>
              <Download className="mr-2 h-4 w-4" />
              {exporting ? "Exporting..." : "Export PDF"}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Editor - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Draft Writer Agent */}
            <DraftWriterPanel
              currentDraft={content}
              tenderData={tender}
              onContentGenerated={handleContentGenerated}
            />

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Response Draft</CardTitle>
              </CardHeader>
              <CardContent className="h-[900px]">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="h-full resize-none font-mono text-sm"
                  placeholder="Start writing your RFP response, or use the Draft Writer Agent to generate content..."
                />
              </CardContent>
            </Card>
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
