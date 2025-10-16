import { useState } from 'react';
import logger from '@/lib/logger';
import { useRoute, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { DoctorProfile as DoctorProfileModel } from '../types/models';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Save, Upload, X } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import ImageCropperModal from '@/components/ImageCropperModal';

const profileSchema = z.object({
  // General
  email: z.string().email().optional().or(z.literal('')),
  firstName: z.string().min(2).optional().or(z.literal('')),
  middleName: z.string().optional().or(z.literal('')),
  lastName: z.string().min(2).optional().or(z.literal('')),
  dob: z.string().optional().or(z.literal('')),
  gender: z.string().optional().or(z.literal('')),
  marriatialstatus: z.string().optional().or(z.literal('')),
  professionaldegree: z.string().optional().or(z.literal('')),
  
  // Contact
  userMobile: z.string().optional().or(z.literal('')),
  alternateno: z.string().optional().or(z.literal('')),
  userWebsite: z.string().url().optional().or(z.literal('')),
  userFacebook: z.string().optional().or(z.literal('')),
  userTwitter: z.string().optional().or(z.literal('')),
  userInstagram: z.string().optional().or(z.literal('')),
  
  // Academic
  ugCollege: z.string().optional().or(z.literal('')),
  ugLocation: z.string().optional().or(z.literal('')),
  ugAdmissionYear: z.string().optional().or(z.literal('')),
  pgType: z.string().optional().or(z.literal('')),
  pgBranch: z.string().optional().or(z.literal('')),
  pgCollege: z.string().optional().or(z.literal('')),
  pgLocation: z.string().optional().or(z.literal('')),
  pgAdmissionYear: z.string().optional().or(z.literal('')),
  ssType: z.string().optional().or(z.literal('')),
  ssBranch: z.string().optional().or(z.literal('')),
  ssCollege: z.string().optional().or(z.literal('')),
  ssLocation: z.string().optional().or(z.literal('')),
  ssAdmissionYear: z.string().optional().or(z.literal('')),
  
  // Job
  jobSector: z.string().optional().or(z.literal('')),
  jobCountry: z.string().optional().or(z.literal('')),
  jobState: z.string().optional().or(z.literal('')),
  jobCity: z.string().optional().or(z.literal('')),
  jobPrivateHospital: z.string().optional().or(z.literal('')),
  jobMedicalcollege: z.string().optional().or(z.literal('')),
});

