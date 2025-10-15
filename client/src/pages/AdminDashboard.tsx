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
  BarChart3,
  Brain,
  FileText,
  Calendar,
  Building,
  MessageSquare,
  Settings,
  ArrowRight
} from 'lucide-react';
import { getAuthenticatedUser } from '@/lib/auth';
import type { StatsResponse } from '@/types/models';
import { useEffect } from 'react';
import { useLocation, Link } from 'wouter';

export default function AdminDashboard() {
  const user = getAuthenticatedUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      setLocation('/');
    }
  }, [user, setLocation]);

  const { data: stats } = useQuery<StatsResponse>({
    queryKey: ['/api/admin/stats'],
  });

  if (!user || user.role !== 'admin') {
    return null;
  }

  const metrics = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, change: '+12%', changeType: 'positive' },
    { label: 'Doctors', value: stats?.totalDoctors || 0, icon: UserCheck, change: '+8%', changeType: 'positive' },
    { label: 'Students', value: stats?.totalStudents || 0, icon: GraduationCap, change: '+15%', changeType: 'positive' },
    { label: 'Active Jobs', value: stats?.activeJobs || 0, icon: Briefcase, change: '-3%', changeType: 'negative' },
  ];

  const managementModules = [
    {
      title: 'Doctors Directory',
      description: 'Manage profiles, import Excel, approval queue',
      icon: Users,
      href: '/admin/doctors',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Hospitals Directory',
      description: 'Add hospitals, link doctors, export data',
      icon: Building,
      href: '/admin/hospitals',
      color: 'bg-green-500/10 text-green-600',
    },
    {
      title: 'Courses & Learning',
      description: 'Create courses, upload content, enrollments',
      icon: GraduationCap,
      href: '/admin/courses',
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      title: 'Quizzes',
      description: 'Question bank, schedule, certificates',
      icon: Brain,
      href: '/admin/quizzes',
      color: 'bg-orange-500/10 text-orange-600',
    },
    {
      title: 'Masterclasses',
      description: 'Schedule events, manage participants',
      icon: Calendar,
      href: '/admin/masterclasses',
      color: 'bg-pink-500/10 text-pink-600',
    },
    {
      title: 'Jobs Board',
      description: 'Post jobs, view applications',
      icon: Briefcase,
      href: '/admin/jobs',
      color: 'bg-cyan-500/10 text-cyan-600',
    },
    {
      title: 'AI Tools',
      description: 'Manage tools, requests log, access',
      icon: Brain,
      href: '/admin/ai-tools',
      color: 'bg-indigo-500/10 text-indigo-600',
    },
    {
      title: 'Research & Services',
      description: 'Catalogue, providers, reports',
      icon: FileText,
      href: '/admin/research',
      color: 'bg-teal-500/10 text-teal-600',
    },
    {
      title: 'Users & CRM',
      description: 'Manage users, roles, activity log',
      icon: Users,
      href: '/admin/users',
      color: 'bg-red-500/10 text-red-600',
    },
    {
      title: 'Manual Messaging',
      description: 'Filter users, send WhatsApp/Email',
      icon: MessageSquare,
      href: '/admin/messaging',
      color: 'bg-amber-500/10 text-amber-600',
    },
    {
      title: 'Payments & Reports',
      description: 'Transactions, revenue, refunds',
      icon: BarChart3,
      href: '/admin/payments',
      color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      title: 'Settings',
      description: 'API configs, branding, integrations',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-slate-500/10 text-slate-600',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-admin-title">Admin Dashboard - CRM</h1>
          <p className="text-muted-foreground">Comprehensive management system for DocsUniverse</p>
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

        {/* Management Modules */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Management Modules</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {managementModules.map((module) => (
              <Link key={module.href} href={module.href}>
                <Card className="hover-elevate cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${module.color}`}>
                        <module.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">{module.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{module.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions & Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" data-testid="button-add-doctor">
                <Users className="w-4 h-4 mr-2" />
                Add New Doctor
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-create-course">
                <GraduationCap className="w-4 h-4 mr-2" />
                Create Course
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-send-message">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Bulk Message
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-post-job">
                <Briefcase className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                  <div>
                    <p className="font-medium">New doctor registered</p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                  <div>
                    <p className="font-medium">Course enrolled</p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5" />
                  <div>
                    <p className="font-medium">Job application received</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
