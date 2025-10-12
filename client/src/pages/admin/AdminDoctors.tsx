import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Users, AlertCircle, RefreshCw, Mail, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DoctorImportDialog } from '@/components/admin/DoctorImportDialog';

type DoctorProfile = {
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
  isprofilecomplete: boolean | null;
};

export default function AdminDoctors() {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const { data: doctors = [], isLoading, isError, error, refetch } = useQuery<DoctorProfile[]>({
    queryKey: ['/api/doctors'],
  });

  const getFullName = (doctor: DoctorProfile) => {
    const parts = [doctor.firstName, doctor.middleName, doctor.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'Unnamed Doctor';
  };

  const getLocation = (doctor: DoctorProfile) => {
    const parts = [doctor.jobCity, doctor.jobState].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : '-';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Doctors Directory Management</h1>
          <p className="text-muted-foreground">Manage doctor profiles, import Excel, approval queue</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setImportDialogOpen(true)}
            data-testid="button-import-doctors"
          >
            Import Excel/CSV
          </Button>
          <Button variant="outline" data-testid="button-approval-queue">
            Approval Queue
          </Button>
        </div>
      </div>

      <DoctorImportDialog 
        open={importDialogOpen} 
        onOpenChange={setImportDialogOpen} 
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            All Doctors ({doctors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading doctors...</div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Doctors</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : 'Failed to fetch doctors. Please try again.'}
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
          ) : doctors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No doctor profiles found</p>
              <p className="text-sm text-muted-foreground">Import doctors from Excel or wait for new registrations</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Qualification</th>
                    <th className="text-left py-3 px-4 font-semibold">Specialty</th>
                    <th className="text-left py-3 px-4 font-semibold">Location</th>
                    <th className="text-left py-3 px-4 font-semibold">Contact</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor.id} className="border-b hover-elevate" data-testid={`row-doctor-${doctor.id}`}>
                      <td className="py-3 px-4">
                        <div className="font-medium">{getFullName(doctor)}</div>
                        {doctor.email && (
                          <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3" />
                            {doctor.email}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {doctor.professionaldegree || '-'}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {doctor.pgBranch || '-'}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {getLocation(doctor)}
                      </td>
                      <td className="py-3 px-4">
                        {doctor.userMobile ? (
                          <div className="text-sm flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {doctor.userMobile}
                          </div>
                        ) : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {doctor.isprofilecomplete ? (
                          <Badge variant="default">Complete</Badge>
                        ) : (
                          <Badge variant="secondary">Incomplete</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-view-${doctor.id}`}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-edit-${doctor.id}`}
                          >
                            <Pencil className="w-4 h-4" />
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
