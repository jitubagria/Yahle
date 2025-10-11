import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {  
  Users, 
  GraduationCap, 
  Briefcase, 
  BookOpen,
  TrendingUp,
  UserCheck,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
  });

  const { data: users } = useQuery({
    queryKey: ['/api/admin/users'],
  });

  const metrics = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, change: '+12%', changeType: 'positive' },
    { label: 'Doctors', value: stats?.totalDoctors || 0, icon: UserCheck, change: '+8%', changeType: 'positive' },
    { label: 'Students', value: stats?.totalStudents || 0, icon: GraduationCap, change: '+15%', changeType: 'positive' },
    { label: 'Active Jobs', value: stats?.activeJobs || 0, icon: Briefcase, change: '-3%', changeType: 'negative' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, content, and platform analytics</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <Card key={metric.label} data-testid={`card-metric-${metric.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <metric.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant={metric.changeType === 'positive' ? 'default' : 'destructive'}>
                    {metric.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold mb-1" data-testid={`text-metric-value-${metric.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  {metric.value.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users" data-testid="tab-users">
              <Users className="w-4 h-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="content" data-testid="tab-content">
              <BookOpen className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage platform users</CardDescription>
              </CardHeader>
              <CardContent>
                {users && users.length > 0 ? (
                  <div className="space-y-4">
                    {users.map((user: any) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        data-testid={`user-row-${user.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium" data-testid={`text-user-phone-${user.id}`}>{user.phone}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.role} • {user.isVerified ? 'Verified' : 'Unverified'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={user.isVerified ? 'default' : 'outline'}>
                            {user.role}
                          </Badge>
                          <Button variant="outline" size="sm" data-testid={`button-edit-user-${user.id}`}>
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Course Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {stats?.totalCourses || 0} courses published
                  </p>
                  <Button className="w-full" data-testid="button-manage-courses">
                    Manage Courses
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Job Postings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {stats?.activeJobs || 0} active job listings
                  </p>
                  <Button className="w-full" data-testid="button-manage-jobs">
                    Manage Jobs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Platform Analytics
                </CardTitle>
                <CardDescription>Track platform growth and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">User Growth</span>
                      <span className="text-sm text-muted-foreground">+12% this month</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '75%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Course Enrollments</span>
                      <span className="text-sm text-muted-foreground">+8% this month</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '60%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Job Applications</span>
                      <span className="text-sm text-muted-foreground">+15% this month</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full" data-testid="button-view-detailed-analytics">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Detailed Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start" data-testid="button-verify-doctors">
                <UserCheck className="w-4 h-4 mr-2" />
                Verify Doctor Profiles
              </Button>
              <Button variant="outline" className="justify-start" data-testid="button-review-content">
                <AlertCircle className="w-4 h-4 mr-2" />
                Review Pending Content
              </Button>
              <Button variant="outline" className="justify-start" data-testid="button-manage-reports">
                <AlertCircle className="w-4 h-4 mr-2" />
                Manage Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
