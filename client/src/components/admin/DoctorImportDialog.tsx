import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type DoctorRow = {
  phone?: string;
  userMobile?: string;
  firstName?: string;
  first_name?: string;
  middleName?: string;
  middle_name?: string;
  lastName?: string;
  last_name?: string;
  email?: string;
  alternateno?: string;
  alternate_no?: string;
  professionaldegree?: string;
  professional_degree?: string;
  pgBranch?: string;
  pg_branch?: string;
  ugAdmissionYear?: string;
  ug_admission_year?: string;
  ugLocation?: string;
  ug_location?: string;
  ugCollege?: string;
  ug_college?: string;
  jobCity?: string;
  job_city?: string;
  jobState?: string;
  job_state?: string;
};

export function DoctorImportDialog({ open, onOpenChange }: Props) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<DoctorRow[]>([]);
  const [parseError, setParseError] = useState<string>('');

  const importMutation = useMutation({
    mutationFn: async (data: DoctorRow[]) => {
      return apiRequest('POST', '/api/admin/doctors/import', { data });
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/doctors'] });
      
      const errorCount = response.errors?.length || 0;
      if (errorCount > 0) {
        toast({
          variant: 'default',
          title: 'Import Partially Successful',
          description: `Imported ${response.count} doctors. ${errorCount} rows had errors.`,
        });
      } else {
        toast({
          title: 'Import Successful',
          description: `Successfully imported ${response.count} doctors`,
        });
      }
      handleClose();
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description: error.message || 'Failed to import doctors',
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setParseError('');
    setParsedData([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet) as DoctorRow[];

        if (jsonData.length === 0) {
          setParseError('Excel file is empty');
          return;
        }

        // Validate that at least phone number exists in each row
        const validData = jsonData.filter(row => row.phone || row.userMobile);
        
        if (validData.length === 0) {
          setParseError('No valid rows with phone numbers found');
          return;
        }

        setParsedData(validData);
        
        if (validData.length < jsonData.length) {
          setParseError(`${jsonData.length - validData.length} rows skipped due to missing phone numbers`);
        }
      } catch (err) {
        setParseError('Failed to parse Excel file. Please ensure it has the correct format.');
        console.error('Excel parse error:', err);
      }
    };

    reader.readAsBinaryString(selectedFile);
  };

  const handleImport = () => {
    if (parsedData.length > 0) {
      importMutation.mutate(parsedData);
    }
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setParseError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Import Doctors from Excel
          </DialogTitle>
          <DialogDescription>
            Upload an Excel file with doctor data. Required columns: Phone/UserMobile. Optional: FirstName, MiddleName, LastName, Email, AlternateNo, ProfessionalDegree, PgBranch, UgAdmissionYear, UgLocation, UgCollege, JobCity, JobState.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover-elevate">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">Excel files (.xlsx, .xls)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                data-testid="input-excel-file"
              />
            </label>
          </div>

          {file && (
            <Alert>
              <FileSpreadsheet className="h-4 w-4" />
              <AlertDescription>
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </AlertDescription>
            </Alert>
          )}

          {parseError && (
            <Alert variant={parsedData.length > 0 ? 'default' : 'destructive'}>
              {parsedData.length > 0 ? <AlertTriangle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{parseError}</AlertDescription>
            </Alert>
          )}

          {parsedData.length > 0 && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Successfully parsed {parsedData.length} doctors from Excel file
              </AlertDescription>
            </Alert>
          )}

          {parsedData.length > 0 && (
            <div className="border rounded-lg p-4 max-h-60 overflow-auto">
              <h4 className="font-semibold mb-2">Preview (first 5 rows):</h4>
              <div className="space-y-2">
                {parsedData.slice(0, 5).map((doctor, idx) => (
                  <div key={idx} className="text-sm p-2 bg-muted rounded">
                    <div className="font-medium">
                      {[doctor.firstName || doctor.first_name, doctor.lastName || doctor.last_name]
                        .filter(Boolean)
                        .join(' ') || 'No name provided'}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {doctor.phone || doctor.userMobile} • {doctor.professionaldegree || doctor.professional_degree || 'No degree'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={importMutation.isPending}
            data-testid="button-cancel-import"
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={parsedData.length === 0 || importMutation.isPending}
            data-testid="button-confirm-import"
          >
            {importMutation.isPending ? 'Importing...' : `Import ${parsedData.length} Doctors`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
