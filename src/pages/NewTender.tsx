import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "sonner";

const NewTender = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"upload" | "review">("upload");
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState({
    title: "Digital Transformation Initiative",
    client: "Global Finance Corp",
    deadline: "2025-11-15",
    requirements: "- Modernize legacy banking systems\n- Implement cloud-native architecture\n- Ensure regulatory compliance\n- Provide staff training",
    goals: "Transform enterprise banking infrastructure to support digital-first customer experiences while maintaining security and compliance standards.",
    scope: "Full-stack modernization including frontend applications, backend services, database migration, and integration with third-party fintech solutions.",
    evaluation: "- Technical approach (30%)\n- Team experience (25%)\n- Cost effectiveness (20%)\n- Timeline feasibility (15%)\n- Innovation (10%)",
    clientSummary: "Global Finance Corp is a leading international banking institution with over 50 years of experience. They prioritize security, compliance, and customer experience in all technology initiatives."
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      // Simulate AI extraction
      setTimeout(() => {
        setUploading(false);
        setStep("review");
        toast.success("RFP document analyzed successfully");
      }, 2000);
    }
  };

  const handlePublish = () => {
    toast.success("Tender published successfully");
    navigate("/");
  };

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

          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Review Extracted Information</h1>
              <p className="text-muted-foreground">
                AI has extracted key information from your RFP. Review and edit as needed.
              </p>
            </div>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  AI-Extracted Data
                </CardTitle>
                <CardDescription>
                  All fields are editable. Click on any field to make changes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Tender Title</Label>
                  <Input
                    id="title"
                    value={extractedData.title}
                    onChange={(e) => setExtractedData({ ...extractedData, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Client Name</Label>
                    <Input
                      id="client"
                      value={extractedData.client}
                      onChange={(e) => setExtractedData({ ...extractedData, client: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={extractedData.deadline}
                      onChange={(e) => setExtractedData({ ...extractedData, deadline: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    value={extractedData.requirements}
                    onChange={(e) => setExtractedData({ ...extractedData, requirements: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals">Goals</Label>
                  <Textarea
                    id="goals"
                    value={extractedData.goals}
                    onChange={(e) => setExtractedData({ ...extractedData, goals: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scope">Scope</Label>
                  <Textarea
                    id="scope"
                    value={extractedData.scope}
                    onChange={(e) => setExtractedData({ ...extractedData, scope: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evaluation">Evaluation Criteria</Label>
                  <Textarea
                    id="evaluation"
                    value={extractedData.evaluation}
                    onChange={(e) => setExtractedData({ ...extractedData, evaluation: e.target.value })}
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientSummary">Client Summary</Label>
                  <Textarea
                    id="clientSummary"
                    value={extractedData.clientSummary}
                    onChange={(e) => setExtractedData({ ...extractedData, clientSummary: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button onClick={handlePublish}>
                Publish & Share
              </Button>
            </div>
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
                        <p className="text-lg font-semibold">Analyzing document...</p>
                        <p className="text-sm text-muted-foreground">
                          AI is extracting key information from your RFP
                        </p>
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
