import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Briefcase, AlertCircle, RefreshCw, MapPin, DollarSign, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Job = {
  id: number;
  title: string;
  hospitalId: number | null;
  hospitalName: string | null;
  specialty: string | null;
  location: string | null;
  state: string | null;
  city: string | null;
  experienceRequired: string | null;
  salaryRange: string | null;
  jobType: string | null;
  description: string | null;
  requirements: string | null;
  postedBy: number | null;
  isActive: boolean | null;
  postedAt: Date;
};

export default function AdminJobs() {
  const { data: jobs = [], isLoading, isError, error, refetch } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
  });

  const getJobTypeColor = (jobType: string | null) => {
    switch (jobType) {
      case 'full-time': return 'default';
      case 'part-time': return 'secondary';
      case 'contract': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Jobs Board Management</h1>
          <p className="text-muted-foreground">Manage job postings and applications</p>
        </div>
        <Button data-testid="button-create-job">
          <Plus className="w-4 h-4 mr-2" />
          Post Job
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            All Jobs ({jobs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading jobs...</div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Jobs</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : 'Failed to fetch jobs. Please try again.'}
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
          ) : jobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No jobs posted yet</p>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Post Your First Job
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Title</th>
                    <th className="text-left py-3 px-4 font-semibold">Hospital</th>
                    <th className="text-left py-3 px-4 font-semibold">Location</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Salary</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-b hover-elevate" data-testid={`row-job-${job.id}`}>
                      <td className="py-3 px-4">
                        <div className="font-medium">{job.title}</div>
                        {job.specialty && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {job.specialty}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {job.hospitalName || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {job.city && job.state ? `${job.city}, ${job.state}` : job.location || '-'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getJobTypeColor(job.jobType)}>
                          {job.jobType || 'full-time'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {job.salaryRange ? (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {job.salaryRange}
                          </div>
                        ) : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {job.isActive ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Closed</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-applications-${job.id}`}
                          >
                            Applications
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-edit-${job.id}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-delete-${job.id}`}
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
