import { useParams } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Check, User } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { getAuthenticatedUser } from '@/lib/auth';

export default function MasterclassDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const user = getAuthenticatedUser();

  const { data: masterclass, isLoading } = useQuery<any>({
    queryKey: ['/api/masterclasses', id],
    queryFn: async () => {
      const response = await fetch(`/api/masterclasses/${id}`);
      if (!response.ok) throw new Error('Failed to fetch masterclass');
      return response.json();
    },
  });

  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error('Please login to register');
      }
      const response = await apiRequest('POST', '/api/masterclasses/book', {
        masterclassId: parseInt(id!),
        userId: user.id,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Registration successful! Check WhatsApp for confirmation.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/masterclasses', id] });
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

  if (!masterclass) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Masterclass not found</h2>
          <p className="text-muted-foreground">The masterclass you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isFull = masterclass.currentParticipants >= masterclass.maxParticipants;
  const spotsLeft = masterclass.maxParticipants - masterclass.currentParticipants;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            <Badge className="mb-4">Registration Open</Badge>
            <h1 className="text-4xl font-bold mb-4" data-testid="text-masterclass-title">
              {masterclass.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {masterclass.instructor && `Dr. ${masterclass.instructor}`}
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(masterclass.eventDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {masterclass.duration} minutes
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About This Masterclass</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {masterclass.description || 'Comprehensive masterclass covering advanced topics and hands-on training with innovative techniques. Participants will learn cutting-edge techniques and case-study based approaches for real-world applications.'}
                </p>
              </CardContent>
            </Card>

            {/* Instructors */}
            {masterclass.instructor && (
              <Card>
                <CardHeader>
                  <CardTitle>Instructors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Dr. {masterclass.instructor}</h3>
                      <p className="text-sm text-muted-foreground">
                        Renowned specialist with extensive experience in the field
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Learning Topics */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    'Advanced surgical techniques',
                    'Patient management protocols',
                    'Evidence-based approaches',
                    'Latest research findings',
                    'Interactive case discussions'
                  ].map((topic, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{topic}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">
                      Day 1 - {new Date(masterclass.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="space-y-3 ml-4 border-l-2 border-primary/20 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-muted-foreground">9:00 AM - 10:30 AM</p>
                          <p className="font-medium">Introduction and fundamentals</p>
                          <p className="text-sm text-muted-foreground">
                            {masterclass.instructor && `Dr. ${masterclass.instructor}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-muted-foreground">11:00 AM - 12:30 PM</p>
                          <p className="font-medium">Advanced techniques</p>
                          <p className="text-sm text-muted-foreground">
                            {masterclass.instructor && `Dr. ${masterclass.instructor}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-muted-foreground">2:00 PM - 3:30 PM</p>
                          <p className="font-medium">Hands-on session</p>
                          <p className="text-sm text-muted-foreground">Practical training</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    'Materials & Resources',
                    'Certificate of Completion',
                    'Lunch & Refreshments',
                    'Course Materials',
                    'CME Credits'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Target Audience */}
            <Card>
              <CardHeader>
                <CardTitle>Target Audience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This masterclass is designed for medical students, surgical residents, and fellows interested in advancing their knowledge and practical skills in the field.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Event Details & Registration */}
          <div className="space-y-6">
            {/* Event Details Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="font-medium">
                    {new Date(masterclass.eventDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Duration</p>
                  <p className="font-medium">{masterclass.duration} minutes</p>
                </div>
                {masterclass.location && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Venue</p>
                    <p className="font-medium">{masterclass.location}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Seats Available</p>
                  <p className="font-medium">
                    {spotsLeft} / {masterclass.maxParticipants}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div className="bg-primary/10 rounded-lg p-4 text-center mb-4">
                    <p className="text-2xl font-bold mb-1">₹{masterclass.price}</p>
                    {spotsLeft <= 5 && spotsLeft > 0 && (
                      <p className="text-sm text-orange-600">Only {spotsLeft} spots left!</p>
                    )}
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => bookMutation.mutate()}
                    disabled={isFull || bookMutation.isPending || !user}
                    data-testid="button-register"
                  >
                    {isFull ? 'Fully Booked' : bookMutation.isPending ? 'Registering...' : user ? 'Register Now' : 'Login to Register'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Need more information?
                </p>
                <Button variant="outline" className="w-full">
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
