import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award } from 'lucide-react';
import { Link } from 'wouter';

export default function Courses() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ['/api/courses'],
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Medical Courses</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Advance your medical knowledge with our comprehensive online courses. Learn from expert instructors and earn certifications.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted" />
                <CardContent className="p-6 space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <Card key={course.id} className="flex flex-col hover:shadow-lg transition-all hover-elevate" data-testid={`card-course-${course.id}`}>
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  {course.thumbnailImage ? (
                    <img src={course.thumbnailImage} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-16 h-16 text-primary/40" />
                  )}
                  {course.price === 0 && (
                    <Badge className="absolute top-4 right-4 bg-green-500">Free</Badge>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="line-clamp-2" data-testid={`text-course-title-${course.id}`}>{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="space-y-3">
                    {course.instructor && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="w-4 h-4" />
                        <span>{course.instructor}</span>
                      </div>
                    )}
                    {course.duration && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration} hours</span>
                      </div>
                    )}
                    {course.enrollmentCount > 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{course.enrollmentCount} enrolled</span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between">
                  {course.price > 0 ? (
                    <span className="text-2xl font-bold">₹{course.price}</span>
                  ) : (
                    <span className="text-lg font-semibold text-green-600">Free</span>
                  )}
                  <Link href={`/course/${course.id}`}>
                    <Button data-testid={`button-view-course-${course.id}`}>View Course</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No courses available</h3>
            <p className="text-muted-foreground">Check back soon for new courses!</p>
          </div>
        )}
      </div>
    </div>
  );
}
