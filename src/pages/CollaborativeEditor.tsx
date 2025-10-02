import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Download, Users, CheckCircle, AlertCircle } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const CollaborativeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(
    "NTT DATA is pleased to submit our proposal for the Digital Transformation Initiative. With over 50 years of experience in enterprise technology solutions, we bring a comprehensive approach to modernizing your banking infrastructure.\n\nOur comprehensive approach includes detailed analysis of your current infrastructure, a phased migration strategy, and ongoing support to ensure success. We understand the critical importance of maintaining security and compliance throughout the transformation process.\n\nThe proposed solution leverages industry-leading cloud platforms, modern DevOps practices, and our proprietary frameworks developed over decades of enterprise transformation projects. Our team brings deep expertise in banking technology and regulatory compliance."
  );

  const [complianceScore] = useState(75);
  const [requirements] = useState([
    { text: "Modernize legacy banking systems", covered: true },
    { text: "Implement cloud-native architecture", covered: true },
    { text: "Ensure regulatory compliance", covered: true },
    { text: "Provide staff training", covered: false },
    { text: "Migration timeline details", covered: false }
  ]);

  const handleSave = () => {
    toast.success("Draft saved successfully");
  };

  const handleExport = () => {
    toast.success("Exporting draft as Word document...");
  };

  const coveredCount = requirements.filter(r => r.covered).length;
  const totalCount = requirements.length;

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
            <h1 className="text-3xl font-bold mb-2">Collaborative Editor</h1>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                2 users online
              </Badge>
              <span className="text-sm text-muted-foreground">Last saved 2 minutes ago</span>
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
          {/* Editor */}
          <div className="lg:col-span-2">
            <Card className="shadow-elegant h-[600px]">
              <CardHeader>
                <CardTitle>Response Draft</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-80px)]">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="h-full resize-none font-mono text-sm"
                  placeholder="Start writing your response..."
                />
              </CardContent>
            </Card>
          </div>

          {/* AI Analysis Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">AI Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Compliance Score</span>
                    <span className="text-2xl font-bold text-accent">{complianceScore}%</span>
                  </div>
                  <Progress value={complianceScore} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on requirement coverage and evaluation criteria
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3">
                    Requirements Coverage ({coveredCount}/{totalCount})
                  </h3>
                  <div className="space-y-2">
                    {requirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        {req.covered ? (
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                        )}
                        <span className={req.covered ? "text-foreground" : "text-muted-foreground"}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="text-sm font-medium mb-1">Missing: Staff Training</p>
                  <p className="text-xs text-muted-foreground">
                    Consider adding details about your training program and methodology
                  </p>
                </div>
                <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
                  <p className="text-sm font-medium mb-1">Enhance: Timeline Details</p>
                  <p className="text-xs text-muted-foreground">
                    Include specific milestones and delivery dates for better evaluation score
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Active Collaborators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    JD
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">John Doe (You)</p>
                    <p className="text-xs text-muted-foreground">Editing now</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-success" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-medium">
                    AS
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Alice Smith</p>
                    <p className="text-xs text-muted-foreground">Viewing</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-muted" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollaborativeEditor;
