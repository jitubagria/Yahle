import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertCircle, RefreshCw, Brain, Calculator, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';

type AIToolRequest = {
  id: number;
  userId: number;
  toolType: string;
  inputData: string;
  outputData: string | null;
  createdAt: Date;
};

export default function AdminAITools() {
  const { data: requests = [], isLoading, isError, error, refetch } = useQuery<AIToolRequest[]>({
    queryKey: ['/api/admin/ai-tool-requests'],
  });

  const getToolIcon = (toolType: string) => {
    switch (toolType) {
      case 'diagnostic_helper': return <Brain className="w-4 h-4" />;
      case 'stats_calculator': return <Calculator className="w-4 h-4" />;
      case 'clinical_notes': return <FileText className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getToolName = (toolType: string) => {
    switch (toolType) {
      case 'diagnostic_helper': return 'Diagnostic Helper';
      case 'stats_calculator': return 'Stats Calculator';
      case 'clinical_notes': return 'Clinical Notes';
      default: return toolType;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI Tools Management</h1>
        <p className="text-muted-foreground">Monitor AI tool usage and requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI Tool Requests ({requests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading AI tool requests...</div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Requests</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : 'Failed to fetch AI tool requests. Please try again.'}
              </AlertDescription>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-4"
                data-testid="button-retry-fetch"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </Alert>
          ) : requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No AI tool requests yet</p>
              <p className="text-sm text-muted-foreground">AI tool usage will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Tool Type</th>
                    <th className="text-left py-3 px-4 font-semibold">User ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Input Preview</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Created</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-b hover-elevate" data-testid={`row-request-${request.id}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getToolIcon(request.toolType)}
                          <span className="font-medium">{getToolName(request.toolType)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        #{request.userId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                          {request.inputData}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {request.outputData ? (
                          <Badge variant="default">Completed</Badge>
                        ) : (
                          <Badge variant="secondary">Processing</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {format(new Date(request.createdAt), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-view-${request.id}`}
                          >
                            View Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
