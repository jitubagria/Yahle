import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, FlaskConical, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';

type ResearchServiceRequest = {
  id: number;
  userId: number;
  serviceType: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo: number | null;
  estimatedCost: number | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function AdminResearch() {
  const { data: requests = [], isLoading, isError, error, refetch } = useQuery<ResearchServiceRequest[]>({
    queryKey: ['/api/research-services/requests'],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'in_progress': return 'default';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getServiceName = (serviceType: string) => {
    switch (serviceType) {
      case 'article_writing': return 'Article Writing';
      case 'thesis_support': return 'Thesis Support';
      case 'statistical_consulting': return 'Statistical Consulting';
      default: return serviceType;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Research Services Management</h1>
        <p className="text-muted-foreground">Manage research service requests and assignments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5" />
            Service Requests ({requests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading research requests...</div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Requests</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : 'Failed to fetch research requests. Please try again.'}
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
              <p className="text-muted-foreground mb-4">No research service requests yet</p>
              <p className="text-sm text-muted-foreground">New requests will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Title</th>
                    <th className="text-left py-3 px-4 font-semibold">Service Type</th>
                    <th className="text-left py-3 px-4 font-semibold">User</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Cost</th>
                    <th className="text-left py-3 px-4 font-semibold">Created</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-b hover-elevate" data-testid={`row-request-${request.id}`}>
                      <td className="py-3 px-4">
                        <div className="font-medium">{request.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {request.description}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {getServiceName(request.serviceType)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <User className="w-3 h-3" />
                          #{request.userId}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusColor(request.status)}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {request.estimatedCost ? (
                          <span className="font-medium">₹{request.estimatedCost}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-update-${request.id}`}
                          >
                            Update Status
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-view-${request.id}`}
                          >
                            View
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
