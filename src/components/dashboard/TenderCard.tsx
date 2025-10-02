import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Building2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import type { Tender } from "@/pages/Dashboard";

interface TenderCardProps {
  tender: Tender;
}

const TenderCard = ({ tender }: TenderCardProps) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="outline" className="border-info text-info">Open</Badge>;
      case "running":
        return <Badge variant="outline" className="border-warning text-warning">In Progress</Badge>;
      case "closed":
        return <Badge variant="outline" className="border-muted-foreground text-muted-foreground">Closed</Badge>;
      default:
        return null;
    }
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className="group hover:shadow-elegant transition-all duration-300 cursor-pointer border-border/50">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-accent transition-colors">
            {tender.title}
          </CardTitle>
          {getStatusBadge(tender.status)}
        </div>
        <CardDescription className="line-clamp-2">
          {tender.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{tender.client}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Deadline: {formatDeadline(tender.deadline)}</span>
          </div>
        </div>

        {tender.status === "running" && tender.progress !== undefined && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{tender.progress}%</span>
            </div>
            <Progress value={tender.progress} className="h-2" />
          </div>
        )}

        <Button 
          onClick={() => navigate(`/tenders/${tender.id}`)}
          variant="ghost" 
          className="w-full justify-between group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
        >
          View Details
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default TenderCard;
