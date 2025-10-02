import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "sonner";
import CollaborativeEditor from "@/components/editor/CollaborativeEditor";
import RequirementsTracker from "@/components/editor/RequirementsTracker";
import { supabase } from "@/integrations/supabase/client";

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
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenderData = async () => {
      if (!id) return;

      try {
        const { data: tender, error } = await supabase
          .from('tenders')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Parse requirements from tender data
        const reqs: Requirement[] = [];
        
        // Add requirements from requirements field
        if (tender.requirements) {
          const reqLines = tender.requirements.split('\n').filter((line: string) => line.trim());
          reqLines.forEach((line: string, idx: number) => {
            reqs.push({
              id: `req-${idx}`,
              title: line.trim(),
              mandatory: true,
              completed: false,
              description: 'From requirements section'
            });
          });
        }

        // Add evaluation criteria
        if (tender.evaluation_criteria) {
          const criteriaLines = tender.evaluation_criteria.split('\n').filter((line: string) => line.trim());
          criteriaLines.forEach((line: string, idx: number) => {
            reqs.push({
              id: `criteria-${idx}`,
              title: line.trim(),
              mandatory: false,
              completed: false,
              description: 'Evaluation criteria'
            });
          });
        }

        // Add deliverables as requirements
        if (tender.deliverables && Array.isArray(tender.deliverables)) {
          tender.deliverables.forEach((deliverable: any, idx: number) => {
            reqs.push({
              id: `deliverable-${idx}`,
              title: typeof deliverable === 'string' ? deliverable : deliverable.title || 'Deliverable',
              mandatory: true,
              completed: false,
              description: 'Required deliverable'
            });
          });
        }

        setRequirements(reqs);
      } catch (error) {
        console.error('Error fetching tender:', error);
        toast.error('Failed to load tender data');
      } finally {
        setLoading(false);
      }
    };

    fetchTenderData();
  }, [id]);

  const handleToggleRequirement = (reqId: string) => {
    setRequirements(prev =>
      prev.map(req =>
        req.id === reqId ? { ...req, completed: !req.completed } : req
      )
    );
  };

  const handleSave = (content: string) => {
    console.log('Saving draft:', content);
    toast.success('Draft saved successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <DashboardHeader />
        <main className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-96">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Left side - Requirements & Progress */}
          <div className="lg:col-span-1">
            <RequirementsTracker 
              requirements={requirements}
              onToggleRequirement={handleToggleRequirement}
            />
          </div>

          {/* Right side - Collaborative Editor */}
          <div className="lg:col-span-2">
            <CollaborativeEditor 
              tenderId={id || ''}
              onSave={handleSave}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DraftCreator;
