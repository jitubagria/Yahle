import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Stethoscope, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/directory', label: 'Directory' },
    { href: '/courses', label: 'Courses' },
    { href: '/masterclasses', label: 'Masterclasses' },
    { href: '/quizzes', label: 'Quizzes' },
    { href: '/jobs', label: 'Jobs' },
    { href: '/ai-tools', label: 'AI Tools' },
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
            <Button variant="outline" data-testid="button-login" asChild>
              <Link href="/login">Login</Link>
            </Button>
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
              <div className="flex gap-2 pt-4 border-t">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
