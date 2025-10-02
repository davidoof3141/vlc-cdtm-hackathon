import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, CheckCircle, FileText } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const DraftCreator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDraft, setSelectedDraft] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);

  const drafts = [
    {
      id: 1,
      title: "Professional & Technical",
      tone: "formal",
      preview: "NTT DATA is pleased to submit our proposal for the Digital Transformation Initiative. With over 50 years of experience in enterprise technology solutions, we bring a comprehensive approach to modernizing your banking infrastructure...",
      strengths: ["Emphasizes credentials", "Detailed technical approach", "Formal language"]
    },
    {
      id: 2,
      title: "Innovative & Forward-Thinking",
      tone: "innovative",
      preview: "At NTT DATA, we see the Digital Transformation Initiative as an opportunity to revolutionize your banking infrastructure using cutting-edge cloud technologies and AI-driven solutions. Our agile methodology ensures rapid deployment...",
      strengths: ["Highlights innovation", "Modern approach", "Agile methodology"]
    },
    {
      id: 3,
      title: "Partnership-Focused",
      tone: "collaborative",
      preview: "We view this Digital Transformation Initiative as the beginning of a strategic partnership with Global Finance Corp. NTT DATA's collaborative approach ensures your team is involved at every stage, from planning to implementation...",
      strengths: ["Emphasizes collaboration", "Client-centric", "Long-term partnership"]
    }
  ];

  const handleGenerateMore = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      toast.success("New draft variations generated");
    }, 2000);
  };

  const handleSelectDraft = (draftId: number) => {
    setSelectedDraft(draftId);
    toast.success("Draft selected. You can now move to collaborative editing.");
  };

  const handleMoveToEditor = () => {
    if (selectedDraft) {
      navigate(`/tenders/${id}/editor`);
    }
  };

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

        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-accent" />
              Draft Response Generator
            </h1>
            <p className="text-muted-foreground">
              AI has generated multiple draft responses with different tones and approaches. 
              Select the one that best fits your needs.
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Badge variant="outline" className="border-accent text-accent">
                3 drafts generated
              </Badge>
              {selectedDraft && (
                <Badge variant="default">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Draft {selectedDraft} selected
                </Badge>
              )}
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleGenerateMore}
                disabled={generating}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {generating ? "Generating..." : "Generate More Variations"}
              </Button>
              {selectedDraft && (
                <Button onClick={handleMoveToEditor}>
                  <FileText className="mr-2 h-4 w-4" />
                  Move to Editor
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="compare" className="w-full">
            <TabsList>
              <TabsTrigger value="compare">Compare Drafts</TabsTrigger>
              <TabsTrigger value="draft1">Draft 1</TabsTrigger>
              <TabsTrigger value="draft2">Draft 2</TabsTrigger>
              <TabsTrigger value="draft3">Draft 3</TabsTrigger>
            </TabsList>

            <TabsContent value="compare" className="space-y-4">
              {drafts.map((draft) => (
                <Card 
                  key={draft.id}
                  className={`shadow-card transition-all cursor-pointer ${
                    selectedDraft === draft.id 
                      ? 'ring-2 ring-accent border-accent' 
                      : 'hover:shadow-elegant'
                  }`}
                  onClick={() => handleSelectDraft(draft.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{draft.title}</CardTitle>
                        <Badge variant="secondary">{draft.tone}</Badge>
                      </div>
                      {selectedDraft === draft.id && (
                        <CheckCircle className="h-6 w-6 text-accent" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {draft.preview}
                    </p>
                    <div>
                      <p className="text-sm font-semibold mb-2">Key Strengths:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {draft.strengths.map((strength, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {drafts.map((draft) => (
              <TabsContent key={draft.id} value={`draft${draft.id}`}>
                <Card className="shadow-elegant">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{draft.title}</CardTitle>
                        <Badge variant="secondary">{draft.tone}</Badge>
                      </div>
                      <Button 
                        onClick={() => handleSelectDraft(draft.id)}
                        variant={selectedDraft === draft.id ? "default" : "outline"}
                      >
                        {selectedDraft === draft.id ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Selected
                          </>
                        ) : (
                          "Select This Draft"
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Full Draft Preview</h3>
                      <div className="prose max-w-none text-muted-foreground">
                        <p className="mb-4">{draft.preview}</p>
                        <p className="mb-4">
                          Our comprehensive approach includes detailed analysis of your current infrastructure, 
                          a phased migration strategy, and ongoing support to ensure success. We understand the 
                          critical importance of maintaining security and compliance throughout the transformation process.
                        </p>
                        <p>
                          The proposed solution leverages industry-leading cloud platforms, modern DevOps practices, 
                          and our proprietary frameworks developed over decades of enterprise transformation projects. 
                          Our team brings deep expertise in banking technology and regulatory compliance.
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Strengths of this approach:</h3>
                      <ul className="space-y-2">
                        {draft.strengths.map((strength, index) => (
                          <li key={index} className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DraftCreator;
