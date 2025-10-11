import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, DollarSign, Clock, Building2, Search } from 'lucide-react';
import { Link } from 'wouter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['/api/jobs', searchTerm, location, specialty],
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-6">Medical Jobs Board</h1>
          
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
    </div>
  );
}
