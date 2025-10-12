import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, AlertCircle, RefreshCw, Download, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

type NPALog = {
  automation: {
    id: number;
    optInId: number;
    userId: number;
    month: string;
    year: number;
    generatedPdfUrl: string | null;
    status: 'pending' | 'sent' | 'error';
    sentDate: Date | null;
    lastError: string | null;
    templateUsed: number | null;
    createdAt: Date;
  };
  user: {
    id: number;
    phone: string;
    email: string | null;
    role: string;
  } | null;
  doctorProfile: {
    id: number;
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
  } | null;
};

export default function AdminNPALogs() {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data, isLoading, isError, error, refetch } = useQuery<{ logs: NPALog[]; total: number }>({
    queryKey: ['/api/admin/npa/logs', statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      const response = await fetch(`/api/admin/npa/logs?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch logs');
      return response.json();
    },
  });

  const logs = data?.logs || [];

  const getDoctorName = (log: NPALog) => {
    const profile = log.doctorProfile;
    if (!profile) return 'Unknown';
    const parts = [profile.firstName, profile.middleName, profile.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'Unknown';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="default">Sent</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">NPA Automation Logs</h1>
        <p className="text-muted-foreground">Monitor certificate generation and delivery status</p>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div className="w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger data-testid="select-status">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={() => refetch()} data-testid="button-refresh">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Automation Logs ({data?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading logs...</div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Logs</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : 'Failed to fetch logs. Please try again.'}
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
          ) : logs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No automation logs yet</p>
              <p className="text-sm text-muted-foreground">Logs will appear when certificates are generated</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Doctor</th>
                    <th className="text-left py-3 px-4 font-semibold">Month/Year</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Created</th>
                    <th className="text-left py-3 px-4 font-semibold">Sent</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.automation.id} className="border-b hover-elevate" data-testid={`row-log-${log.automation.id}`}>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{getDoctorName(log)}</div>
                          {log.user && (
                            <div className="text-sm text-muted-foreground">{log.user.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">
                          {log.automation.month} {log.automation.year}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.automation.status)}
                          {getStatusBadge(log.automation.status)}
                        </div>
                        {log.automation.status === 'error' && log.automation.lastError && (
                          <div className="text-xs text-red-500 mt-1 line-clamp-2">
                            {log.automation.lastError}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {format(new Date(log.automation.createdAt), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {log.automation.sentDate
                          ? format(new Date(log.automation.sentDate), 'MMM dd, yyyy HH:mm')
                          : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {log.automation.generatedPdfUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(log.automation.generatedPdfUrl!, '_blank')}
                              data-testid={`button-download-${log.automation.id}`}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
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
