import { useState } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Edit,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';
import { Link } from 'wouter';

export default function DoctorProfile() {
  const [, params] = useRoute('/doctor/:id');
  const doctorId = params?.id;

  const { data: doctor, isLoading } = useQuery({
    queryKey: [`/api/doctors/${doctorId}`],
    enabled: !!doctorId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-6xl">
          <Card className="animate-pulse">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-40 h-40 bg-muted rounded-full" />
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Doctor not found</h2>
          <Link href="/directory">
            <Button>Back to Directory</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <Avatar className="w-40 h-40">
                <AvatarImage src={doctor.profilePic} />
                <AvatarFallback className="text-4xl">
                  {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2" data-testid="text-doctor-name">
                      Dr. {doctor.firstName} {doctor.middleName} {doctor.lastName}
                    </h1>
                    <p className="text-xl text-muted-foreground mb-3">{doctor.professionaldegree}</p>
                    <div className="flex flex-wrap gap-2">
                      {doctor.isprofilecomplete && (
                        <Badge variant="outline">Verified Profile</Badge>
                      )}
                      {doctor.pgBranch && (
                        <Badge>{doctor.pgBranch}</Badge>
                      )}
                    </div>
                  </div>
                  <Link href={`/doctor/${doctorId}/edit`}>
                    <Button variant="outline" data-testid="button-edit-profile">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  {doctor.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span data-testid="text-email">{doctor.email}</span>
                    </div>
                  )}
                  {doctor.userMobile && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span data-testid="text-phone">{doctor.userMobile}</span>
                    </div>
                  )}
                  {(doctor.jobCity || doctor.jobState) && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{[doctor.jobCity, doctor.jobState, doctor.jobCountry].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                  {doctor.userWebsite && (
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a href={doctor.userWebsite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {doctor.userWebsite}
                      </a>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {(doctor.userFacebook || doctor.userTwitter || doctor.userInstagram) && (
                  <div className="flex gap-3 mt-6">
                    {doctor.userFacebook && (
                      <a href={doctor.userFacebook} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon">
                          <Facebook className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                    {doctor.userTwitter && (
                      <a href={doctor.userTwitter} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon">
                          <Twitter className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                    {doctor.userInstagram && (
                      <a href={doctor.userInstagram} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon">
                          <Instagram className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="academic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="academic" data-testid="tab-academic">Academic</TabsTrigger>
            <TabsTrigger value="job" data-testid="tab-job">Job Details</TabsTrigger>
            <TabsTrigger value="contact" data-testid="tab-contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="academic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Academic Qualifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* UG */}
                {(doctor.ugCollege || doctor.ugLocation || doctor.ugAdmissionYear) && (
                  <div>
                    <h3 className="font-semibold mb-3">Undergraduate (UG)</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      {doctor.ugCollege && (
                        <div>
                          <p className="text-muted-foreground mb-1">College</p>
                          <p className="font-medium">{doctor.ugCollege}</p>
                        </div>
                      )}
                      {doctor.ugLocation && (
                        <div>
                          <p className="text-muted-foreground mb-1">Location</p>
                          <p className="font-medium">{doctor.ugLocation}</p>
                        </div>
                      )}
                      {doctor.ugAdmissionYear && (
                        <div>
                          <p className="text-muted-foreground mb-1">Admission Year</p>
                          <p className="font-medium">{doctor.ugAdmissionYear}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* PG */}
                {(doctor.pgCollege || doctor.pgLocation || doctor.pgAdmissionYear) && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Postgraduate (PG)</h3>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        {doctor.pgType && (
                          <div>
                            <p className="text-muted-foreground mb-1">Type</p>
                            <p className="font-medium">{doctor.pgType}</p>
                          </div>
                        )}
                        {doctor.pgBranch && (
                          <div>
                            <p className="text-muted-foreground mb-1">Branch</p>
                            <p className="font-medium">{doctor.pgBranch}</p>
                          </div>
                        )}
                        {doctor.pgCollege && (
                          <div>
                            <p className="text-muted-foreground mb-1">College</p>
                            <p className="font-medium">{doctor.pgCollege}</p>
                          </div>
                        )}
                        {doctor.pgLocation && (
                          <div>
                            <p className="text-muted-foreground mb-1">Location</p>
                            <p className="font-medium">{doctor.pgLocation}</p>
                          </div>
                        )}
                        {doctor.pgAdmissionYear && (
                          <div>
                            <p className="text-muted-foreground mb-1">Admission Year</p>
                            <p className="font-medium">{doctor.pgAdmissionYear}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Super Specialty */}
                {(doctor.ssCollege || doctor.ssLocation || doctor.ssAdmissionYear) && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Super Specialty (SS)</h3>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        {doctor.ssType && (
                          <div>
                            <p className="text-muted-foreground mb-1">Type</p>
                            <p className="font-medium">{doctor.ssType}</p>
                          </div>
                        )}
                        {doctor.ssBranch && (
                          <div>
                            <p className="text-muted-foreground mb-1">Branch</p>
                            <p className="font-medium">{doctor.ssBranch}</p>
                          </div>
                        )}
                        {doctor.ssCollege && (
                          <div>
                            <p className="text-muted-foreground mb-1">College</p>
                            <p className="font-medium">{doctor.ssCollege}</p>
                          </div>
                        )}
                        {doctor.ssLocation && (
                          <div>
                            <p className="text-muted-foreground mb-1">Location</p>
                            <p className="font-medium">{doctor.ssLocation}</p>
                          </div>
                        )}
                        {doctor.ssAdmissionYear && (
                          <div>
                            <p className="text-muted-foreground mb-1">Admission Year</p>
                            <p className="font-medium">{doctor.ssAdmissionYear}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Additional Qualifications */}
                {doctor.additionalqualificationCourse && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Additional Qualifications</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Course</p>
                          <p className="font-medium">{doctor.additionalqualificationCourse}</p>
                        </div>
                        {doctor.additionalqualificationCollege && (
                          <div>
                            <p className="text-muted-foreground mb-1">College/Institute</p>
                            <p className="font-medium">{doctor.additionalqualificationCollege}</p>
                          </div>
                        )}
                        {doctor.additionalqualificationLocation && (
                          <div>
                            <p className="text-muted-foreground mb-1">Location</p>
                            <p className="font-medium">{doctor.additionalqualificationLocation}</p>
                          </div>
                        )}
                        {doctor.additionalqualificationAdmissionYear && (
                          <div>
                            <p className="text-muted-foreground mb-1">Year</p>
                            <p className="font-medium">{doctor.additionalqualificationAdmissionYear}</p>
                          </div>
                        )}
                      </div>
                      {doctor.additionalqualificationDetails && (
                        <p className="mt-3 text-sm">{doctor.additionalqualificationDetails}</p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="job">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {doctor.jobSector && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Sector</p>
                      <p className="font-medium">{doctor.jobSector}</p>
                    </div>
                  )}
                  {doctor.jobPrivateHospital && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Hospital</p>
                      <p className="font-medium">{doctor.jobPrivateHospital}</p>
                    </div>
                  )}
                  {doctor.jobMedicalcollege && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Medical College</p>
                      <p className="font-medium">{doctor.jobMedicalcollege}</p>
                    </div>
                  )}
                  {doctor.jobCountry && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Country</p>
                      <p className="font-medium">{doctor.jobCountry}</p>
                    </div>
                  )}
                  {doctor.jobState && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">State</p>
                      <p className="font-medium">{doctor.jobState}</p>
                    </div>
                  )}
                  {doctor.jobCity && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">City</p>
                      <p className="font-medium">{doctor.jobCity}</p>
                    </div>
                  )}
                  {doctor.jobCentralSub && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Central Sub</p>
                      <p className="font-medium">{doctor.jobCentralSub}</p>
                    </div>
                  )}
                  {doctor.jobStateSub && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">State Sub</p>
                      <p className="font-medium">{doctor.jobStateSub}</p>
                    </div>
                  )}
                  {doctor.jobRajDistrict && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Rajasthan District</p>
                      <p className="font-medium">{doctor.jobRajDistrict}</p>
                    </div>
                  )}
                  {doctor.jaipurarea && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Jaipur Area</p>
                      <p className="font-medium">{doctor.jaipurarea}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctor.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Email</p>
                        <p className="font-medium">{doctor.email}</p>
                      </div>
                    </div>
                  )}
                  {doctor.userMobile && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Mobile</p>
                        <p className="font-medium">{doctor.userMobile}</p>
                      </div>
                    </div>
                  )}
                  {doctor.alternateno && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Alternate Number</p>
                        <p className="font-medium">{doctor.alternateno}</p>
                      </div>
                    </div>
                  )}
                  {doctor.contactOthers && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Other Contact</p>
                        <p className="font-medium">{doctor.contactOthers}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
