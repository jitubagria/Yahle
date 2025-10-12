import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, User, Mail, Phone, MapPin, GraduationCap, AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type PendingDoctor = {
  id: number;
  userId: number;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  email: string | null;
  userMobile: string | null;
  professionaldegree: string | null;
  pgBranch: string | null;
  jobCity: string | null;
  jobState: string | null;
  ugCollege: string | null;
  pgCollege: string | null;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

export function DoctorApprovalDialog({ open, onOpenChange }: Props) {
  const { toast } = useToast();
  const { data: pendingDoctors = [], isLoading, isError, error, refetch } = useQuery<PendingDoctor[]>({
    queryKey: ['/api/admin/doctors/pending'],
    enabled: open,
  });

  const approveMutation = useMutation({
    mutationFn: async (doctorId: number) => {
      return apiRequest('POST', `/api/admin/doctors/${doctorId}/approve`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/doctors/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/doctors/all'] });
      queryClient.invalidateQueries({ queryKey: ['/api/doctors'] });
      toast({
        title: 'Doctor Approved',
        description: 'Doctor profile has been approved successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Approval Failed',
        description: error.message || 'Failed to approve doctor',
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (doctorId: number) => {
      return apiRequest('POST', `/api/admin/doctors/${doctorId}/reject`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/doctors/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/doctors/all'] });
      queryClient.invalidateQueries({ queryKey: ['/api/doctors'] });
      toast({
        title: 'Doctor Rejected',
        description: 'Doctor profile has been rejected',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Rejection Failed',
        description: error.message || 'Failed to reject doctor',
      });
    },
  });

  const getFullName = (doctor: PendingDoctor) => {
    const parts = [doctor.firstName, doctor.middleName, doctor.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'Unnamed Doctor';
  };

  const getLocation = (doctor: PendingDoctor) => {
    const parts = [doctor.jobCity, doctor.jobState].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Not specified';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Doctor Approval Queue
          </DialogTitle>
          <DialogDescription>
            Review and approve doctor profiles before they appear in the directory
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading pending approvals...</div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Pending Doctors</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : 'Failed to fetch pending doctors'}
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
          ) : pendingDoctors.length === 0 ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                No pending doctor approvals at this time
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {pendingDoctors.map((doctor) => (
                <Card key={doctor.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{getFullName(doctor)}</h3>
                          <Badge variant="secondary">Pending Review</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {doctor.email && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              <span>{doctor.email}</span>
                            </div>
                          )}
                          {doctor.userMobile && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="w-4 h-4" />
                              <span>{doctor.userMobile}</span>
                            </div>
                          )}
                          {(doctor.jobCity || doctor.jobState) && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{getLocation(doctor)}</span>
                            </div>
                          )}
                          {doctor.professionaldegree && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <GraduationCap className="w-4 h-4" />
                              <span>{doctor.professionaldegree}</span>
                            </div>
                          )}
                        </div>

                        {doctor.pgBranch && (
                          <div className="text-sm">
                            <span className="font-medium">Specialty:</span> {doctor.pgBranch}
                          </div>
                        )}

                        {(doctor.ugCollege || doctor.pgCollege) && (
                          <div className="text-sm text-muted-foreground">
                            {doctor.ugCollege && <div>UG: {doctor.ugCollege}</div>}
                            {doctor.pgCollege && <div>PG: {doctor.pgCollege}</div>}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => approveMutation.mutate(doctor.id)}
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                          data-testid={`button-approve-${doctor.id}`}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectMutation.mutate(doctor.id)}
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                          data-testid={`button-reject-${doctor.id}`}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
