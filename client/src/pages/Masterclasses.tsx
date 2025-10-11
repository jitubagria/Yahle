import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MapPin, Award } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function Masterclasses() {
  const { toast } = useToast();

  const { data: masterclasses, isLoading } = useQuery({
    queryKey: ['/api/masterclasses'],
  });

  const bookMutation = useMutation({
    mutationFn: (masterclassId: number) => apiRequest('POST', '/api/masterclasses/book', { masterclassId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/masterclasses'] });
      toast({ title: 'Success', description: 'Masterclass booked successfully!' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to book masterclass', variant: 'destructive' });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Masterclasses & Workshops</h1>
            <p className="text-xl text-primary-foreground/90">
              Join exclusive medical workshops and masterclasses with industry leaders. Limited seats available.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                  <div className="h-10 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : masterclasses && masterclasses.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {masterclasses.map((masterclass: any) => {
              const isFull = masterclass.currentParticipants >= masterclass.maxParticipants;
              const spotsLeft = masterclass.maxParticipants - masterclass.currentParticipants;
              
              return (
                <Card key={masterclass.id} className="hover:shadow-lg transition-all hover-elevate" data-testid={`card-masterclass-${masterclass.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="flex-1" data-testid={`text-masterclass-title-${masterclass.id}`}>
                        {masterclass.title}
                      </CardTitle>
                      {masterclass.isActive && !isFull && (
                        <Badge className="bg-green-500">Active</Badge>
                      )}
                      {isFull && (
                        <Badge variant="destructive">Full</Badge>
                      )}
                    </div>
                    <CardDescription>{masterclass.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {masterclass.instructor && (
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span>Instructor: {masterclass.instructor}</span>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(masterclass.eventDate).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{masterclass.duration} min</span>
                      </div>

                      {masterclass.location && (
                        <div className="flex items-center gap-2 col-span-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{masterclass.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {masterclass.currentParticipants}/{masterclass.maxParticipants} registered
                        </span>
                      </div>
                      {!isFull && spotsLeft <= 5 && (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Only {spotsLeft} spots left!
                        </Badge>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between">
                    {masterclass.price > 0 ? (
                      <span className="text-2xl font-bold">₹{masterclass.price}</span>
                    ) : (
                      <span className="text-lg font-semibold text-green-600">Free</span>
                    )}
                    <Button
                      onClick={() => bookMutation.mutate(masterclass.id)}
                      disabled={isFull || bookMutation.isPending}
                      data-testid={`button-book-${masterclass.id}`}
                    >
                      {isFull ? 'Fully Booked' : bookMutation.isPending ? 'Booking...' : 'Book Now'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No masterclasses available</h3>
            <p className="text-muted-foreground">Check back soon for upcoming events!</p>
          </div>
        )}
      </div>
    </div>
  );
}
