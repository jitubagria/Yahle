import { useParams, Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, DollarSign, Clock, Building, Users, ArrowLeft } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { getAuthenticatedUser } from '@/lib/auth';

export default function JobDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const user = getAuthenticatedUser();

  const { data: job, isLoading } = useQuery<any>({
    queryKey: ['/api/jobs', id],
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error('Please login to apply');
      }
      const response = await apiRequest('POST', `/api/jobs/${id}/apply`, {
        userId: user.id,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Application submitted successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs', id] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="animate-pulse">
            <div className="h-64 bg-muted" />
            <CardContent className="p-8 space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-5/6" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Job not found</h2>
          <p className="text-muted-foreground">The job you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            <Link href="/jobs">
              <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Button>
            </Link>
            <div className="flex items-center gap-2 mb-4">
              <Badge>{job.type || 'Full-time'}</Badge>
              {job.location && (
                <Badge variant="outline">
                  <MapPin className="w-3 h-3 mr-1" />
                  {job.location}
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold mb-4" data-testid="text-job-title">{job.title}</h1>
            
            {job.hospitalName && (
              <div className="flex items-center gap-2 text-xl text-muted-foreground mb-6">
                <Building className="w-5 h-5" />
                <span>{job.hospitalName}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-6 mb-6">
              {job.salary && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="font-medium">₹{job.salary}</span>
                </div>
              )}
              {job.experience && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span>{job.experience}</span>
                </div>
              )}
              {job.applicationCount !== undefined && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>{job.applicationCount} applicants</span>
                </div>
              )}
              {job.postedAt && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <Button 
              size="lg" 
              onClick={() => applyMutation.mutate()}
              disabled={applyMutation.isPending || !user}
              data-testid="button-apply"
            >
              {applyMutation.isPending ? 'Applying...' : user ? 'Apply Now' : 'Login to Apply'}
            </Button>
          </div>
        </div>
      </div>

      {/* Job Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {job.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none whitespace-pre-wrap">
                    {job.description}
                  </div>
                </CardContent>
              </Card>
            )}

            {job.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none whitespace-pre-wrap">
                    {job.requirements}
                  </div>
                </CardContent>
              </Card>
            )}

            {job.responsibilities && (
              <Card>
                <CardHeader>
                  <CardTitle>Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none whitespace-pre-wrap">
                    {job.responsibilities}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.type && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Job Type</p>
                    <p className="font-medium capitalize">{job.type}</p>
                  </div>
                )}
                {job.location && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                )}
                {job.salary && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Salary</p>
                    <p className="font-medium">₹{job.salary}</p>
                  </div>
                )}
                {job.experience && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Experience Required</p>
                    <p className="font-medium">{job.experience}</p>
                  </div>
                )}
                {job.department && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Department</p>
                    <p className="font-medium">{job.department}</p>
                  </div>
                )}
                {job.contactEmail && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Contact</p>
                    <p className="text-sm break-all">{job.contactEmail}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
