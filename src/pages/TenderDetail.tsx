import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Calendar, Building2, Target, CheckSquare, Sparkles, Users } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Progress } from "@/components/ui/progress";

const TenderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, fetch based on id
  const tender = {
    id,
    title: "Digital Transformation Initiative",
    client: "Global Finance Corp",
    deadline: "2025-11-15",
    status: "open",
    description: "Comprehensive digital transformation project for enterprise banking systems",
    requirements: "- Modernize legacy banking systems\n- Implement cloud-native architecture\n- Ensure regulatory compliance\n- Provide staff training",
    goals: "Transform enterprise banking infrastructure to support digital-first customer experiences while maintaining security and compliance standards.",
    scope: "Full-stack modernization including frontend applications, backend services, database migration, and integration with third-party fintech solutions.",
    evaluation: "- Technical approach (30%)\n- Team experience (25%)\n- Cost effectiveness (20%)\n- Timeline feasibility (15%)\n- Innovation (10%)",
    clientSummary: "Global Finance Corp is a leading international banking institution with over 50 years of experience. They prioritize security, compliance, and customer experience in all technology initiatives.",
    timeline: [
      { phase: "RFP Release", date: "2025-10-01", status: "completed" },
      { phase: "Questions Due", date: "2025-10-15", status: "completed" },
      { phase: "Draft Submission", date: "2025-11-01", status: "upcoming" },
      { phase: "Final Submission", date: "2025-11-15", status: "upcoming" },
    ]
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{tender.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {tender.client}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {new Date(tender.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-info text-info">Open</Badge>
                </div>
              </CardHeader>
            </Card>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tender.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Goals & Objectives
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tender.goals}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Client Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tender.clientSummary}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckSquare className="h-5 w-5" />
                      Key Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-line text-muted-foreground">
                      {tender.requirements}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Scope of Work</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tender.scope}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Evaluation Criteria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-line text-muted-foreground">
                      {tender.evaluation}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Project Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tender.timeline.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${
                            item.status === 'completed' ? 'bg-success' : 'bg-muted'
                          }`} />
                          <div className="flex-1">
                            <p className="font-medium">{item.phase}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.date).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                          <Badge variant={item.status === 'completed' ? 'default' : 'outline'}>
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="default"
                  onClick={() => navigate(`/tenders/${id}/draft`)}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create Draft Response
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate(`/tenders/${id}/editor`)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Collaborative Editor
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      JD
                    </div>
                    <div>
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-muted-foreground">Lead</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-medium">
                      AS
                    </div>
                    <div>
                      <p className="text-sm font-medium">Alice Smith</p>
                      <p className="text-xs text-muted-foreground">Writer</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TenderDetail;
