import { useState } from 'react';
import logger from '@/lib/logger';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, Send, MessageSquare, FileImage } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilteredDoctor = {
  id: number;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  userMobile: string | null;
  jobCity: string | null;
  jobState: string | null;
  ugCollege: string | null;
  ugAdmissionYear: string | null;
  pgCollege: string | null;
  pgAdmissionYear: string | null;
  pgBranch: string | null;
};

type MessageLog = {
  id: number;
  mobile: string;
  message: string;
  imageUrl: string | null;
  type: string;
  apiResponse: string | null;
  status: string;
  createdAt: string;
};

type MessageFilters = {
  jobCity: string;
  jobState: string;
  ugCollege: string;
  ugAdmissionYear: string;
  pgCollege: string;
  pgAdmissionYear: string;
  pgBranch: string;
  ssCollege: string;
  ssAdmissionYear: string;
};

export default function AdminMessaging() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<MessageFilters>({
    jobCity: '',
    jobState: '',
    ugCollege: '',
    ugAdmissionYear: '',
    pgCollege: '',
    pgAdmissionYear: '',
    pgBranch: '',
    ssCollege: '',
    ssAdmissionYear: '',
  });
  const [filteredDoctors, setFilteredDoctors] = useState<FilteredDoctor[]>([]);
  const [selectedDoctors, setSelectedDoctors] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [messageType, setMessageType] = useState<'Text' | 'Image'>('Text');

  const { data: messageLogs = [], refetch: refetchLogs } = useQuery<MessageLog[]>({
    queryKey: ['/api/admin/messaging/logs'],
  });

  const filterMutation = useMutation({
    mutationFn: async (filterData: MessageFilters) => {
      const response = await apiRequest('POST', '/api/admin/messaging/filter-doctors', filterData);
      return response.json();
    },
    onSuccess: (data: FilteredDoctor[]) => {
      setFilteredDoctors(data);
      setSelectedDoctors([]);
      toast({
        title: 'Doctors Filtered',
        description: `Found ${data.length} doctors matching your criteria`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Filter Failed',
        description: error.message || 'Failed to filter doctors',
      });
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (sendData: { doctorIds: number[], message: string, imageUrl?: string, type: string }) => {
      const response = await apiRequest('POST', '/api/admin/messaging/send', sendData);
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: 'Messages Sent',
        description: `Sent: ${data.sent}, Failed: ${data.failed}`,
      });
      if (data.errors && data.errors.length > 0) {
        logger.error('Send errors:', data.errors);
      }
      setMessage('');
      setImageUrl('');
      setSelectedDoctors([]);
      refetchLogs();
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Send Failed',
        description: error.message || 'Failed to send messages',
      });
    },
  });

  const handleFilter = () => {
    filterMutation.mutate(filters);
  };

  const handleSelectAll = () => {
    if (selectedDoctors.length === filteredDoctors.length) {
      setSelectedDoctors([]);
    } else {
      setSelectedDoctors(filteredDoctors.map(d => d.id));
    }
  };

  const handleSelectDoctor = (doctorId: number) => {
    if (selectedDoctors.includes(doctorId)) {
      setSelectedDoctors(selectedDoctors.filter(id => id !== doctorId));
    } else {
      setSelectedDoctors([...selectedDoctors, doctorId]);
    }
  };

  const handleSend = () => {
    if (selectedDoctors.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Recipients',
        description: 'Please select at least one doctor',
      });
      return;
    }

    if (!message.trim()) {
      toast({
        variant: 'destructive',
        title: 'No Message',
        description: 'Please enter a message',
      });
      return;
    }

    if (messageType === 'Image' && !imageUrl.trim()) {
      toast({
        variant: 'destructive',
        title: 'No Image URL',
        description: 'Please enter an image URL for Image messages',
      });
      return;
    }

    sendMutation.mutate({
      doctorIds: selectedDoctors,
      message,
      imageUrl: messageType === 'Image' ? imageUrl : undefined,
      type: messageType,
    });
  };

  const getFullName = (doctor: FilteredDoctor) => {
    const parts = [doctor.firstName, doctor.middleName, doctor.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'Unnamed Doctor';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manual Messaging</h1>

      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList>
          <TabsTrigger value="compose" data-testid="tab-compose">
            <MessageSquare className="w-4 h-4 mr-2" />
            Compose Message
          </TabsTrigger>
          <TabsTrigger value="logs" data-testid="tab-logs">
            Message Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          {/* Filter Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Recipients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="filter-city">Job City</Label>
                  <Input
                    id="filter-city"
                    data-testid="input-filter-city"
                    placeholder="e.g., Mumbai"
                    value={filters.jobCity}
                    onChange={(e) => setFilters({ ...filters, jobCity: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="filter-state">Job State</Label>
                  <Input
                    id="filter-state"
                    data-testid="input-filter-state"
                    placeholder="e.g., Maharashtra"
                    value={filters.jobState}
                    onChange={(e) => setFilters({ ...filters, jobState: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="filter-ug">UG College</Label>
                  <Input
                    id="filter-ug"
                    data-testid="input-filter-ug"
                    placeholder="e.g., AIIMS Delhi"
                    value={filters.ugCollege}
                    onChange={(e) => setFilters({ ...filters, ugCollege: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="filter-ug-year">UG Admission Year</Label>
                  <Input
                    id="filter-ug-year"
                    data-testid="input-filter-ug-year"
                    placeholder="e.g., 2010"
                    value={filters.ugAdmissionYear}
                    onChange={(e) => setFilters({ ...filters, ugAdmissionYear: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="filter-pg">PG College</Label>
                  <Input
                    id="filter-pg"
                    data-testid="input-filter-pg"
                    placeholder="e.g., AIIMS Delhi"
                    value={filters.pgCollege}
                    onChange={(e) => setFilters({ ...filters, pgCollege: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="filter-pg-year">PG Admission Year</Label>
                  <Input
                    id="filter-pg-year"
                    data-testid="input-filter-pg-year"
                    placeholder="e.g., 2015"
                    value={filters.pgAdmissionYear}
                    onChange={(e) => setFilters({ ...filters, pgAdmissionYear: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="filter-branch">PG Branch</Label>
                  <Input
                    id="filter-branch"
                    data-testid="input-filter-branch"
                    placeholder="e.g., Cardiology"
                    value={filters.pgBranch}
                    onChange={(e) => setFilters({ ...filters, pgBranch: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="filter-ss">SS College</Label>
                  <Input
                    id="filter-ss"
                    data-testid="input-filter-ss"
                    placeholder="e.g., PGI Chandigarh"
                    value={filters.ssCollege}
                    onChange={(e) => setFilters({ ...filters, ssCollege: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="filter-ss-year">SS Admission Year</Label>
                  <Input
                    id="filter-ss-year"
                    data-testid="input-filter-ss-year"
                    placeholder="e.g., 2020"
                    value={filters.ssAdmissionYear}
                    onChange={(e) => setFilters({ ...filters, ssAdmissionYear: e.target.value })}
                  />
                </div>
              </div>
              <Button
                data-testid="button-filter"
                onClick={handleFilter}
                disabled={filterMutation.isPending}
              >
                {filterMutation.isPending ? 'Filtering...' : 'Apply Filters'}
              </Button>
            </CardContent>
          </Card>

          {/* Recipients Section */}
          {filteredDoctors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recipients ({selectedDoctors.length} selected)</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    data-testid="button-select-all"
                  >
                    {selectedDoctors.length === filteredDoctors.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto border rounded-md">
                  <table className="w-full">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        <th className="p-2 text-left">Select</th>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Mobile</th>
                        <th className="p-2 text-left">Location</th>
                        <th className="p-2 text-left">UG College (Year)</th>
                        <th className="p-2 text-left">PG College (Year)</th>
                        <th className="p-2 text-left">PG Branch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDoctors.map((doctor) => (
                        <tr key={doctor.id} className="border-t">
                          <td className="p-2">
                            <Checkbox
                              checked={selectedDoctors.includes(doctor.id)}
                              onCheckedChange={() => handleSelectDoctor(doctor.id)}
                              data-testid={`checkbox-doctor-${doctor.id}`}
                            />
                          </td>
                          <td className="p-2" data-testid={`text-doctor-name-${doctor.id}`}>
                            {getFullName(doctor)}
                          </td>
                          <td className="p-2">{doctor.userMobile || 'N/A'}</td>
                          <td className="p-2">
                            {[doctor.jobCity, doctor.jobState].filter(Boolean).join(', ') || 'N/A'}
                          </td>
                          <td className="p-2">
                            {doctor.ugCollege ? `${doctor.ugCollege}${doctor.ugAdmissionYear ? ` (${doctor.ugAdmissionYear})` : ''}` : 'N/A'}
                          </td>
                          <td className="p-2">
                            {doctor.pgCollege ? `${doctor.pgCollege}${doctor.pgAdmissionYear ? ` (${doctor.pgAdmissionYear})` : ''}` : 'N/A'}
                          </td>
                          <td className="p-2">{doctor.pgBranch || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Message Composition */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Compose Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="message-type">Message Type</Label>
                <Select
                  value={messageType}
                  onValueChange={(value) => setMessageType(value as 'Text' | 'Image')}
                >
                  <SelectTrigger data-testid="select-message-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Text">
                      Text Only
                    </SelectItem>
                    <SelectItem value="Image">
                      <div className="flex items-center gap-2">
                        <FileImage className="w-4 h-4" />
                        Text with Image
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Message Text</Label>
                <Textarea
                  id="message"
                  data-testid="input-message"
                  placeholder="Enter your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                />
              </div>

              {messageType === 'Image' && (
                <div>
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    data-testid="input-image-url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
              )}

              <Button
                data-testid="button-send"
                onClick={handleSend}
                disabled={sendMutation.isPending || selectedDoctors.length === 0}
                className="w-full"
              >
                {sendMutation.isPending ? 'Sending...' : `Send to ${selectedDoctors.length} Recipients`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Message Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Mobile</th>
                      <th className="p-2 text-left">Message</th>
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messageLogs.map((log) => (
                      <tr key={log.id} className="border-t">
                        <td className="p-2">
                          {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm')}
                        </td>
                        <td className="p-2">{log.mobile}</td>
                        <td className="p-2 max-w-xs truncate">{log.message}</td>
                        <td className="p-2">{log.type}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            log.status === 'success' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {messageLogs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No message logs found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
