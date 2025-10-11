import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Brain, 
  Briefcase, 
  Calendar, 
  Award, 
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'wouter';
import { getAuthenticatedUser } from '@/lib/auth';

export default function UserDashboard() {
  const user = getAuthenticatedUser();

  const { data: dashboardData } = useQuery<any>({
    queryKey: ['/api/dashboard/user'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/user');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      return response.json();
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Please Login</h2>
            <p className="text-muted-foreground mb-4">You need to be logged in to view your dashboard</p>
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const profileCompleteness = dashboardData?.profileCompleteness || 0;
  const enrolledCourses = dashboardData?.enrolledCourses || 0;
  const quizRank = dashboardData?.quizRank || '-';
  const activeRequests = dashboardData?.activeRequests || 0;
  const nextMasterclass = dashboardData?.nextMasterclass;
  const certificates = dashboardData?.certificates || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-dashboard-title">
            Welcome back, {user.name || user.phone}!
          </h1>
          <p className="text-muted-foreground">Here's your learning and activity overview</p>
        </div>

        {/* Overview Widgets */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Completeness */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Profile Completeness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{profileCompleteness}%</span>
                  <Link href="/doctor/edit">
                    <Button size="sm" variant="outline">Complete</Button>
                  </Link>
                </div>
                <Progress value={profileCompleteness} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Enrolled Courses */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Enrolled Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{enrolledCourses}</span>
                <Link href="/courses">
                  <Button size="sm" variant="ghost">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Rank */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Quiz Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{quizRank}</span>
                <Link href="/quizzes">
                  <Button size="sm" variant="ghost">
                    Take Quiz <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Active Service Requests */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Active Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{activeRequests}</span>
                <Link href="/research-services">
                  <Button size="sm" variant="ghost">
                    View <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Next Masterclass */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Next Masterclass
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {nextMasterclass ? (
                  <>
                    <p className="text-sm font-medium">{nextMasterclass.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(nextMasterclass.date).toLocaleDateString()}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No upcoming events</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Certificates Earned */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="w-4 h-4" />
                Certificates Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{certificates}</span>
                <Badge variant="secondary">{certificates > 0 ? 'View All' : 'Start Learning'}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/courses">
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Browse Courses</h3>
                    <p className="text-sm text-muted-foreground">Explore learning</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/quizzes">
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Take Quiz</h3>
                    <p className="text-sm text-muted-foreground">Test knowledge</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/jobs">
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Find Jobs</h3>
                    <p className="text-sm text-muted-foreground">Career opportunities</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/ai-tools">
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Tools</h3>
                    <p className="text-sm text-muted-foreground">Smart assistance</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
                dashboardData.recentActivity.map((activity: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity. Start exploring courses and quizzes!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
