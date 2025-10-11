import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Stethoscope, 
  GraduationCap, 
  BrainCircuit, 
  Briefcase, 
  FileText, 
  Trophy,
  Search,
  MapPin,
  BookOpen,
  Calendar,
  Users
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Empowering Medical Professionals
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90">
              Connect, Learn, and Grow with India's Premier Medical Platform
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2 bg-white/10 backdrop-blur-md p-2 rounded-lg">
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Search doctors by name or specialty..."
                    className="border-0 bg-white text-foreground placeholder:text-muted-foreground"
                    data-testid="input-search-hero"
                  />
                  <Input
                    placeholder="Location"
                    className="border-0 bg-white text-foreground placeholder:text-muted-foreground w-48"
                    data-testid="input-location-hero"
                  />
                </div>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" data-testid="button-search-hero">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" data-testid="button-get-started">
                  Get Started
                </Button>
              </Link>
              <Link href="/directory">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" data-testid="button-explore-directory">
                  Explore Directory
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: 'Medical Professionals', value: '10,000+' },
              { icon: BookOpen, label: 'Courses Available', value: '500+' },
              { icon: Briefcase, label: 'Job Listings', value: '1,200+' },
              { icon: GraduationCap, label: 'Students Enrolled', value: '25,000+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-3xl font-bold" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need in One Platform</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From finding specialists to advancing your career, DocsUniverse provides comprehensive tools for medical professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Stethoscope,
                title: 'Doctor Directory',
                description: 'Search and connect with medical professionals across India. View detailed profiles and specializations.',
                href: '/directory',
                testId: 'card-feature-directory'
              },
              {
                icon: BookOpen,
                title: 'Online Courses',
                description: 'Access high-quality medical courses with certifications. Learn at your own pace from expert instructors.',
                href: '/courses',
                testId: 'card-feature-courses'
              },
              {
                icon: Calendar,
                title: 'Masterclasses',
                description: 'Join exclusive workshop events and masterclasses with industry leaders. Limited seats available.',
                href: '/masterclasses',
                testId: 'card-feature-masterclasses'
              },
              {
                icon: Trophy,
                title: 'Medical Quizzes',
                description: 'Test your knowledge with timed competitive quizzes. Earn certificates and climb the leaderboard.',
                href: '/quizzes',
                testId: 'card-feature-quizzes'
              },
              {
                icon: Briefcase,
                title: 'Jobs Board',
                description: 'Discover medical job opportunities nationwide. Apply directly and track your applications.',
                href: '/jobs',
                testId: 'card-feature-jobs'
              },
              {
                icon: BrainCircuit,
                title: 'AI Medical Tools',
                description: 'Leverage AI for diagnostics, statistics, and clinical note generation. Boost your efficiency.',
                href: '/ai-tools',
                testId: 'card-feature-ai-tools'
              },
              {
                icon: FileText,
                title: 'Research Services',
                description: 'Get expert help with article writing, thesis support, and statistical consulting.',
                href: '/research-services',
                testId: 'card-feature-research'
              },
              {
                icon: MapPin,
                title: 'Hospital Listings',
                description: 'Browse comprehensive hospital information and facilities across the country.',
                href: '/hospitals',
                testId: 'card-feature-hospitals'
              },
              {
                icon: GraduationCap,
                title: 'For Students',
                description: 'Special resources and courses designed for medical students. Build your foundation.',
                href: '/login',
                testId: 'card-feature-students'
              },
            ].map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <Card className="h-full hover:shadow-lg transition-all hover-elevate cursor-pointer" data-testid={feature.testId}>
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join DocsUniverse?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of medical professionals advancing their careers and knowledge
          </p>
          <Link href="/login">
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" data-testid="button-join-now">
              Join Now - It's Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
