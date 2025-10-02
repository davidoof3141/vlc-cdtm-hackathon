import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Wand2, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DraftWriterPanelProps {
  currentDraft: string;
  tenderData: any;
  onContentGenerated: (content: string) => void;
}

const DraftWriterPanel = ({ currentDraft, tenderData, onContentGenerated }: DraftWriterPanelProps) => {
  const [generating, setGenerating] = useState(false);
  const [specificRequirement, setSpecificRequirement] = useState("");

  const handleGenerateFull = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("draft-writer-agent", {
        body: {
          action: "generate_full",
          currentDraft,
          requirements: tenderData?.requirements || "",
          tenderInfo: {
            title: tenderData?.title,
            client_name: tenderData?.client_name,
            goals: tenderData?.goals,
            scope: tenderData?.scope,
            deliverables: tenderData?.deliverables,
            constraints: tenderData?.constraints
          }
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      onContentGenerated(data.content);
      toast.success("Full draft generated!");
    } catch (error) {
      console.error("Error generating draft:", error);
      toast.error("Failed to generate draft");
    } finally {
      setGenerating(false);
    }
  };

  const handleImproveSection = async () => {
    if (!specificRequirement.trim()) {
      toast.error("Please specify a requirement to address");
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("draft-writer-agent", {
        body: {
          action: "improve_section",
          currentDraft,
          requirements: tenderData?.requirements || "",
          targetRequirement: specificRequirement,
          tenderInfo: {
            title: tenderData?.title,
            client_name: tenderData?.client_name,
            goals: tenderData?.goals,
            scope: tenderData?.scope
          }
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      onContentGenerated(data.content);
      toast.success("Draft improved!");
      setSpecificRequirement("");
    } catch (error) {
      console.error("Error improving draft:", error);
      toast.error("Failed to improve draft");
    } finally {
      setGenerating(false);
    }
  };

  const handleAddSection = async () => {
    if (!specificRequirement.trim()) {
      toast.error("Please specify what section to add");
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("draft-writer-agent", {
        body: {
          action: "add_section",
          currentDraft,
          requirements: tenderData?.requirements || "",
          targetRequirement: specificRequirement,
          tenderInfo: {
            title: tenderData?.title,
            client_name: tenderData?.client_name,
            goals: tenderData?.goals,
            scope: tenderData?.scope
          }
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      onContentGenerated(data.content);
      toast.success("Section added!");
      setSpecificRequirement("");
    } catch (error) {
      console.error("Error adding section:", error);
      toast.error("Failed to add section");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-accent" />
          Draft Writer Agent
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          AI assistant to help write and improve your RFP response
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Generate Full Draft */}
        <div className="space-y-2">
          <Button
            onClick={handleGenerateFull}
            disabled={generating}
            className="w-full"
            size="lg"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Complete Draft
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            Generate a full draft that addresses all requirements
          </p>
        </div>

        <div className="border-t pt-4 space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Specific Requirement or Section</label>
            <Textarea
              value={specificRequirement}
              onChange={(e) => setSpecificRequirement(e.target.value)}
              placeholder="E.g., 'Add details about our cloud migration experience' or 'Improve the security compliance section'"
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleImproveSection}
              disabled={generating || !specificRequirement.trim()}
              variant="outline"
              size="sm"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Improve
            </Button>
            <Button
              onClick={handleAddSection}
              disabled={generating || !specificRequirement.trim()}
              variant="outline"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </div>
        </div>

        <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
          <Badge variant="outline" className="mb-2">
            <Sparkles className="mr-1 h-3 w-3" />
            Multi-Agent System
          </Badge>
          <p className="text-xs text-muted-foreground">
            The Draft Writer works with the Requirements Monitor to ensure all requirements are addressed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DraftWriterPanel;
