import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, Lightbulb, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Requirement {
  id: string;
  title: string;
  mandatory: boolean;
  completed: boolean;
  description?: string;
}

interface AnalysisResult {
  requirementId: string;
  isMet: boolean;
  explanation: string;
  suggestion?: string;
}

interface AIAnalysisPanelProps {
  requirements: Requirement[];
  draftContent: string;
  onUpdateRequirement: (id: string, isMet: boolean) => void;
}

const AIAnalysisPanel = ({ requirements, draftContent, onUpdateRequirement }: AIAnalysisPanelProps) => {
  const [analysis, setAnalysis] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzedContent, setLastAnalyzedContent] = useState('');

  useEffect(() => {
    // Debounce analysis - only analyze if content changed significantly
    if (!draftContent || draftContent === lastAnalyzedContent) return;
    
    const timer = setTimeout(() => {
      analyzeDraft();
    }, 3000); // Wait 3 seconds after user stops typing

    return () => clearTimeout(timer);
  }, [draftContent]);

  const analyzeDraft = async () => {
    if (!draftContent || draftContent.length < 50) return; // Skip if draft is too short
    
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-draft', {
        body: {
          draftContent,
          requirements: requirements.map(r => ({
            id: r.id,
            title: r.title,
            mandatory: r.mandatory,
            description: r.description
          }))
        }
      });

      if (error) {
        if (error.message?.includes('429')) {
          toast.error('Rate limit reached. Please wait a moment.');
          return;
        }
        if (error.message?.includes('402')) {
          toast.error('AI credits depleted. Please add credits to your workspace.');
          return;
        }
        throw error;
      }

      if (data?.analysis) {
        setAnalysis(data.analysis);
        setLastAnalyzedContent(draftContent);
        
        // Update requirement completion status
        data.analysis.forEach((result: AnalysisResult) => {
          onUpdateRequirement(result.requirementId, result.isMet);
        });
      }
    } catch (error) {
      console.error('Error analyzing draft:', error);
      toast.error('Failed to analyze draft');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const mandatoryAnalysis = analysis.filter(a => 
    requirements.find(r => r.id === a.requirementId)?.mandatory
  );
  const mandatoryMet = mandatoryAnalysis.filter(a => a.isMet).length;
  const mandatoryTotal = mandatoryAnalysis.length;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">AI Analysis</CardTitle>
          {isAnalyzing && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {analysis.length === 0 && !isAnalyzing ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Start writing your draft to get AI-powered requirement analysis
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {mandatoryTotal > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">Mandatory Requirements</span>
                  <Badge variant={mandatoryMet === mandatoryTotal ? 'default' : 'destructive'}>
                    {mandatoryMet}/{mandatoryTotal}
                  </Badge>
                </div>
                {mandatoryMet < mandatoryTotal && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {mandatoryTotal - mandatoryMet} mandatory requirement(s) not yet addressed
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {analysis.map((result) => {
                const requirement = requirements.find(r => r.id === result.requirementId);
                if (!requirement) return null;

                return (
                  <div key={result.requirementId} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      {result.isMet ? (
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{requirement.title}</p>
                        {requirement.mandatory && (
                          <Badge variant="outline" className="text-xs mt-1">Mandatory</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">
                      {result.explanation}
                    </p>
                    {result.suggestion && !result.isMet && (
                      <div className="ml-6 bg-accent/50 rounded p-2">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-3 w-3 text-accent-foreground mt-0.5" />
                          <p className="text-xs text-accent-foreground">{result.suggestion}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAnalysisPanel;
