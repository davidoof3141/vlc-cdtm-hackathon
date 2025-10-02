import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EvaluationCriteria {
  name: string;
  weight: number;
}

interface EvaluationStrategyProps {
  criteria: EvaluationCriteria[];
  winThemes: string[];
  gaps: string[];
  attachments: string[];
}

const EvaluationStrategy = ({ criteria, winThemes, gaps, attachments }: EvaluationStrategyProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Evaluation Criteria & Strategy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Weighting</h3>
          {criteria.map((criterion, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{criterion.name}</span>
                <span className="text-muted-foreground">{criterion.weight}%</span>
              </div>
              <Progress value={criterion.weight} className="h-2" />
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Win Themes</h3>
            <ul className="space-y-1">
              {winThemes.map((theme, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  {theme}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Gaps to Close</h3>
            <ul className="space-y-1">
              {gaps.map((gap, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                  {gap}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Required Attachments</h3>
            <ul className="space-y-1">
              {attachments.map((attachment, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                  {attachment}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EvaluationStrategy;
