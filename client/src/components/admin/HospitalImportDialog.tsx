import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type HospitalRow = {
  name: string;
  address?: string;
  district?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  contactNumbers?: string[];
  email?: string;
  website?: string;
  specialties?: string;
  description?: string;
};

export function HospitalImportDialog({ open, onOpenChange }: Props) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<HospitalRow[]>([]);
  const [parseError, setParseError] = useState<string>('');

  const importMutation = useMutation({
    mutationFn: async (data: HospitalRow[]) => {
      return apiRequest('POST', '/api/admin/hospitals/import', { data });
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/hospitals'] });
      toast({
        title: 'Import Successful',
        description: `Successfully imported ${response.count} hospitals`,
      });
      handleClose();
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description: error.message || 'Failed to import hospitals',
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
        const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];

        if (jsonData.length === 0) {
          setParseError('Excel file is empty');
          return;
        }

        // Map Excel columns to hospital fields
        const hospitals: HospitalRow[] = jsonData.map((row) => ({
          name: row.Name || row.name || '',
          address: row.Address || row.address || '',
          district: row.District || row.district || '',
          city: row.City || row.city || '',
          state: row.State || row.state || '',
          country: row.Country || row.country || 'India',
          phone: row.Phone || row.phone || '',
          contactNumbers: row.ContactNumbers || row['Contact Numbers'] || row.contactNumbers 
            ? String(row.ContactNumbers || row['Contact Numbers'] || row.contactNumbers).split(',').map(n => n.trim()).filter(Boolean)
            : [],
          email: row.Email || row.email || '',
          website: row.Website || row.website || '',
          specialties: row.Specialties || row.specialties || '',
          description: row.Description || row.description || '',
        }));

        setParsedData(hospitals);
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
            Import Hospitals from Excel
          </DialogTitle>
          <DialogDescription>
            Upload an Excel file with hospital data. Required columns: Name. Optional: Address, District, City, State, Country, Phone, Contact Numbers (comma-separated), Email, Website, Specialties, Description.
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
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{parseError}</AlertDescription>
            </Alert>
          )}

          {parsedData.length > 0 && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Successfully parsed {parsedData.length} hospitals from Excel file
              </AlertDescription>
            </Alert>
          )}

          {parsedData.length > 0 && (
            <div className="border rounded-lg p-4 max-h-60 overflow-auto">
              <h4 className="font-semibold mb-2">Preview (first 5 rows):</h4>
              <div className="space-y-2">
                {parsedData.slice(0, 5).map((hospital, idx) => (
                  <div key={idx} className="text-sm p-2 bg-muted rounded">
                    <div className="font-medium">{hospital.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {[hospital.district, hospital.city, hospital.state].filter(Boolean).join(', ')}
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
            {importMutation.isPending ? 'Importing...' : `Import ${parsedData.length} Hospitals`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
