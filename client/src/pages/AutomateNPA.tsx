import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Mail, Phone, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';

type NPAStatus = {
  optedIn: boolean;
  optIn?: {
    id: number;
    userId: number;
    preferredDay: number;
    deliveryEmail: string | null;
    deliveryWhatsapp: string | null;
    isActive: boolean;
    createdAt: Date;
  };
  recentLogs?: Array<{
    id: number;
    month: string;
    year: number;
    status: string;
    createdAt: Date;
    sentDate: Date | null;
  }>;
};

export default function AutomateNPA() {
  const { toast } = useToast();
  const [optInDialogOpen, setOptInDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    preferredDay: 1,
    deliveryEmail: '',
    deliveryWhatsapp: '',
  });

  const { data: status, isLoading } = useQuery<NPAStatus>({
    queryKey: ['/api/npa/status'],
  });

  const optInMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest('POST', '/api/npa/opt-in', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/npa/status'] });
      toast({ title: 'Successfully opted in to NPA automation' });
      setOptInDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to opt-in',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const optOutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('DELETE', '/api/npa/opt-out');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/npa/status'] });
      toast({ title: 'Successfully opted out of NPA automation' });
    },
    onError: () => {
      toast({ title: 'Failed to opt-out', variant: 'destructive' });
    },
  });

  const handleOptIn = () => {
    optInMutation.mutate(formData);
  };

  const handleOptOut = () => {
    if (confirm('Are you sure you want to opt-out from NPA automation?')) {
      optOutMutation.mutate();
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Automate NPA</h1>
            <p className="text-muted-foreground">Never miss your Non-Practicing Allowance certificate again</p>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>Automated NPA certificate generation and delivery</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Connect Profile</h3>
              <p className="text-sm text-muted-foreground">
                Your DocsUniverse profile data is automatically used for certificate generation
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Auto-Generate</h3>
              <p className="text-sm text-muted-foreground">
                Certificates are generated automatically on your preferred day each month
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Delivered</h3>
              <p className="text-sm text-muted-foreground">
                Receive your certificate via WhatsApp and email instantly
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Section */}
      {status?.optedIn ? (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Active Automation
              </CardTitle>
              <CardDescription>Your NPA certificates are being automated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Delivery Settings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        Generated on day <strong>{status.optIn?.preferredDay}</strong> of each month
                      </span>
                    </div>
                    {status.optIn?.deliveryEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{status.optIn.deliveryEmail}</span>
                      </div>
                    )}
                    {status.optIn?.deliveryWhatsapp && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{status.optIn.deliveryWhatsapp}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                  <Button variant="outline" onClick={handleOptOut} data-testid="button-opt-out">
                    Opt Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Certificates */}
          {status.recentLogs && status.recentLogs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Certificates</CardTitle>
                <CardDescription>Your recently generated NPA certificates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {status.recentLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover-elevate"
                      data-testid={`log-${log.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {log.month} {log.year}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Generated on {format(new Date(log.createdAt), 'MMM dd, yyyy')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(log.status)}
                        {log.sentDate && (
                          <span className="text-xs text-muted-foreground">
                            Sent {format(new Date(log.sentDate), 'MMM dd')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Enable NPA Automation</CardTitle>
            <CardDescription>
              Automatically receive your Non-Practicing Allowance certificate every month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Requirements</AlertTitle>
              <AlertDescription>
                Please ensure your doctor profile is complete with all required information before opting in.
              </AlertDescription>
            </Alert>

            <div className="flex justify-center">
              <Button onClick={() => setOptInDialogOpen(true)} size="lg" data-testid="button-enable-automation">
                <Zap className="w-4 h-4 mr-2" />
                Enable Automation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Opt-In Dialog */}
      <Dialog open={optInDialogOpen} onOpenChange={setOptInDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable NPA Automation</DialogTitle>
            <DialogDescription>
              Configure your automation preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="preferredDay">Preferred Generation Day</Label>
              <Select
                value={formData.preferredDay.toString()}
                onValueChange={(value) => setFormData({ ...formData, preferredDay: parseInt(value) })}
              >
                <SelectTrigger id="preferredDay" data-testid="select-day">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st of month</SelectItem>
                  <SelectItem value="2">2nd of month</SelectItem>
                  <SelectItem value="3">3rd of month</SelectItem>
                  <SelectItem value="5">5th of month</SelectItem>
                  <SelectItem value="10">10th of month</SelectItem>
                  <SelectItem value="15">15th of month</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Day of the month when your certificate will be automatically generated
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryEmail">Delivery Email (Optional)</Label>
              <Input
                id="deliveryEmail"
                type="email"
                value={formData.deliveryEmail}
                onChange={(e) => setFormData({ ...formData, deliveryEmail: e.target.value })}
                placeholder="your@email.com"
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryWhatsapp">Delivery WhatsApp (Optional)</Label>
              <Input
                id="deliveryWhatsapp"
                type="tel"
                value={formData.deliveryWhatsapp}
                onChange={(e) => setFormData({ ...formData, deliveryWhatsapp: e.target.value })}
                placeholder="9999999999"
                data-testid="input-whatsapp"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOptInDialogOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button onClick={handleOptIn} disabled={optInMutation.isPending} data-testid="button-confirm-opt-in">
              {optInMutation.isPending ? 'Enabling...' : 'Enable Automation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
