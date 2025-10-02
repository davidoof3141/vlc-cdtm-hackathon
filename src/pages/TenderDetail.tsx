import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileEdit, Download, Share2 } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AIAnalysisCard from "@/components/tender/AIAnalysisCard";
import GoNoGoDetails from "@/components/tender/GoNoGoDetails";
import RequirementsMatrix from "@/components/tender/RequirementsMatrix";
import EligibilityChecklist from "@/components/tender/EligibilityChecklist";
import EvaluationStrategy from "@/components/tender/EvaluationStrategy";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TenderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <DashboardHeader />
        <main className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading tender details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <DashboardHeader />
        <main className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Tender not found</p>
          </div>
        </main>
      </div>
    );
  }

  // Transform database data to component props
  const tenderData = {
    client: tender.client_name,
    projectName: tender.project_name || tender.title,
    subtitle: tender.subtitle || tender.client_summary || "",
    
    aiAnalysis: {
      companyFitScore: tender.company_fit_score || 0,
      confidence: parseFloat(tender.ai_confidence) || 0,
      capability: tender.capability || "Unknown",
      compliance: tender.compliance || "Unknown",
      profitability: tender.profitability || "Unknown",
      deliveryWindow: tender.delivery_window || "TBD",
      whyFits: tender.why_fits || [],
      risks: tender.risks || [],
      primaryDept: tender.primary_dept || "To be assigned",
      primaryDeptRationale: tender.primary_dept_rationale || "",
      coInvolve: tender.co_involve || "To be determined"
    },

    goNoGo: {
      deadline: tender.deadline ? new Date(tender.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "TBD",
      priority: tender.priority || "Medium",
      budget: tender.budget || "TBD",
      budgetType: tender.budget_type || "",
      targetGM: tender.target_gm || "",
      strategicContext: tender.strategic_context || "",
      pastWin: tender.past_win || "",
      status: tender.status || "open",
      owner: tender.owner || "—"
    },

    executiveSummary: {
      ask: tender.executive_summary_ask || tender.goals || "",
      priorities: tender.priorities || "",
      deliverables: tender.deliverables || [],
      constraints: tender.constraints || []
    },

    clientSnapshot: {
      agency: tender.agency || tender.client_name,
      industry: tender.industry || "",
      size: tender.company_size || "",
      procurement: tender.procurement || "",
      mandate: tender.mandate || "",
      contact: tender.contact || "",
      pastWork: tender.past_work || []
    },

    requirements: tender.product_requirements || [],
    eligibility: tender.eligibility_items || [],

    evaluation: {
      criteria: tender.evaluation_weights || [],
      winThemes: tender.win_themes || [],
      gaps: tender.gaps || [],
      attachments: tender.required_attachments || []
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <DashboardHeader />
      <main className="container mx-auto px-6 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {tenderData.client} — {tenderData.projectName}
            </h1>
            <p className="text-muted-foreground text-lg">
              Project: {tenderData.projectName} — {tenderData.subtitle}
            </p>
          </div>
            <div className="flex gap-3">
            <Button onClick={() => navigate(`/tenders/${id}/editor`)}>
              <FileEdit className="mr-2 h-4 w-4" />
              Draft Proposal
            </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Go/No-Go Details */}
          <GoNoGoDetails {...tenderData.goNoGo} />

          {/* Three Column Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* What Client Needs */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">What Client Needs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tenderData.executiveSummary.ask && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Summary</h4>
                    <p className="text-sm text-muted-foreground">{tenderData.executiveSummary.ask}</p>
                  </div>
                )}
                {tenderData.executiveSummary.deliverables && tenderData.executiveSummary.deliverables.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Key Deliverables</h4>
                    <ul className="space-y-1.5">
                      {tenderData.executiveSummary.deliverables.map((item: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tenderData.executiveSummary.constraints && tenderData.executiveSummary.constraints.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Constraints</h4>
                    <ul className="space-y-1.5">
                      {tenderData.executiveSummary.constraints.map((item: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tenderData.executiveSummary.priorities && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Priorities</h4>
                    <p className="text-sm text-muted-foreground">{tenderData.executiveSummary.priorities}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Who is the Client */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Who is the Client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tenderData.clientSnapshot.agency && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Agency</p>
                    <p className="text-sm">{tenderData.clientSnapshot.agency}</p>
                  </div>
                )}
                {tenderData.clientSnapshot.industry && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Industry</p>
                    <p className="text-sm">{tenderData.clientSnapshot.industry}</p>
                  </div>
                )}
                {tenderData.clientSnapshot.size && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Size</p>
                    <p className="text-sm">{tenderData.clientSnapshot.size}</p>
                  </div>
                )}
                {tenderData.clientSnapshot.contact && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Contact</p>
                    <p className="text-sm">{tenderData.clientSnapshot.contact}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Requirements */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Customer Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                {tenderData.requirements.length > 0 ? (
                  <ul className="space-y-3">
                    {tenderData.requirements.slice(0, 6).map((req: any, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <input 
                          type="checkbox" 
                          checked={index % 3 === 0 || index % 5 === 0}
                          readOnly
                          className="mt-1 h-4 w-4 rounded border-border"
                        />
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="text-xs">{req.type || "REQ"}</Badge>
                            <span className="text-sm text-muted-foreground">{req.description}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                    {tenderData.requirements.length > 6 && (
                      <li className="text-sm text-muted-foreground italic pl-7">
                        +{tenderData.requirements.length - 6} more requirements...
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No requirements listed</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Analysis Section */}
          <AIAnalysisCard {...tenderData.aiAnalysis} />

          {/* Executive Summary */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Executive Summary (RFP Ask)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{tenderData.executiveSummary.ask}</p>
              <div>
                <h3 className="font-semibold text-sm mb-2">Priorities</h3>
                <p className="text-sm text-muted-foreground">{tenderData.executiveSummary.priorities}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm mb-2">Deliverables</h3>
                  <ul className="space-y-1">
                    {tenderData.executiveSummary.deliverables.map((item: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-2">Constraints</h3>
                  <ul className="space-y-1">
                    {tenderData.executiveSummary.constraints.map((item: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Two-Column: Client Snapshot & Requirements */}
          <RequirementsMatrix 
            clientSnapshot={tenderData.clientSnapshot}
            requirements={tenderData.requirements}
          />

          {/* Eligibility Checklist */}
          <EligibilityChecklist items={tenderData.eligibility} />

          {/* Evaluation Criteria & Strategy */}
          <EvaluationStrategy {...tenderData.evaluation} />
        </div>
      </main>
    </div>
  );
};

export default TenderDetail;
