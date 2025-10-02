import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Target, User } from "lucide-react";

interface GoNoGoDetailsProps {
  deadline: string;
  priority: string;
  budget: string;
  budgetType: string;
  targetGM: string;
  strategicContext: string;
  pastWin: string;
  status: string;
  owner: string;
}

const GoNoGoDetails = ({
  deadline,
  priority,
  budget,
  budgetType,
  targetGM,
  strategicContext,
  pastWin,
  status,
  owner
}: GoNoGoDetailsProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Go / No-Go Supporting Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Deadline
            </div>
            <p className="font-semibold">{deadline}</p>
            <Badge variant="destructive" className="text-xs">
              Priority: {priority}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Budget
            </div>
            <p className="font-semibold">{budget}</p>
            <p className="text-xs text-muted-foreground">{budgetType}</p>
            <p className="text-xs text-muted-foreground">Target GM {targetGM}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Target className="h-4 w-4 text-muted-foreground" />
              Strategic Context
            </div>
            <p className="text-sm">{strategicContext}</p>
            <p className="text-xs text-muted-foreground">Past win: {pastWin}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-muted-foreground" />
              Status
            </div>
            <Badge variant="outline">{status}</Badge>
            <p className="text-sm text-muted-foreground">Owner: {owner}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoNoGoDetails;
