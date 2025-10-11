import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  PlayCircle,
  CheckCircle,
  FileText,
  Video,
  FileCode,
  Lock,
  Award,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  BookOpen
} from 'lucide-react';
import { useState } from 'react';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { getAuthenticatedUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: number;
  title: string;
  description: string | null;
  thumbnailImage: string | null;
}

interface Module {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  contentType: 'video' | 'text' | 'pdf' | 'code' | null;
  contentUrl: string | null;
  contentText: string | null;
  duration: string | null;
  sortOrder: number;
}

interface Progress {
  id: number;
  userId: number;
  courseId: number;
  moduleId: number;
  completedAt: string;
}

interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  paymentStatus: string;
  amountPaid: number | null;
}

export default function CourseLearning() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const user = getAuthenticatedUser();
  const { toast } = useToast();
  const courseId = parseInt(id!);

  // Get module ID from URL query params
  const searchParams = new URLSearchParams(window.location.search);
  const initialModuleId = searchParams.get('module');
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(
    initialModuleId ? parseInt(initialModuleId) : null
  );
  const [showModuleList, setShowModuleList] = useState(true);

  // Fetch course details
  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: ['/api/courses', courseId],
  });

  // Fetch modules
  const { data: modules = [], isLoading: modulesLoading } = useQuery<Module[]>({
    queryKey: ['/api/courses', courseId, 'modules'],
    enabled: !isNaN(courseId),
  });

  // Fetch enrollment
  const { data: enrollment, isLoading: enrollmentLoading, error: enrollmentError } = useQuery<Enrollment>({
    queryKey: ['/api/courses', courseId, 'enrollment'],
    enabled: !isNaN(courseId),
  });

  // Fetch progress
  const { data: progressData = [] } = useQuery<Progress[]>({
    queryKey: ['/api/courses', courseId, 'progress'],
    enabled: !isNaN(courseId),
  });

  // Mark module as complete mutation
  const completeMutation = useMutation({
    mutationFn: async (moduleId: number) => {
      return apiRequest('POST', `/api/courses/${courseId}/progress`, { moduleId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses', courseId, 'progress'] });
      toast({
        title: 'Progress saved',
        description: 'Module marked as complete!',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save progress',
        variant: 'destructive',
      });
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Please Login</h2>
            <p className="text-muted-foreground mb-4">You need to be logged in to access this course</p>
            <Button onClick={() => setLocation('/login')} data-testid="button-login">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (courseLoading || modulesLoading || enrollmentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Course Not Found</h2>
            <Button onClick={() => setLocation('/courses')} data-testid="button-back-courses">
              Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Not Enrolled</h2>
            <p className="text-muted-foreground mb-4">
              {enrollmentError ? 'Unable to verify enrollment. Please try again.' : 'You need to enroll in this course first'}
            </p>
            <Button onClick={() => setLocation(`/course/${courseId}`)} data-testid="button-enroll-redirect">
              View Course
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Auto-select first module if none selected
  if (!selectedModuleId && modules.length > 0) {
    setSelectedModuleId(modules[0].id);
  }

  const selectedModule = modules.find(m => m.id === selectedModuleId);
  const completedModuleIds = new Set(progressData.map(p => p.moduleId));
  const completedCount = completedModuleIds.size;
  const totalModules = modules.length;
  const progressPercentage = totalModules > 0 ? (completedCount / totalModules) * 100 : 0;
  const isModuleComplete = selectedModuleId ? completedModuleIds.has(selectedModuleId) : false;

  const currentIndex = modules.findIndex(m => m.id === selectedModuleId);
  const hasNext = currentIndex < modules.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNext = () => {
    if (hasNext) {
      const nextModule = modules[currentIndex + 1];
      setSelectedModuleId(nextModule.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      const prevModule = modules[currentIndex - 1];
      setSelectedModuleId(prevModule.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleComplete = () => {
    if (selectedModuleId && !isModuleComplete) {
      completeMutation.mutate(selectedModuleId);
    }
  };

  const getModuleIcon = (type: string | null) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'code': return <FileCode className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const isCourseComplete = completedCount === totalModules && totalModules > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation(`/course/${courseId}`)}
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold" data-testid="text-course-title">{course.title}</h1>
                <p className="text-sm text-muted-foreground" data-testid="text-progress-summary">
                  {completedCount} of {totalModules} modules completed
                </p>
              </div>
            </div>

            {isCourseComplete && (
              <Button
                onClick={() => setLocation('/dashboard/certificates')}
                data-testid="button-view-certificate"
              >
                <Award className="w-4 h-4 mr-2" />
                View Certificate
              </Button>
            )}
          </div>

          <div className="mt-4">
            <Progress value={progressPercentage} className="h-2" data-testid="progress-bar" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Module List Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
                <CardTitle className="text-lg">Course Modules</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setShowModuleList(!showModuleList)}
                  data-testid="button-toggle-modules"
                >
                  {showModuleList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CardHeader>
              <CardContent className={`${showModuleList ? '' : 'hidden lg:block'}`}>
                <div className="space-y-2">
                  {modules.map((module, index) => {
                    const isComplete = completedModuleIds.has(module.id);
                    const isSelected = module.id === selectedModuleId;

                    return (
                      <button
                        key={module.id}
                        onClick={() => {
                          setSelectedModuleId(module.id);
                          setShowModuleList(false);
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          isSelected ? 'border-primary bg-primary/5' : 'hover-elevate'
                        }`}
                        data-testid={`module-list-item-${module.id}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary flex-shrink-0 text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm truncate">{module.title}</h4>
                              {isComplete && (
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" data-testid={`icon-complete-${module.id}`} />
                              )}
                            </div>
                            {module.duration && (
                              <p className="text-xs text-muted-foreground">{module.duration}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {isCourseComplete && (
              <Alert className="mt-4 border-green-500 bg-green-50 dark:bg-green-950/20" data-testid="alert-course-complete">
                <Award className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-900 dark:text-green-100">
                  Congratulations! You've completed all modules. Your certificate is ready!
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {selectedModule ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getModuleIcon(selectedModule.contentType)}
                        <Badge variant="outline" data-testid="badge-content-type">
                          {selectedModule.contentType || 'lesson'}
                        </Badge>
                      </div>
                      <CardTitle data-testid="text-module-title">{selectedModule.title}</CardTitle>
                      {selectedModule.description && (
                        <CardDescription data-testid="text-module-description">
                          {selectedModule.description}
                        </CardDescription>
                      )}
                    </div>
                    {isModuleComplete && (
                      <Badge className="bg-green-600 text-white" data-testid="badge-completed">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Content Display */}
                  <div className="mb-6" data-testid="module-content">
                    {selectedModule.contentType === 'video' && selectedModule.contentUrl && (
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <video
                          src={selectedModule.contentUrl}
                          controls
                          className="w-full h-full rounded-lg"
                          data-testid="video-player"
                        />
                      </div>
                    )}

                    {selectedModule.contentType === 'text' && selectedModule.contentText && (
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedModule.contentText }}
                        data-testid="text-content"
                      />
                    )}

                    {selectedModule.contentType === 'pdf' && selectedModule.contentUrl && (
                      <div className="border rounded-lg p-4">
                        <a
                          href={selectedModule.contentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline"
                          data-testid="link-pdf"
                        >
                          <FileText className="w-5 h-5" />
                          Open PDF Document
                        </a>
                      </div>
                    )}

                    {selectedModule.contentType === 'code' && selectedModule.contentText && (
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto" data-testid="code-content">
                        <code>{selectedModule.contentText}</code>
                      </pre>
                    )}

                    {!selectedModule.contentType && selectedModule.contentText && (
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedModule.contentText }}
                        data-testid="default-content"
                      />
                    )}

                    {!selectedModule.contentText && !selectedModule.contentUrl && (
                      <div className="text-center py-8 text-muted-foreground">
                        No content available for this module
                      </div>
                    )}
                  </div>

                  {/* Navigation and Actions */}
                  <div className="flex items-center justify-between gap-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={handlePrev}
                      disabled={!hasPrev}
                      data-testid="button-prev"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    <div className="flex gap-2">
                      {!isModuleComplete && (
                        <Button
                          onClick={handleComplete}
                          disabled={completeMutation.isPending}
                          data-testid="button-mark-complete"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {completeMutation.isPending ? 'Saving...' : 'Mark Complete'}
                        </Button>
                      )}

                      <Button
                        onClick={handleNext}
                        disabled={!hasNext}
                        data-testid="button-next"
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Module Selected</h3>
                  <p className="text-muted-foreground">Select a module from the sidebar to begin learning</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
