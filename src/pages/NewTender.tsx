import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AIAnalysisCard from "@/components/tender/AIAnalysisCard";
import GoNoGoDetails from "@/components/tender/GoNoGoDetails";
import RequirementsMatrix from "@/components/tender/RequirementsMatrix";
import EligibilityChecklist from "@/components/tender/EligibilityChecklist";
import { toast } from "sonner";

interface ExtractedData {
  title: string;
  client: string;
  deadline: string;
  requirements: string;
  goals: string;
  scope: string;
  evaluation: string;
  clientSummary: string;
}

const NewTender = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"upload" | "review">("upload");
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [extractedData, setExtractedData] = useState<ExtractedData>({
    title: "",
    client: "",
    deadline: "",
    requirements: "",
    goals: "",
    scope: "",
    evaluation: "",
    clientSummary: ""
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error("Please upload a PDF file");
      return;
    }

    setUploadedFileName(file.name);
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file to edge function:', file.name);
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-rfp`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process document');
      }

      const result = await response.json();
      console.log('Extraction result:', result);

      if (result.success && result.data) {
        setExtractedData(result.data);
        setStep("review");
        toast.success("RFP document analyzed successfully by AI");
      } else {
        throw new Error(result.error || 'Failed to extract data');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(error instanceof Error ? error.message : "Failed to process document. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = () => {
    // In real app, save to database
    toast.success("Tender published successfully");
    navigate("/tenders/1"); // Navigate to the tender detail page with same layout
  };

  // Generate AI analysis data based on extracted RFP data
  const generateAIAnalysis = () => {
    return {
      companyFitScore: 82,
      confidence: 0.86,
      capability: "High",
      compliance: "Medium",
      profitability: "Good",
      deliveryWindow: "Q2-Q3",
      whyFits: [
        "Strong alignment with our digital transformation expertise",
        "Available team capacity matches required skillset",
        "Budget aligns with our typical project range",
        "Timeline is achievable with current resources"
      ],
      risks: [
        "Tight deadline may require resource reallocation",
        "Some compliance gaps need to be addressed",
        "Competing priority with internal initiatives"
      ],
      primaryDept: "Digital Platforms",
      primaryDeptRationale: "Best alignment with project requirements and available expertise",
      coInvolve: "Security Office"
    };
  };

  const generateMockData = () => {
    return {
      goNoGo: {
        deadline: extractedData.deadline || "2025-12-31",
        priority: "High",
        budget: "€420,000",
        budgetType: "T&M w/ cap",
        targetGM: "≥32%",
        strategicContext: "Strategic opportunity",
        pastWin: "Similar project (2024)",
        status: "Open",
        owner: "—"
      },
      executiveSummary: {
        ask: extractedData.goals || "Project objectives to be defined",
        priorities: "Timeline adherence, quality delivery, stakeholder satisfaction",
        deliverables: extractedData.requirements?.split('\n').filter(r => r.trim()) || [
          "Solution architecture and design",
          "Implementation and deployment",
          "Documentation and training",
          "Post-launch support"
        ],
        constraints: extractedData.scope?.split('.').filter(c => c.trim()) || [
          "Budget constraints",
          "Timeline requirements",
          "Compliance requirements"
        ]
      },
      clientSnapshot: {
        agency: extractedData.client || "Client Organization",
        industry: "Technology Services",
        size: "~1,000 FTE",
        procurement: "Competitive tender",
        mandate: extractedData.clientSummary || "Digital transformation initiative",
        contact: "Project Manager (to be assigned)",
        pastWork: [
          "Previous successful collaboration",
          "Strong working relationship",
          "Proven track record"
        ]
      },
      requirements: [
        {
          type: "MUST" as const,
          description: "Core functionality delivery",
          status: "Open" as const,
          action: "Assign technical lead"
        },
        {
          type: "MUST" as const,
          description: "Compliance requirements",
          status: "Gap" as const,
          action: "Schedule compliance review"
        },
        {
          type: "SHOULD" as const,
          description: "Integration capabilities",
          status: "Open" as const,
          action: "Define integration architecture"
        }
      ],
      eligibility: [
        { name: "ISO 27001", status: "met" as const },
        { name: "Company Size", status: "met" as const },
        { name: "Industry Experience", status: "met" as const },
        { name: "Financial Stability", status: "met" as const }
      ],
      evaluation: {
        criteria: [
          { name: "Technical Approach", weight: 35 },
          { name: "Cost & Value", weight: 25 },
          { name: "Delivery Timeline", weight: 20 },
          { name: "Team Experience", weight: 20 }
        ],
        winThemes: [
          "Deep technical expertise",
          "Proven delivery methodology",
          "Strong client relationships",
          "Competitive pricing"
        ],
        gaps: [
          "Need to finalize team composition",
          "Compliance documentation to complete",
          "Reference projects to select"
        ],
        attachments: [
          "Company profile",
          "Team CVs",
          "Case studies",
          "Compliance certificates"
        ]
      }
    };
  };

  const mockData = generateMockData();
  const aiAnalysis = generateAIAnalysis();

  if (step === "review") {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <DashboardHeader />
        <main className="container mx-auto px-6 py-8">
          <Button 
            variant="ghost" 
            onClick={() => setStep("upload")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Upload
          </Button>

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {extractedData.client} — {extractedData.title}
                </h1>
                <p className="text-muted-foreground text-lg">
                  Review extracted information and AI analysis before publishing
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate("/")}>
                  Cancel
                </Button>
                <Button onClick={handlePublish}>
                  Publish & Share
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* AI Analysis Section */}
            <AIAnalysisCard {...aiAnalysis} />

            {/* Go/No-Go Details */}
            <GoNoGoDetails {...mockData.goNoGo} />

            {/* Executive Summary - Editable */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Executive Summary (RFP Ask)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goals">Project Goals & Objectives</Label>
                  <Textarea
                    id="goals"
                    value={extractedData.goals}
                    onChange={(e) => setExtractedData({ ...extractedData, goals: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Key Requirements</Label>
                    <Textarea
                      id="requirements"
                      value={extractedData.requirements}
                      onChange={(e) => setExtractedData({ ...extractedData, requirements: e.target.value })}
                      rows={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scope">Scope & Constraints</Label>
                    <Textarea
                      id="scope"
                      value={extractedData.scope}
                      onChange={(e) => setExtractedData({ ...extractedData, scope: e.target.value })}
                      rows={6}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Two-Column: Client Snapshot & Requirements */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Client Snapshot - Editable */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-accent">AI</span>
                    Client / Agency Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Client Name</Label>
                    <Input
                      id="client"
                      value={extractedData.client}
                      onChange={(e) => setExtractedData({ ...extractedData, client: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientSummary">Client Summary</Label>
                    <Textarea
                      id="clientSummary"
                      value={extractedData.clientSummary}
                      onChange={(e) => setExtractedData({ ...extractedData, clientSummary: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Submission Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={extractedData.deadline}
                      onChange={(e) => setExtractedData({ ...extractedData, deadline: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Requirements Preview */}
              <RequirementsMatrix 
                clientSnapshot={mockData.clientSnapshot}
                requirements={mockData.requirements}
              />
            </div>

            {/* Eligibility Checklist */}
            <EligibilityChecklist items={mockData.eligibility} />

            {/* Evaluation Criteria */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Evaluation Criteria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="evaluation">Evaluation Criteria & Weights</Label>
                  <Textarea
                    id="evaluation"
                    value={extractedData.evaluation}
                    onChange={(e) => setExtractedData({ ...extractedData, evaluation: e.target.value })}
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
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
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Add New Tender</h1>
            <p className="text-muted-foreground">
              Upload an RFP document and let AI extract key information
            </p>
          </div>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Upload RFP Document</CardTitle>
              <CardDescription>
                Upload a PDF file containing the Request for Proposal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-accent transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {uploading ? (
                    <div className="flex flex-col items-center gap-4">
                      <Sparkles className="h-16 w-16 text-accent animate-pulse" />
                      <div>
                        <p className="text-lg font-semibold">Analyzing document with AI...</p>
                        <p className="text-sm text-muted-foreground">
                          Extracting requirements, deadlines, and key information
                        </p>
                        {uploadedFileName && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Processing: {uploadedFileName}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <Upload className="h-16 w-16 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-semibold">Click to upload or drag and drop</p>
                        <p className="text-sm text-muted-foreground">PDF files only</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  What happens next?
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                  <li>AI will analyze the RFP document</li>
                  <li>Key information will be automatically extracted</li>
                  <li>You can review and edit the extracted data</li>
                  <li>Publish and share with your team</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NewTender;
