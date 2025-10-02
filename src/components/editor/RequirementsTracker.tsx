import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Circle, AlertTriangle } from 'lucide-react';

interface Requirement {
  id: string;
  title: string;
  mandatory: boolean;
  completed: boolean;
  description?: string;
}

interface RequirementsTrackerProps {
  requirements: Requirement[];
  onToggleRequirement?: (id: string) => void;
}

const RequirementsTracker = ({ requirements, onToggleRequirement }: RequirementsTrackerProps) => {
  const mandatoryReqs = requirements.filter(r => r.mandatory);
  const optionalReqs = requirements.filter(r => !r.mandatory);
  
  const mandatoryCompleted = mandatoryReqs.filter(r => r.completed).length;
  const optionalCompleted = optionalReqs.filter(r => r.completed).length;
  
  const mandatoryProgress = mandatoryReqs.length > 0 
    ? (mandatoryCompleted / mandatoryReqs.length) * 100 
    : 100;
  
  const optionalProgress = optionalReqs.length > 0 
    ? (optionalCompleted / optionalReqs.length) * 100 
    : 100;
  
  const overallProgress = requirements.length > 0
    ? ((mandatoryCompleted + optionalCompleted) / requirements.length) * 100
    : 100;

  const hasMissingMandatory = mandatoryCompleted < mandatoryReqs.length;

  return (
    <div className="space-y-4 h-full overflow-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Completion</span>
              <span className="font-semibold">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} />
          </div>

          {hasMissingMandatory && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {mandatoryReqs.length - mandatoryCompleted} mandatory requirement(s) incomplete
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {mandatoryReqs.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Mandatory Requirements</CardTitle>
              <Badge variant={hasMissingMandatory ? 'destructive' : 'default'}>
                {mandatoryCompleted}/{mandatoryReqs.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={mandatoryProgress} />
            <div className="space-y-2">
              {mandatoryReqs.map((req) => (
                <div
                  key={req.id}
                  className="flex items-start gap-2 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => onToggleRequirement?.(req.id)}
                >
                  {req.completed ? (
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${req.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {req.title}
                    </p>
                    {req.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {req.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {optionalReqs.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Optional Requirements</CardTitle>
              <Badge variant="secondary">
                {optionalCompleted}/{optionalReqs.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={optionalProgress} />
            <div className="space-y-2">
              {optionalReqs.map((req) => (
                <div
                  key={req.id}
                  className="flex items-start gap-2 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => onToggleRequirement?.(req.id)}
                >
                  {req.completed ? (
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${req.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {req.title}
                    </p>
                    {req.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {req.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RequirementsTracker;
