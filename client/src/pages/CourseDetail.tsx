import { useParams } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Star, CheckCircle } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { getAuthenticatedUser } from '@/lib/auth';

export default function CourseDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const user = getAuthenticatedUser();

  const { data: course, isLoading } = useQuery<any>({
    queryKey: ['/api/courses', id],
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error('Please login to enroll');
      }
      const response = await apiRequest('POST', '/api/courses/enroll', {
        courseId: parseInt(id!),
        userId: user.id,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Successfully enrolled in the course!',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/courses', id] });
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
            <div className="h-96 bg-muted" />
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

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Course not found</h2>
          <p className="text-muted-foreground">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                {course.price === 0 && (
                  <Badge className="bg-green-500">Free Course</Badge>
                )}
                <Badge variant="outline">{course.category || 'Medical'}</Badge>
              </div>
              <h1 className="text-4xl font-bold mb-4" data-testid="text-course-title">{course.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{course.description}</p>
              
              <div className="flex flex-wrap gap-6 mb-6">
                {course.instructor && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-medium">{course.instructor}</span>
                  </div>
                )}
                {course.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>{course.duration}</span>
                  </div>
                )}
                {course.enrollmentCount !== undefined && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span>{course.enrollmentCount} enrolled</span>
                  </div>
                )}
                {course.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span>{course.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {course.price !== undefined && (
                  <div className="text-3xl font-bold">
                    {course.price === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      <span className="text-primary">₹{course.price}</span>
                    )}
                  </div>
                )}
                <Button 
                  size="lg" 
                  onClick={() => enrollMutation.mutate()}
                  disabled={enrollMutation.isPending || !user}
                  data-testid="button-enroll"
                >
                  {enrollMutation.isPending ? 'Enrolling...' : user ? 'Enroll Now' : 'Login to Enroll'}
                </Button>
              </div>
            </div>

            <div className="relative">
              {course.thumbnailImage ? (
                <img 
                  src={course.thumbnailImage} 
                  alt={course.title} 
                  className="w-full h-96 object-cover rounded-lg shadow-xl"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-32 h-32 text-primary/40" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                {course.content ? (
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.content }} />
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <p>Comprehensive understanding of medical concepts</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <p>Practical skills and clinical knowledge</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <p>Expert insights and best practices</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <p>Certificate of completion</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {course.syllabus && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Course Syllabus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.syllabus }} />
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.level && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Level</p>
                    <p className="font-medium capitalize">{course.level}</p>
                  </div>
                )}
                {course.duration && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Duration</p>
                    <p className="font-medium">{course.duration}</p>
                  </div>
                )}
                {course.language && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Language</p>
                    <p className="font-medium">{course.language}</p>
                  </div>
                )}
                {course.certificate !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Certificate</p>
                    <p className="font-medium">{course.certificate ? 'Yes' : 'No'}</p>
                  </div>
                )}
                {course.prerequisites && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Prerequisites</p>
                    <p className="text-sm">{course.prerequisites}</p>
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
