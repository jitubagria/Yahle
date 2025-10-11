import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Award, Target } from 'lucide-react';
import { Link } from 'wouter';

export default function Quizzes() {
  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['/api/quizzes'],
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-amber-500/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Medical Quizzes</h1>
              <p className="text-xl text-muted-foreground mt-2">
                Test your knowledge, compete with peers, and earn certificates
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                  <div className="h-10 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : quizzes && quizzes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz: any) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-all hover-elevate" data-testid={`card-quiz-${quiz.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="flex-1" data-testid={`text-quiz-title-${quiz.id}`}>{quiz.title}</CardTitle>
                    {quiz.status === 'active' && (
                      <Badge className="bg-green-500">Active</Badge>
                    )}
                  </div>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {quiz.timeLimit && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{quiz.timeLimit} minutes</span>
                      </div>
                    )}
                    {quiz.passingScore && (
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span>Pass at {quiz.passingScore}%</span>
                      </div>
                    )}
                    {quiz.certificateTemplate && (
                      <div className="flex items-center gap-2 text-sm text-amber-600">
                        <Award className="w-4 h-4" />
                        <span>Certificate Available</span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <Link href={`/quiz/${quiz.id}`} className="w-full">
                    <Button className="w-full" data-testid={`button-start-quiz-${quiz.id}`}>
                      Start Quiz
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Trophy className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No quizzes available</h3>
            <p className="text-muted-foreground">Check back soon for new quizzes!</p>
          </div>
        )}

        {/* Leaderboard Teaser */}
        {quizzes && quizzes.length > 0 && (
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Top Performers
                </CardTitle>
                <CardDescription>Check out the leaderboard after taking a quiz</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Complete quizzes to see your ranking and compete with other medical professionals
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
