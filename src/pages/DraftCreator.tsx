import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Users } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CollaborativeEditor from "@/components/editor/CollaborativeEditor";
import RequirementsTracker from "@/components/editor/RequirementsTracker";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Requirement {
  id: string;
  title: string;
  mandatory: boolean;
  completed: boolean;
  description?: string;
}

const DraftCreator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [draftContent, setDraftContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [tenderTitle, setTenderTitle] = useState("");

  useEffect(() => {
    if (id) {
      fetchTenderData();
    }
  }, [id]);

  const fetchTenderData = async () => {
    try {
      const { data: tender, error } = await supabase
        .from("tenders")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (tender) {
        setTenderTitle(tender.title);
        // Parse requirements from tender data
        const parsedRequirements = parseRequirementsFromTender(tender);
        setRequirements(parsedRequirements);
      }
    } catch (error) {
      console.error("Error fetching tender:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Tender-Daten konnten nicht geladen werden",
      });
    }
  };

  const parseRequirementsFromTender = (tender: any): Requirement[] => {
    const reqs: Requirement[] = [];
    
    // Parse requirements string into individual requirements
    if (tender.requirements) {
      const lines = tender.requirements.split('\n').filter((line: string) => line.trim());
      lines.forEach((line: string, index: number) => {
        reqs.push({
          id: `req-${index}`,
          title: line.trim(),
          mandatory: true,
          completed: false,
        });
      });
    }

    // Add evaluation criteria as requirements
    if (tender.evaluation_criteria) {
      const criteriaLines = tender.evaluation_criteria.split('\n').filter((line: string) => line.trim());
      criteriaLines.forEach((line: string, index: number) => {
        reqs.push({
          id: `criteria-${index}`,
          title: line.trim(),
          mandatory: false,
          completed: false,
        });
      });
    }

    // Add deliverables as requirements
    if (tender.deliverables && Array.isArray(tender.deliverables)) {
      tender.deliverables.forEach((deliverable: string, index: number) => {
        reqs.push({
          id: `deliverable-${index}`,
          title: deliverable,
          mandatory: true,
          completed: false,
          description: "Zu lieferndes Element"
        });
      });
    }

    return reqs;
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      // In a real implementation, save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Entwurf gespeichert",
        description: "Ihr RFP-Entwurf wurde erfolgreich gespeichert",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler beim Speichern",
        description: "Der Entwurf konnte nicht gespeichert werden",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRequirementClick = (requirementId: string) => {
    // Toggle requirement completion
    setRequirements(prev =>
      prev.map(req =>
        req.id === requirementId
          ? { ...req, completed: !req.completed }
          : req
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/tenders/${id}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{tenderTitle}</h1>
              <p className="text-sm text-muted-foreground">RFP Response Draft</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20">
              <Users className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Kollaborativ</span>
            </div>
            <Button onClick={handleSaveDraft} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Speichern..." : "Speichern"}
            </Button>
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 h-[calc(100vh-240px)]">
          {/* Left Panel - Requirements & Progress */}
          <div className="overflow-y-auto">
            <RequirementsTracker 
              requirements={requirements}
              onRequirementClick={handleRequirementClick}
            />
          </div>

          {/* Right Panel - Collaborative Editor */}
          <div className="overflow-hidden">
            <CollaborativeEditor 
              tenderId={id || 'default'}
              onContentChange={setDraftContent}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DraftCreator;
