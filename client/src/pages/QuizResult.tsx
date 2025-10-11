import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Medal, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock,
  Award,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuizSession {
  id: number;
  userId: number;
  quizId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: string;
  certificateIssued: boolean;
}

interface LeaderboardEntry {
  userId: number;
  username: string;
  score: number;
  rank: number;
}

interface QuizResponse {
  id: number;
  sessionId: number;
  questionId: number;
  answer: string;
  isCorrect: boolean;
  timeSpent: number;
  question: {
    questionText: string;
    correctAnswer: string;
    optionA: string;
    optionB: string;
    optionC?: string;
    optionD?: string;
  };
}

interface Quiz {
  id: number;
  title: string;
  type: string;
  certificateType?: string;
}

interface User {
  id: number;
  name?: string;
}

export default function QuizResult() {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: user } = useQuery<User>({
    queryKey: ['/api/auth/me'],
  });

  const { data: quiz, isLoading: quizLoading } = useQuery<Quiz>({
    queryKey: [`/api/quizzes/${id}`],
    enabled: !!id,
  });

  const { data: session, isLoading: sessionLoading } = useQuery<QuizSession>({
    queryKey: [`/api/quizzes/${id}/my-session`],
    enabled: !!id && !!user,
  });

  const { data: responses = [] } = useQuery<QuizResponse[]>({
    queryKey: [`/api/quizzes/${id}/responses`],
    enabled: !!id && !!session,
  });

  const { data: leaderboard = [] } = useQuery<LeaderboardEntry[]>({
    queryKey: [`/api/quizzes/${id}/leaderboard`],
    enabled: !!id,
  });

  const isLoading = quizLoading || sessionLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!session || !quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold">No Results Found</h2>
            <p className="text-muted-foreground">
              You haven't completed this quiz yet.
            </p>
            <Link href={`/quiz/${id}`}>
              <Button data-testid="button-take-quiz">Take Quiz</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userRank = leaderboard.find(entry => entry.userId === user?.id);
  const percentage = Math.round((session.correctAnswers / session.totalQuestions) * 100);
  const averageTimePerQuestion = Math.round(session.timeSpent / session.totalQuestions);

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-amber-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-700';
    return 'text-muted-foreground';
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-amber-500';
    if (rank === 2) return 'bg-gray-400';
    if (rank === 3) return 'bg-amber-700';
    return 'bg-muted-foreground/20';
  };

  const handleDownloadCertificate = () => {
    toast({
      title: 'Certificate Download',
      description: 'Certificate generation will be available soon',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-amber-500/5 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Back Button */}
          <Link href="/quizzes">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Quizzes
            </Button>
          </Link>

          {/* Results Header */}
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                    userRank ? getRankBadgeColor(userRank.rank) : 'bg-muted'
                  }`}>
                    {userRank && userRank.rank <= 3 ? (
                      <Trophy className="w-12 h-12 text-white" />
                    ) : (
                      <Medal className="w-12 h-12 text-white" />
                    )}
                  </div>
                  
                  <div>
                    <h1 className="text-3xl font-bold mb-2" data-testid="text-quiz-title">
                      {quiz.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {userRank && (
                        <span className={`font-semibold ${getRankColor(userRank.rank)}`} data-testid="text-user-rank">
                          Rank #{userRank.rank}
                        </span>
                      )}
                      <span data-testid="text-score">{session.score} points</span>
                      <span data-testid="text-percentage">{percentage}% correct</span>
                    </div>
                  </div>
                </div>

                {session.certificateIssued && quiz.certificateType && (
                  <Button 
                    onClick={handleDownloadCertificate}
                    size="lg"
                    data-testid="button-download-certificate"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between gap-2 mb-2">
                    <span className="text-sm">Accuracy</span>
                    <span className="text-sm font-semibold">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold" data-testid="text-correct-answers">
                      {session.correctAnswers}
                    </div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>

                  <div className="text-center p-4 bg-muted rounded-lg">
                    <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold" data-testid="text-wrong-answers">
                      {session.totalQuestions - session.correctAnswers}
                    </div>
                    <div className="text-sm text-muted-foreground">Wrong</div>
                  </div>

                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold" data-testid="text-time-spent">
                      {Math.floor(session.timeSpent / 60)}m {session.timeSpent % 60}s
                    </div>
                    <div className="text-sm text-muted-foreground">Total Time</div>
                  </div>

                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold" data-testid="text-avg-time">
                      {averageTimePerQuestion}s
                    </div>
                    <div className="text-sm text-muted-foreground">Avg/Question</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Leaderboard
                  <Badge variant="outline" className="ml-auto">Top 10</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.slice(0, 10).map((entry) => (
                    <div
                      key={entry.userId}
                      className={`flex items-center justify-between gap-3 p-3 rounded-lg ${
                        entry.userId === user?.id
                          ? 'bg-primary/10 border border-primary/20'
                          : 'bg-muted'
                      }`}
                      data-testid={`leaderboard-entry-${entry.userId}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          getRankBadgeColor(entry.rank)
                        } ${entry.rank <= 3 ? 'text-white' : ''}`}>
                          {entry.rank}
                        </div>
                        <span className="font-medium">{entry.username}</span>
                      </div>
                      <Badge variant="secondary">{entry.score} pts</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Responses */}
          {responses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Answer Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {responses.map((response, idx) => (
                  <div
                    key={response.id}
                    className="border rounded-lg p-4"
                    data-testid={`response-${response.id}`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Question {idx + 1}</Badge>
                          {response.isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <p className="font-medium">{response.question.questionText}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {response.timeSpent}s
                      </div>
                    </div>

                    <div className="space-y-2 mt-3">
                      <div className={`p-3 rounded-lg ${
                        response.answer === response.question.correctAnswer
                          ? 'bg-green-500/10 border border-green-500/20'
                          : 'bg-red-500/10 border border-red-500/20'
                      }`}>
                        <div className="text-sm text-muted-foreground mb-1">Your Answer</div>
                        <div className="font-medium">
                          {response.answer}. {response.question[`option${response.answer}` as keyof typeof response.question]}
                        </div>
                      </div>

                      {!response.isCorrect && (
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <div className="text-sm text-muted-foreground mb-1">Correct Answer</div>
                          <div className="font-medium">
                            {response.question.correctAnswer}. {response.question[`option${response.question.correctAnswer}` as keyof typeof response.question]}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Link href="/quizzes">
              <Button variant="outline" size="lg" data-testid="button-browse-quizzes">
                Browse More Quizzes
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="default" size="lg" data-testid="button-dashboard">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
