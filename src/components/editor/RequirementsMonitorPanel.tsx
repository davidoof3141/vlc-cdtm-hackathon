import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, XCircle, RefreshCw, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Requirement {
  requirement: string;
  status: "met" | "partial" | "missing";
  coverage: number;
  feedback: string;
  suggestions: string;
}

interface Analysis {
  overallScore: number;
  summary: string;
  requirements: Requirement[];
  nextSteps: string[];
}

interface RequirementsMonitorPanelProps {
  draftContent: string;
  tenderData: any;
}

const RequirementsMonitorPanel = ({ draftContent, tenderData }: RequirementsMonitorPanelProps) => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [autoMonitor, setAutoMonitor] = useState(true);
  const [expandedRequirements, setExpandedRequirements] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (autoMonitor && draftContent) {
      const debounceTimer = setTimeout(() => {
        analyzeRequirements();
      }, 3000); // Debounce for 3 seconds

      return () => clearTimeout(debounceTimer);
    }
  }, [draftContent, autoMonitor]);

  const analyzeRequirements = async () => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("requirements-monitor", {
        body: {
          draftContent,
          requirements: tenderData?.requirements || "No requirements specified",
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

      setAnalysis(data.analysis);
    } catch (error) {
      console.error("Error analyzing requirements:", error);
      toast.error("Failed to analyze requirements");
    } finally {
      setAnalyzing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "met":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "partial":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "missing":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const toggleRequirement = (index: number) => {
    setExpandedRequirements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "met":
        return "border-success text-success";
      case "partial":
        return "border-warning text-warning";
      case "missing":
        return "border-destructive text-destructive";
      default:
        return "";
    }
  };

  return (
    <Card className="shadow-card h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Requirements Monitor
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={analyzeRequirements}
            disabled={analyzing}
          >
            <RefreshCw className={`h-4 w-4 ${analyzing ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge
            variant={autoMonitor ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setAutoMonitor(!autoMonitor)}
          >
            Auto-monitor: {autoMonitor ? "ON" : "OFF"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-4">

        {analysis && (
          <>
            {/* Overall Score */}
            <div className="space-y-2 p-4 bg-accent/5 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Overall Compliance</span>
                <span className="text-2xl font-bold text-accent">{analysis.overallScore}%</span>
              </div>
              <Progress value={analysis.overallScore} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">{analysis.summary}</p>
            </div>

            {/* Requirements List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Requirement Status</h3>
              {analysis.requirements.map((req, index) => {
                const isExpanded = expandedRequirements.has(index);
                return (
                  <div 
                    key={index} 
                    className={`group/req border rounded-lg overflow-hidden transition-all cursor-pointer ${getStatusColor(req.status)}`}
                    onClick={() => toggleRequirement(index)}
                  >
                    {/* Always visible header */}
                    <div className="p-3">
                      <div className="flex items-start gap-2">
                        {getStatusIcon(req.status)}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{req.requirement}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {req.coverage}% covered
                            </Badge>
                            <Badge variant="outline" className="text-xs capitalize">
                              {req.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expandable details on hover or when clicked */}
                    <div className={`overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'max-h-96' : 'max-h-0 group-hover/req:max-h-96'
                    }`}>
                      <div className="px-3 pb-3 space-y-2">
                        <p className="text-xs text-muted-foreground">{req.feedback}</p>
                        {req.suggestions && (
                          <p className="text-xs bg-background/50 p-2 rounded">
                            <span className="font-medium">Suggestion: </span>
                            {req.suggestions}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Steps */}
            {analysis.nextSteps && analysis.nextSteps.length > 0 && (
              <div className="space-y-2 p-3 bg-info/10 border border-info/20 rounded-lg">
                <h3 className="font-semibold text-sm">Next Steps</h3>
                <ul className="space-y-1">
                  {analysis.nextSteps.map((step, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-info mt-0.5">•</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {analyzing && !analysis && (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-accent" />
          </div>
        )}

        {!analysis && !analyzing && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Sparkles className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Start writing to get AI-powered requirement analysis
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RequirementsMonitorPanel;