export default function DoctorProfileEdit() {
  const [, params] = useRoute('/doctor/:id/edit');
  const [, navigate] = useLocation();
  const doctorId = params?.id;
  const { toast } = useToast();
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: doctor, isLoading } = useQuery<DoctorProfileModel | null>({
    queryKey: [`/api/doctors/${doctorId}`],
    enabled: !!doctorId,
  });

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: (doctor as any) || {},
    values: (doctor as any) || undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiRequest('PATCH', `/api/doctors/${doctorId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/doctors/${doctorId}`] });
      toast({ title: 'Success', description: 'Profile updated successfully' });
      navigate(`/doctor/${doctorId}`);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (images: { profile_pic: string; thumbl: string; thumbs: string; thumbimage: string }) => {
    try {
      const uploadedPaths: any = {};
      const userId = doctor?.userId;
      
      if (!userId) {
        toast({ title: 'Error', description: 'User session not found. Please log in again.', variant: 'destructive' });
        return;
      }
      
      // Upload each image size to object storage
      for (const [key, base64] of Object.entries(images)) {
      // Get upload URL and object path
      const uploadResponse = await apiRequest('POST', '/api/objects/upload', {});
      // apiRequest returns parsed JSON; be explicit and parse/cast for safety
      const data = (await (uploadResponse as any)) as { uploadURL: string; objectPath: string };
      const { uploadURL, objectPath } = data as { uploadURL: string; objectPath: string };
        
        // Convert base64 to blob
        const blob = await fetch(base64).then(r => r.blob());
        
        // Upload to object storage
        await fetch(uploadURL, {
          method: 'PUT',
          body: blob,
          headers: {
            'Content-Type': 'image/jpeg',
          },
        });
        
        uploadedPaths[key] = objectPath;
      }
      
      // Set ACL policy for all uploaded images
      await apiRequest('PUT', '/api/profile-images', {
        userId,
        imagePaths: uploadedPaths,
      });
      
      // Update form with storage paths
      form.setValue('profilePic', uploadedPaths.profile_pic);
      form.setValue('thumbl', uploadedPaths.thumbl);
      form.setValue('thumbs', uploadedPaths.thumbs);
      form.setValue('thumbimage', uploadedPaths.thumbimage);
      
      setShowCropper(false);
      toast({ title: 'Success', description: 'Images uploaded successfully' });
    } catch (error) {
      logger.error('Image upload error:', error);
      toast({ title: 'Error', description: 'Failed to upload images', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-96 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <Button variant="outline" onClick={() => navigate(`/doctor/${doctorId}`)} data-testid="button-cancel">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))} className="space-y-8">
            {/* Profile Picture */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={form.watch('profilePic')} />
                    <AvatarFallback className="text-2xl">
                      {form.watch('firstName')?.[0]}{form.watch('lastName')?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                      data-testid="input-image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button type="button" variant="outline" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Photo
                        </span>
                      </Button>
                    </label>
                    <p className="text-sm text-muted-foreground mt-2">
                      Professional headshot recommended. Square format works best.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general" data-testid="tab-general">General</TabsTrigger>
                <TabsTrigger value="contact" data-testid="tab-contact">Contact</TabsTrigger>
                <TabsTrigger value="academic" data-testid="tab-academic">Academic</TabsTrigger>
                <TabsTrigger value="job" data-testid="tab-job">Job</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>General Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-first-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="middleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle Name</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-middle-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-last-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-dob" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-gender">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="marriatialstatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marital Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-marital-status">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="single">Single</SelectItem>
                              <SelectItem value="married">Married</SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                              <SelectItem value="widowed">Widowed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="professionaldegree"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Professional Degree</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="MBBS, MD, MS, etc." data-testid="input-professional-degree" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="userMobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-mobile" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="alternateno"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alternate Number</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-alternate-number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="userWebsite"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input type="url" {...field} placeholder="https://example.com" data-testid="input-website" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="userFacebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Facebook profile URL" data-testid="input-facebook" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="userTwitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Twitter profile URL" data-testid="input-twitter" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="userInstagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Instagram profile URL" data-testid="input-instagram" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="academic">
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Qualifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* UG Section */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Undergraduate (UG)</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="ugCollege"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>College</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-ug-college" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ugLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-ug-location" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ugAdmissionYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Admission Year</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="2015" data-testid="input-ug-year" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* PG Section */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Postgraduate (PG)</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="pgType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="MD, MS, DNB" data-testid="input-pg-type" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="pgBranch"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Branch</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Cardiology, etc." data-testid="input-pg-branch" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="pgCollege"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>College</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-pg-college" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="pgLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-pg-location" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="pgAdmissionYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Admission Year</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-pg-year" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* SS Section */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Super Specialty (SS)</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="ssType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="DM, MCh" data-testid="input-ss-type" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ssBranch"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Branch</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-ss-branch" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ssCollege"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>College</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-ss-college" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ssLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-ss-location" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ssAdmissionYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Admission Year</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-ss-year" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="job">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="jobSector"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sector</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Government, Private, etc." data-testid="input-job-sector" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="jobCountry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-job-country" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="jobState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-job-state" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="jobCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-job-city" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="jobPrivateHospital"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Hospital/Institution</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-job-hospital" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(`/doctor/${doctorId}`)} data-testid="button-cancel-bottom">
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} data-testid="button-save">
                <Save className="w-4 h-4 mr-2" />
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {showCropper && selectedImage && (
        <ImageCropperModal
          image={selectedImage}
          onComplete={handleCropComplete}
          onCancel={() => setShowCropper(false)}
        />
      )}
    </div>
  );
}
