import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface EligibilityItem {
  name: string;
  status: "met" | "expiring" | "missing";
  action?: string;
}

interface EligibilityChecklistProps {
  items: EligibilityItem[];
}

const EligibilityChecklist = ({ items }: EligibilityChecklistProps) => {
  const getIcon = (status: string) => {
    switch (status) {
      case "met":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "expiring":
        return <Clock className="h-5 w-5 text-warning" />;
      default:
        return <XCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "met":
        return <Badge variant="outline" className="border-success text-success">✓</Badge>;
      case "expiring":
        return <Badge variant="outline" className="border-warning text-warning">Expiring</Badge>;
      default:
        return <Badge variant="outline" className="border-destructive text-destructive">✗</Badge>;
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Eligibility & Company Requirements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                {getIcon(item.status)}
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              {getStatusBadge(item.status)}
            </div>
          ))}
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm">
            Add exception note
          </Button>
          <Button variant="outline" size="sm">
            Schedule audit update
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EligibilityChecklist;
