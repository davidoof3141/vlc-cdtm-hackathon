import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, FileText, Loader2 } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";

const DraftCreator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [draftContent, setDraftContent] = useState<string>("");
  const [tenderData, setTenderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenderData = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from("tenders")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setTenderData(data);
      } catch (error) {
        console.error("Error fetching tender:", error);
        toast.error("Failed to load tender data");
      } finally {
        setLoading(false);
      }
    };

    fetchTenderData();
  }, [id]);

  const handleGenerateDraft = async () => {
    if (!tenderData) {
      toast.error("Tender data not loaded");
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-rfp-draft", {
        body: { tenderData }
      });

      if (error) throw error;

      if (data?.error) {
        if (data.error.includes("Rate limit")) {
          toast.error("Rate limit exceeded. Please try again later.");
        } else if (data.error.includes("credits")) {
          toast.error("AI credits exhausted. Please add credits to continue.");
        } else {
          toast.error(data.error);
        }
        return;
      }

      setDraftContent(data.draft);
      toast.success("RFP draft generated successfully!");
    } catch (error) {
      console.error("Error generating draft:", error);
      toast.error("Failed to generate draft");
    } finally {
      setGenerating(false);
    }
  };

  const handleMoveToEditor = () => {
    navigate(`/tenders/${id}/editor`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
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

        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-accent" />
              AI Draft Generator
            </h1>
            <p className="text-muted-foreground">
              Generate a comprehensive RFP response draft that covers all requirements using AI.
            </p>
          </div>

          <Card className="shadow-elegant">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tender Information</CardTitle>
                <Badge variant="outline">{tenderData?.status || 'open'}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Title</p>
                <p className="text-muted-foreground">{tenderData?.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Client</p>
                <p className="text-muted-foreground">{tenderData?.client_name}</p>
              </div>
              {tenderData?.deadline && (
                <div>
                  <p className="text-sm font-medium">Deadline</p>
                  <p className="text-muted-foreground">{new Date(tenderData.deadline).toLocaleDateString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button 
              onClick={handleGenerateDraft}
              disabled={generating}
              size="lg"
              className="flex-1"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Draft...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate AI Draft
                </>
              )}
            </Button>
            {draftContent && (
              <Button onClick={handleMoveToEditor} variant="outline" size="lg">
                <FileText className="mr-2 h-5 w-5" />
                Move to Editor
              </Button>
            )}
          </div>

          {draftContent && (
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Generated Draft</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  className="min-h-[500px] font-mono text-sm"
                  placeholder="Your AI-generated draft will appear here..."
                />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default DraftCreator;
