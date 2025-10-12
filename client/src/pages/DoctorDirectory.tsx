import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Stethoscope, Filter } from 'lucide-react';
import { Link } from 'wouter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DoctorDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [appliedLocation, setAppliedLocation] = useState('');
  const [appliedSpecialty, setAppliedSpecialty] = useState('');

  const { data: doctors, isLoading } = useQuery({
    queryKey: ['/api/doctors', appliedSearchTerm, appliedLocation, appliedSpecialty],
  });

  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
    setAppliedLocation(location);
    setAppliedSpecialty(specialty);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setSpecialty('');
    setAppliedSearchTerm('');
    setAppliedLocation('');
    setAppliedSpecialty('');
  };

  const specialties = [
    'All Specialties',
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Search */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-6">Doctor Directory</h1>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-6xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or professional degree..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                data-testid="input-search-doctors"
              />
            </div>
            
            <div className="relative w-full md:w-64">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Location"
                className="pl-10"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                data-testid="input-location"
              />
            </div>

            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="w-full md:w-64" data-testid="select-specialty">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  <SelectValue placeholder="All Specialties" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {specialties.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button onClick={handleSearch} data-testid="button-search-doctors">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              {(appliedSearchTerm || appliedLocation || appliedSpecialty) && (
                <Button variant="outline" onClick={handleClearFilters} data-testid="button-clear-filters">
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-muted rounded-full" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="h-4 bg-muted rounded w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : doctors && doctors.length > 0 ? (
          <div>
            <p className="text-muted-foreground mb-6" data-testid="text-results-count">
              {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} found
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor: any) => (
                <Link key={doctor.id} href={`/doctor/${doctor.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all hover-elevate cursor-pointer" data-testid={`card-doctor-${doctor.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={doctor.profilePic} />
                          <AvatarFallback className="text-lg">
                            {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 truncate" data-testid={`text-doctor-name-${doctor.id}`}>
                            Dr. {doctor.firstName} {doctor.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">{doctor.professionaldegree}</p>
                          {doctor.isprofilecomplete && (
                            <Badge variant="outline" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>

                      {doctor.pgBranch && (
                        <div className="flex items-center gap-2 text-sm mb-2">
                          <Stethoscope className="w-4 h-4 text-muted-foreground" />
                          <span>{doctor.pgBranch}</span>
                        </div>
                      )}

                      {(doctor.jobCity || doctor.jobState) && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{[doctor.jobCity, doctor.jobState].filter(Boolean).join(', ')}</span>
                        </div>
                      )}

                      <Button className="w-full mt-4" variant="outline" data-testid={`button-view-profile-${doctor.id}`}>
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Stethoscope className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No doctors found</h3>
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
