import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, ExternalLink, Calendar, GraduationCap, FileText } from 'lucide-react';
import { useLocation } from 'wouter';
import { getAuthenticatedUser } from '@/lib/auth';
import { formatDistanceToNow } from 'date-fns';
import { useEffect } from 'react';

interface Certificate {
  id: number;
  courseId: number;
  certificateNumber: string;
  certificateUrl: string | null;
  issuedAt: string;
  courseTitle: string;
  courseDescription: string | null;
  courseImage: string | null;
}

export default function Certificates() {
  const [, setLocation] = useLocation();
  const user = getAuthenticatedUser();

  useEffect(() => {
    if (!user) {
      setLocation('/login');
    }
  }, [user, setLocation]);

  const { data: certificates = [], isLoading } = useQuery<Certificate[]>({
    queryKey: ['/api/certificates'],
    enabled: !!user,
  });

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold" data-testid="text-page-title">My Certificates</h1>
          </div>
          <p className="text-muted-foreground">
            View and download your earned course completion certificates
          </p>
        </div>

        {certificates.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2" data-testid="text-empty-state">No Certificates Yet</h3>
              <p className="text-muted-foreground mb-6">
                Complete courses to earn certificates and showcase your achievements
              </p>
              <Button onClick={() => setLocation('/courses')} data-testid="button-browse-courses">
                <FileText className="w-4 h-4 mr-2" />
                Browse Courses
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground" data-testid="text-certificate-count">
                {certificates.length} {certificates.length === 1 ? 'certificate' : 'certificates'} earned
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <Card key={cert.id} className="hover-elevate" data-testid={`certificate-card-${cert.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-xs" data-testid={`badge-cert-number-${cert.id}`}>
                        #{cert.certificateNumber}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg" data-testid={`text-course-name-${cert.id}`}>
                      {cert.courseTitle}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1" data-testid={`text-completion-date-${cert.id}`}>
                      <Calendar className="w-3 h-3" />
                      <span>
                        Completed {formatDistanceToNow(new Date(cert.issuedAt), { addSuffix: true })}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {cert.certificateUrl ? (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={() => window.open(cert.certificateUrl!, '_blank')}
                            data-testid={`button-view-${cert.id}`}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = cert.certificateUrl!;
                              link.download = `certificate-${cert.certificateNumber}.pdf`;
                              link.click();
                            }}
                            data-testid={`button-download-${cert.id}`}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          disabled
                          data-testid={`button-generating-${cert.id}`}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Generating...
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
