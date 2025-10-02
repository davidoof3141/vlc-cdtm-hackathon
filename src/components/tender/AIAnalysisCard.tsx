import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, Send, Forward, HelpCircle, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface AIAnalysisProps {
  companyFitScore: number;
  confidence: number;
  capability: string;
  compliance: string;
  profitability: string;
  deliveryWindow: string;
  whyFits: string[];
  risks: string[];
  primaryDept: string;
  primaryDeptRationale: string;
  coInvolve: string;
}

const AIAnalysisCard = ({
  companyFitScore,
  confidence,
  capability,
  compliance,
  profitability,
  deliveryWindow,
  whyFits,
  risks,
  primaryDept,
  primaryDeptRationale,
  coInvolve
}: AIAnalysisProps) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const getFitLabel = (score: number) => {
    if (score >= 80) return "Good";
    if (score >= 60) return "Moderate";
    return "Low";
  };

  const handleProceed = () => {
    navigate(`/tenders/${id}/editor`);
    toast.success("Creating pursuit...");
  };

  const handleForward = () => {
    toast.success(`Forwarded to ${primaryDept}`);
  };

  const handleClarification = () => {
    window.location.href = `mailto:?subject=Clarification Request for Tender&body=Dear Team,%0D%0A%0D%0AI would like to request clarification on the following tender:%0D%0A%0D%0ATender: [Tender Title]%0D%0A%0D%0APlease provide additional information on:%0D%0A- [Your question here]`;
  };

  const handleDecline = () => {
    toast.success("Decline note drafted");
  };

  return (
    <Card className="shadow-elegant border-accent/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Analysis & Recommendation
          </CardTitle>
          <Badge variant="secondary" className="gap-1">
            Confidence {confidence.toFixed(2)}
          </Badge>
        </div>
        <Button variant="outline" size="sm" className="mt-2">
          Verify & Enrich
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Fit */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">COMPANY FIT</h3>
            <Badge variant="outline" className="text-lg px-3">
              {companyFitScore}%
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Fit to Company</span>
              <span className="text-muted-foreground">{getFitLabel(companyFitScore)}</span>
            </div>
            <Progress value={companyFitScore} className="h-3" />
          </div>
          
          {/* KPIs Inline */}
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-medium">Capability:</span>
              <Badge variant="outline">{capability}</Badge>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Compliance:</span>
              <Badge variant="outline">{compliance}</Badge>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Profitability:</span>
              <Badge variant="outline">{profitability}</Badge>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Delivery window:</span>
              <Badge variant="outline">{deliveryWindow}</Badge>
            </div>
          </div>

          {/* Why Fits */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              Why This Fits
            </h4>
            <ul className="space-y-1 ml-6">
              {whyFits.map((reason, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-success mt-0.5 flex-shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Risks / Why Not
            </h4>
            <ul className="space-y-1 ml-6">
              {risks.map((risk, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 flex-shrink-0" />
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Department Fit & Actions */}
        <div className="space-y-4 pt-4 border-t">
          <div>
            <h3 className="font-semibold text-lg mb-2">DEPARTMENT FIT & ACTIONS</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-sm">Primary department: </span>
                <Badge variant="default">{primaryDept}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{primaryDeptRationale}</p>
              <div>
                <span className="font-medium text-sm">Co-involve: </span>
                <Badge variant="secondary">{coInvolve}</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleProceed} size="sm">
              <Send className="mr-2 h-4 w-4" />
              Proceed (Create pursuit)
            </Button>
            <Button onClick={handleForward} variant="outline" size="sm">
              <Forward className="mr-2 h-4 w-4" />
              Forward to {primaryDept}
            </Button>
            <Button onClick={handleClarification} variant="outline" size="sm">
              <HelpCircle className="mr-2 h-4 w-4" />
              Request clarifications
            </Button>
            <Button onClick={handleDecline} variant="outline" size="sm" className="text-destructive hover:text-destructive">
              <X className="mr-2 h-4 w-4" />
              Decline & auto-draft note
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAnalysisCard;
