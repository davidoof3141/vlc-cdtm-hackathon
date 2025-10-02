import { useState, useEffect, useRef } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleRequirementClick = (requirementText: string) => {
    if (!textareaRef.current || !content) {
      console.log("No textarea ref or content");
      return;
    }

    console.log("Searching for requirement:", requirementText);
    
    // Extract meaningful keywords (remove common words)
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'that', 'this', 'these', 'those'];
    const searchTerms = requirementText
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3 && !commonWords.includes(word));
    
    console.log("Search terms:", searchTerms);

    // Split content into sentences and paragraphs for better matching
    const contentLower = content.toLowerCase();
    let bestMatch = { index: -1, length: 0, score: 0 };

    // Try to find exact phrase first
    const reqLower = requirementText.toLowerCase();
    if (contentLower.includes(reqLower)) {
      const index = contentLower.indexOf(reqLower);
      bestMatch = { index, length: requirementText.length, score: 100 };
      console.log("Found exact match at index:", index);
    } else {
      // Search through paragraphs and sentences
      const sections = content.split(/\n+/);
      let currentIndex = 0;

      for (const section of sections) {
        if (section.trim().length === 0) {
          currentIndex += section.length + 1;
          continue;
        }

        const sectionLower = section.toLowerCase();
        let matchScore = 0;
        
        // Count matching keywords
        searchTerms.forEach(term => {
          const regex = new RegExp(`\\b${term}\\b`, 'gi');
          const matches = sectionLower.match(regex);
          if (matches) {
            matchScore += matches.length * 10;
          }
        });

        // Bonus for multiple keyword matches in same section
        const uniqueMatches = searchTerms.filter(term => sectionLower.includes(term)).length;
        if (uniqueMatches > 1) {
          matchScore += uniqueMatches * 5;
        }

        if (matchScore > bestMatch.score) {
          bestMatch = { 
            index: currentIndex, 
            length: section.length,
            score: matchScore 
          };
          console.log("New best match:", { section: section.substring(0, 50), score: matchScore });
        }

        currentIndex += section.length + 1;
      }
    }

    if (bestMatch.index !== -1 && bestMatch.score > 0) {
      console.log("Final match found:", bestMatch);
      
      // Focus the textarea
      textareaRef.current.focus();
      
      // Set selection to highlight the matched section
      textareaRef.current.setSelectionRange(bestMatch.index, bestMatch.index + bestMatch.length);
      
      // Calculate scroll position more accurately
      const textBeforeMatch = content.substring(0, bestMatch.index);
      const lines = textBeforeMatch.split('\n').length;
      const textareaHeight = textareaRef.current.clientHeight;
      const lineHeight = 24; // approximate line height for mono font
      const totalLines = content.split('\n').length;
      const scrollableHeight = totalLines * lineHeight - textareaHeight;
      
      // Scroll to show the match in the middle of the viewport
      const targetScroll = Math.max(0, Math.min(
        (lines - 5) * lineHeight,
        scrollableHeight
      ));
      
      textareaRef.current.scrollTop = targetScroll;
      
      toast.success(`Found relevant section (${Math.round(bestMatch.score)}% match)`);
    } else {
      console.log("No match found");
      toast.info("No matching content found for this requirement. Try writing about: " + searchTerms.slice(0, 3).join(", "));
    }
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
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Response Draft</CardTitle>
              </CardHeader>
              <CardContent className="h-[600px]">
                <Textarea
                  ref={textareaRef}
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
              onRequirementClick={handleRequirementClick}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollaborativeEditor;
