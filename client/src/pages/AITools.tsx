import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrainCircuit, Calculator, FileText, Sparkles, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAuthenticatedUserId } from '@/lib/auth';

export default function AITools() {
  const { toast } = useToast();
  const [diagnosticInput, setDiagnosticInput] = useState('');
  const [diagnosticResult, setDiagnosticResult] = useState('');
  const [statsInput, setStatsInput] = useState('');
  const [statsResult, setStatsResult] = useState('');
  const [clinicalInput, setClinicalInput] = useState('');
  const [clinicalResult, setClinicalResult] = useState('');

  const diagnosticMutation = useMutation({
    mutationFn: (data: { input: string }) => {
      try {
        return apiRequest('POST', '/api/ai-tools/diagnostic', { 
          userId: getAuthenticatedUserId(),
          toolType: 'diagnostic_helper', 
          inputData: data.input 
        });
      } catch (error) {
        toast({ title: 'Authentication Required', description: 'Please login to use AI tools', variant: 'destructive' });
        throw error;
      }
    },
    onSuccess: (data) => {
      setDiagnosticResult(data.output);
      toast({ title: 'Analysis Complete', description: 'AI diagnostic suggestions generated' });
    },
    onError: (error: any) => {
      if (error.message?.includes('authenticated')) {
        window.location.href = '/login';
      } else {
        toast({ title: 'Error', description: 'Failed to process request', variant: 'destructive' });
      }
    },
  });

  const statsMutation = useMutation({
    mutationFn: (data: { input: string }) => {
      try {
        return apiRequest('POST', '/api/ai-tools/stats', { 
          userId: getAuthenticatedUserId(),
          toolType: 'stats_calculator', 
          inputData: data.input 
        });
      } catch (error) {
        toast({ title: 'Authentication Required', description: 'Please login to use AI tools', variant: 'destructive' });
        throw error;
      }
    },
    onSuccess: (data) => {
      setStatsResult(data.output);
      toast({ title: 'Calculation Complete', description: 'Statistical analysis generated' });
    },
    onError: (error: any) => {
      if (error.message?.includes('authenticated')) {
        window.location.href = '/login';
      } else {
        toast({ title: 'Error', description: 'Failed to process request', variant: 'destructive' });
      }
    },
  });

  const clinicalMutation = useMutation({
    mutationFn: (data: { input: string }) => {
      try {
        return apiRequest('POST', '/api/ai-tools/clinical-notes', { 
          userId: getAuthenticatedUserId(),
          toolType: 'clinical_notes', 
          inputData: data.input 
        });
      } catch (error) {
        toast({ title: 'Authentication Required', description: 'Please login to use AI tools', variant: 'destructive' });
        throw error;
      }
    },
    onSuccess: (data) => {
      setClinicalResult(data.output);
      toast({ title: 'Notes Generated', description: 'Clinical notes created successfully' });
    },
    onError: (error: any) => {
      if (error.message?.includes('authenticated')) {
        window.location.href = '/login';
      } else {
        toast({ title: 'Error', description: 'Failed to process request', variant: 'destructive' });
      }
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-purple-500/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
              <BrainCircuit className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">AI Medical Tools</h1>
              <p className="text-xl text-muted-foreground mt-2">
                Leverage artificial intelligence to enhance your medical practice
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="diagnostic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="diagnostic" data-testid="tab-diagnostic">
              <BrainCircuit className="w-4 h-4 mr-2" />
              Diagnostic Helper
            </TabsTrigger>
            <TabsTrigger value="stats" data-testid="tab-stats">
              <Calculator className="w-4 h-4 mr-2" />
              Stats Calculator
            </TabsTrigger>
            <TabsTrigger value="clinical" data-testid="tab-clinical">
              <FileText className="w-4 h-4 mr-2" />
              Clinical Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diagnostic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-purple-600" />
                  Diagnostic Helper
                </CardTitle>
                <CardDescription>
                  Get AI-powered diagnostic suggestions based on symptoms and patient data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="diagnostic-input">Patient Symptoms & Details</Label>
                  <Textarea
                    id="diagnostic-input"
                    placeholder="Enter patient symptoms, vital signs, medical history..."
                    value={diagnosticInput}
                    onChange={(e) => setDiagnosticInput(e.target.value)}
                    rows={6}
                    data-testid="textarea-diagnostic-input"
                  />
                </div>
                <Button
                  onClick={() => diagnosticMutation.mutate({ input: diagnosticInput })}
                  disabled={!diagnosticInput || diagnosticMutation.isPending}
                  data-testid="button-analyze-diagnostic"
                >
                  {diagnosticMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze with AI
                    </>
                  )}
                </Button>
                
                {diagnosticResult && (
                  <div className="mt-6 p-6 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4" />
                      AI Analysis Results
                    </h3>
                    <div className="prose prose-sm max-w-none" data-testid="text-diagnostic-result">
                      <p className="whitespace-pre-wrap">{diagnosticResult}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  Medical Statistics Calculator
                </CardTitle>
                <CardDescription>
                  Perform statistical analysis on medical data and research
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stats-input">Data & Analysis Requirements</Label>
                  <Textarea
                    id="stats-input"
                    placeholder="Enter your dataset or describe the statistical analysis needed..."
                    value={statsInput}
                    onChange={(e) => setStatsInput(e.target.value)}
                    rows={6}
                    data-testid="textarea-stats-input"
                  />
                </div>
                <Button
                  onClick={() => statsMutation.mutate({ input: statsInput })}
                  disabled={!statsInput || statsMutation.isPending}
                  data-testid="button-calculate-stats"
                >
                  {statsMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Statistics
                    </>
                  )}
                </Button>
                
                {statsResult && (
                  <div className="mt-6 p-6 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Calculator className="w-4 h-4" />
                      Statistical Results
                    </h3>
                    <div className="prose prose-sm max-w-none" data-testid="text-stats-result">
                      <p className="whitespace-pre-wrap">{statsResult}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clinical">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Clinical Note Generator
                </CardTitle>
                <CardDescription>
                  Generate structured clinical notes from patient encounter data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clinical-input">Patient Encounter Details</Label>
                  <Textarea
                    id="clinical-input"
                    placeholder="Enter patient encounter details: chief complaint, history, examination findings..."
                    value={clinicalInput}
                    onChange={(e) => setClinicalInput(e.target.value)}
                    rows={6}
                    data-testid="textarea-clinical-input"
                  />
                </div>
                <Button
                  onClick={() => clinicalMutation.mutate({ input: clinicalInput })}
                  disabled={!clinicalInput || clinicalMutation.isPending}
                  data-testid="button-generate-notes"
                >
                  {clinicalMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Notes
                    </>
                  )}
                </Button>
                
                {clinicalResult && (
                  <div className="mt-6 p-6 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Generated Clinical Notes
                    </h3>
                    <div className="prose prose-sm max-w-none" data-testid="text-clinical-result">
                      <p className="whitespace-pre-wrap">{clinicalResult}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Powered by Advanced AI</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI tools use state-of-the-art language models to assist medical professionals. 
                  Always verify AI-generated suggestions with your clinical judgment and current medical guidelines.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
