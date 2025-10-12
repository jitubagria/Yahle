import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, DollarSign, Clock, Building2, Search, Plus } from 'lucide-react';
import { Link } from 'wouter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { getAuthenticatedUser } from '@/lib/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertJobSchema } from '@shared/schema';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const jobPostSchema = insertJobSchema.extend({
  title: z.string().min(1, 'Job title is required'),
  city: z.string().optional(),
  state: z.string().optional(),
  jobType: z.string().optional(),
});

type JobPostFormData = z.infer<typeof jobPostSchema>;

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [showPostJobDialog, setShowPostJobDialog] = useState(false);
  const { toast } = useToast();
  const user = getAuthenticatedUser();

  const form = useForm<JobPostFormData>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      title: '',
      hospitalName: '',
      specialty: '',
      city: '',
      state: '',
      experienceRequired: '',
      salaryRange: '',
      jobType: 'full-time',
      description: '',
      requirements: '',
    },
  });

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['/api/jobs', searchTerm, location, specialty],
  });

  const postJobMutation = useMutation({
    mutationFn: async (data: JobPostFormData) => {
      return apiRequest('/api/jobs', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          postedBy: user?.id,
          isActive: true,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      setShowPostJobDialog(false);
      form.reset();
      toast({
        title: 'Job Posted Successfully',
        description: 'Your job posting is now live on the jobs board.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to Post Job',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handlePostJob = (data: JobPostFormData) => {
    postJobMutation.mutate(data);
  };

  const handleOpenPostJobDialog = () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to post a job.',
        variant: 'destructive',
      });
      return;
    }
    setShowPostJobDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold">Medical Jobs Board</h1>
            {user && (
              <Button onClick={handleOpenPostJobDialog} data-testid="button-post-job">
                <Plus className="w-4 h-4 mr-2" />
                Post a Job
              </Button>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search job titles..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-jobs"
              />
            </div>
            
            <div className="relative w-full md:w-64">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Location"
                className="pl-10"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                data-testid="input-location"
              />
            </div>

            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="w-full md:w-64" data-testid="select-specialty">
                <SelectValue placeholder="All Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                <SelectItem value="cardiology">Cardiology</SelectItem>
                <SelectItem value="dermatology">Dermatology</SelectItem>
                <SelectItem value="neurology">Neurology</SelectItem>
                <SelectItem value="orthopedics">Orthopedics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-muted rounded" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-muted rounded w-1/2" />
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div>
            <p className="text-muted-foreground mb-6" data-testid="text-jobs-count">
              {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
            </p>
            
            <div className="space-y-4">
              {jobs.map((job: any) => (
                <Card key={job.id} className="hover:shadow-lg transition-all hover-elevate" data-testid={`card-job-${job.id}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2" data-testid={`text-job-title-${job.id}`}>
                              {job.title}
                            </h3>
                            {job.hospitalName && (
                              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <Building2 className="w-4 h-4" />
                                <span>{job.hospitalName}</span>
                              </div>
                            )}
                          </div>
                          {job.isActive && (
                            <Badge className="bg-green-500">Active</Badge>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-3 mb-4">
                          {job.location && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>{job.location}</span>
                            </div>
                          )}
                          {job.specialty && (
                            <div className="flex items-center gap-2 text-sm">
                              <Briefcase className="w-4 h-4 text-muted-foreground" />
                              <span>{job.specialty}</span>
                            </div>
                          )}
                          {job.salaryRange && (
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                              <span>{job.salaryRange}</span>
                            </div>
                          )}
                          {job.experienceRequired && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>{job.experienceRequired} experience</span>
                            </div>
                          )}
                        </div>

                        {job.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {job.description}
                          </p>
                        )}

                        <Link href={`/job/${job.id}`}>
                          <Button data-testid={`button-view-job-${job.id}`}>View Details & Apply</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Briefcase className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search filters</p>
            <Button onClick={() => { setSearchTerm(''); setLocation(''); setSpecialty(''); }} data-testid="button-clear-filters">
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Post Job Dialog */}
      <Dialog open={showPostJobDialog} onOpenChange={setShowPostJobDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post a New Job</DialogTitle>
            <DialogDescription>
              Fill in the details below to post a job opening
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePostJob)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Cardiologist, General Physician"
                        {...field}
                        data-testid="input-job-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hospitalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital/Clinic Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Apollo Hospital"
                        {...field}
                        value={field.value || ''}
                        data-testid="input-hospital-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialty</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Cardiology"
                          {...field}
                          value={field.value || ''}
                          data-testid="input-specialty"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || 'full-time'}>
                        <FormControl>
                          <SelectTrigger data-testid="select-job-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Mumbai"
                          {...field}
                          value={field.value || ''}
                          data-testid="input-city"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Maharashtra"
                          {...field}
                          value={field.value || ''}
                          data-testid="input-state"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="experienceRequired"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Required</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 3-5 years"
                          {...field}
                          value={field.value || ''}
                          data-testid="input-experience"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salaryRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Range</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. ₹8-12 LPA"
                          {...field}
                          value={field.value || ''}
                          data-testid="input-salary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the role and responsibilities..."
                        rows={4}
                        {...field}
                        value={field.value || ''}
                        data-testid="textarea-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requirements</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List qualifications, skills, and requirements..."
                        rows={4}
                        {...field}
                        value={field.value || ''}
                        data-testid="textarea-requirements"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPostJobDialog(false)}
                  data-testid="button-cancel-post"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={postJobMutation.isPending}
                  data-testid="button-submit-job"
                >
                  {postJobMutation.isPending ? 'Posting...' : 'Post Job'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
