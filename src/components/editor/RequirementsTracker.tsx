import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Requirement {
  id: string;
  title: string;
  mandatory: boolean;
  completed: boolean;
  description?: string;
}

interface RequirementsTrackerProps {
  requirements: Requirement[];
  onRequirementClick?: (requirementId: string) => void;
}

const RequirementsTracker = ({ requirements, onRequirementClick }: RequirementsTrackerProps) => {
  const mandatoryRequirements = requirements.filter(r => r.mandatory);
  const optionalRequirements = requirements.filter(r => !r.mandatory);
  
  const completedMandatory = mandatoryRequirements.filter(r => r.completed).length;
  const totalMandatory = mandatoryRequirements.length;
  const mandatoryProgress = totalMandatory > 0 ? (completedMandatory / totalMandatory) * 100 : 0;

  const completedOptional = optionalRequirements.filter(r => r.completed).length;
  const totalOptional = optionalRequirements.length;

  const incompleteMandatory = mandatoryRequirements.filter(r => !r.completed);

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Gesamtfortschritt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Pflichtanforderungen</span>
              <span className="text-sm text-muted-foreground">
                {completedMandatory} / {totalMandatory}
              </span>
            </div>
            <Progress value={mandatoryProgress} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Optionale Anforderungen</span>
              <span className="text-sm text-muted-foreground">
                {completedOptional} / {totalOptional}
              </span>
            </div>
            <Progress 
              value={totalOptional > 0 ? (completedOptional / totalOptional) * 100 : 0} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Warnings for incomplete mandatory */}
      {incompleteMandatory.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <span className="font-semibold">{incompleteMandatory.length} Pflichtanforderung(en) fehlen noch!</span>
            <div className="mt-2 space-y-1">
              {incompleteMandatory.map(req => (
                <div key={req.id} className="text-sm">
                  • {req.title}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Mandatory Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Pflichtanforderungen</span>
            <Badge variant={completedMandatory === totalMandatory ? "default" : "destructive"}>
              {completedMandatory}/{totalMandatory}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {mandatoryRequirements.map((req) => (
                <div
                  key={req.id}
                  onClick={() => onRequirementClick?.(req.id)}
                  className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  {req.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{req.title}</div>
                    {req.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {req.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Optional Requirements */}
      {optionalRequirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Optionale Anforderungen</span>
              <Badge variant="secondary">
                {completedOptional}/{totalOptional}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-2">
                {optionalRequirements.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => onRequirementClick?.(req.id)}
                    className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    {req.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{req.title}</div>
                      {req.description && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {req.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RequirementsTracker;
