import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Circle } from "lucide-react";

interface Requirement {
  type: "MUST" | "SHOULD" | "NICE";
  description: string;
  status: "Met" | "Gap" | "Open";
  action?: string;
}

interface ClientSnapshot {
  agency: string;
  industry: string;
  size: string;
  procurement: string;
  mandate: string;
  contact: string;
  pastWork: string[];
}

interface RequirementsMatrixProps {
  clientSnapshot: ClientSnapshot;
  requirements: Requirement[];
}

const RequirementsMatrix = ({ clientSnapshot, requirements }: RequirementsMatrixProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Met":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "Gap":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Met":
        return <Badge variant="outline" className="border-success text-success">Met</Badge>;
      case "Gap":
        return <Badge variant="outline" className="border-warning text-warning">Gap ⚠</Badge>;
      default:
        return <Badge variant="outline">Open</Badge>;
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Client Snapshot */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-accent">AI</span>
            Client / Agency Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium">Agency:</span>
              <p className="text-muted-foreground">{clientSnapshot.agency}</p>
            </div>
            <div>
              <span className="font-medium">Industry:</span>
              <p className="text-muted-foreground">{clientSnapshot.industry}</p>
            </div>
            <div>
              <span className="font-medium">Size:</span>
              <p className="text-muted-foreground">{clientSnapshot.size}</p>
            </div>
            <div>
              <span className="font-medium">Procurement:</span>
              <p className="text-muted-foreground">{clientSnapshot.procurement}</p>
            </div>
          </div>
          
          <div className="space-y-2 pt-2 border-t">
            <div>
              <span className="font-medium text-sm">Mandate & Programs:</span>
              <p className="text-sm text-muted-foreground">{clientSnapshot.mandate}</p>
            </div>
            <div>
              <span className="font-medium text-sm">Contact & Dept:</span>
              <p className="text-sm text-muted-foreground">{clientSnapshot.contact}</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <span className="font-medium text-sm">Past Work with Us:</span>
            <ul className="space-y-1">
              {clientSnapshot.pastWork.map((work, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-success mt-0.5 flex-shrink-0" />
                  {work}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Key Product Requirements */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Key Product Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {requirements.map((req, index) => (
            <div key={index} className="p-3 border rounded-lg space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1">
                  {getStatusIcon(req.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {req.type}
                      </Badge>
                      {getStatusBadge(req.status)}
                    </div>
                    <p className="text-sm font-medium">{req.description}</p>
                  </div>
                </div>
              </div>
              {req.action && (
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                  Action: {req.action}
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default RequirementsMatrix;
