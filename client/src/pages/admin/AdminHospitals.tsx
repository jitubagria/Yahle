import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Building2, AlertCircle, RefreshCw, MapPin, Phone, Mail, FileSpreadsheet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { HospitalImportDialog } from '@/components/admin/HospitalImportDialog';

type Hospital = {
  id: number;
  name: string;
  address: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  phone: string | null;
  contactNumbers: string[] | null;
  email: string | null;
  website: string | null;
  specialties: string | null;
  description: string | null;
  image: string | null;
};

export default function AdminHospitals() {
  const { toast } = useToast();
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const { data: hospitals = [], isLoading, isError, error, refetch } = useQuery<Hospital[]>({
    queryKey: ['/api/hospitals'],
  });

  const getLocation = (hospital: Hospital) => {
    const parts = [hospital.city, hospital.state, hospital.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : '-';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Hospitals Directory</h1>
          <p className="text-muted-foreground">Manage hospital listings and information</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setImportDialogOpen(true)}
            data-testid="button-import-hospitals"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Import Excel
          </Button>
          <Button data-testid="button-create-hospital">
            <Plus className="w-4 h-4 mr-2" />
            Add Hospital
          </Button>
        </div>
      </div>

      <HospitalImportDialog 
        open={importDialogOpen} 
        onOpenChange={setImportDialogOpen} 
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            All Hospitals ({hospitals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading hospitals...</div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Hospitals</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : 'Failed to fetch hospitals. Please try again.'}
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
          ) : hospitals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No hospitals registered yet</p>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Hospital
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Location</th>
                    <th className="text-left py-3 px-4 font-semibold">Specialties</th>
                    <th className="text-left py-3 px-4 font-semibold">Contact</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.map((hospital) => (
                    <tr key={hospital.id} className="border-b hover-elevate" data-testid={`row-hospital-${hospital.id}`}>
                      <td className="py-3 px-4">
                        <div className="font-medium">{hospital.name}</div>
                        {hospital.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {hospital.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {getLocation(hospital)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {hospital.specialties || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {hospital.phone && (
                            <div className="text-sm flex items-center gap-1 text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {hospital.phone}
                            </div>
                          )}
                          {hospital.email && (
                            <div className="text-sm flex items-center gap-1 text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              {hospital.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-edit-${hospital.id}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-delete-${hospital.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
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
