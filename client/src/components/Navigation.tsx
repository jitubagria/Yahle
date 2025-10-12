import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Stethoscope, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getAuthenticatedUser, logout } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication on mount and when storage changes
    const checkAuth = () => {
      const currentUser = getAuthenticatedUser();
      setUser(currentUser);
    };
    
    checkAuth();
    
    // Listen for storage changes (e.g., login/logout in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/directory', label: 'Directory' },
    { href: '/courses', label: 'Courses' },
    { href: '/masterclasses', label: 'Masterclasses' },
    { href: '/quizzes', label: 'Quizzes' },
    { href: '/jobs', label: 'Jobs' },
    { href: '/ai-tools', label: 'AI Tools' },
    { href: '/medical-voices', label: 'Medical Voices' },
    { href: '/research-services', label: 'Research' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 font-bold text-xl hover-elevate px-3 py-2 rounded-md cursor-pointer" data-testid="link-home">
              <Stethoscope className="w-6 h-6 text-primary" />
              <span>DocsUniverse</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    'relative px-4 py-2 rounded-md text-sm font-medium hover-elevate cursor-pointer transition-colors',
                    location === item.href && 'bg-accent'
                  )}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" data-testid="button-user-menu">
                    <User className="w-4 h-4 mr-2" />
                    {user.phone}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={user.role === 'admin' ? '/admin' : '/dashboard'}>
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'doctor' && (
                    <DropdownMenuItem asChild>
                      <Link href={`/doctor/${user.id}/edit`}>
                        <User className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout} data-testid="button-logout">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" data-testid="button-login" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      'w-full px-4 py-2 rounded-md text-sm font-medium hover-elevate cursor-pointer transition-colors text-left',
                      location === item.href && 'bg-accent'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`nav-mobile-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t">
                {user ? (
                  <>
                    <Link href={user.role === 'admin' ? '/admin' : '/dashboard'}>
                      <Button variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    {user.role === 'doctor' && (
                      <Link href={`/doctor/${user.id}/edit`}>
                        <Button variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                          <User className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      data-testid="button-logout-mobile"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout ({user.phone})
                    </Button>
                  </>
                ) : (
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
