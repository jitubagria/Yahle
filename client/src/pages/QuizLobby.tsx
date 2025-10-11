import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Users, Sparkles, Target, Award, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LobbyParticipant {
  userId: number;
  username: string;
}

interface Quiz {
  id: number;
  title: string;
  description?: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  type?: string;
  totalQuestions?: number;
  questionTime?: number;
  duration?: number;
  passingScore?: number;
  entryFee?: number;
  rewardInfo?: string;
  certificateType?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
}

interface User {
  id: number;
  name?: string;
  phoneNumber?: string;
  role?: string;
}

export default function QuizLobby() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [participants, setParticipants] = useState<LobbyParticipant[]>([]);
  const [timeUntilStart, setTimeUntilStart] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const { data: quiz, isLoading, isError, error } = useQuery<Quiz>({
    queryKey: [`/api/quizzes/${id}`],
    enabled: !!id,
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (error format: "404: message")
      if (error?.message?.startsWith('404:')) return false;
      return failureCount < 2;
    },
  });

  const { data: user } = useQuery<User>({
    queryKey: ['/api/auth/me'],
  });

  // Calculate time until quiz starts
  useEffect(() => {
    if (!quiz?.startTime) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const start = new Date(quiz.startTime!).getTime();
      const diff = start - now;

      if (diff <= 0) {
        setQuizStarted(true);
        return 0;
      }

      return Math.floor(diff / 1000); // seconds
    };

    setTimeUntilStart(calculateTimeLeft());

    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft();
      setTimeUntilStart(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz]);

  // WebSocket connection for real-time participant count
  useEffect(() => {
    if (!id || !user) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/quiz`);
    wsRef.current = ws;

    ws.onopen = () => {
      // Join the lobby
      ws.send(JSON.stringify({
        type: 'join',
        quizId: parseInt(id),
        userId: user.id,
        username: user.name || `User ${user.id}`,
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'participant_update':
          setParticipants(data.participants || []);
          break;
        case 'quiz_started':
          setQuizStarted(true);
          toast({
            title: 'Quiz Started!',
            description: 'Redirecting to quiz...',
          });
          setTimeout(() => {
            setLocation(`/quiz/${id}/play`);
          }, 1000);
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to quiz lobby',
        variant: 'destructive',
      });
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [id, user, toast, setLocation]);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return 'Starting...';
    
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-amber-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="animate-pulse w-full max-w-3xl">
          <CardContent className="p-12">
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-5/6" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    // Error format from queryClient: "STATUS_CODE: message"
    const is404 = (error as any)?.message?.startsWith('404:');
    
    if (is404) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold text-destructive">Quiz Not Found</h2>
              <p className="text-muted-foreground mt-2">The quiz you're looking for doesn't exist.</p>
              <Button className="mt-4" onClick={() => setLocation('/quizzes')} data-testid="button-back-to-quizzes">
                Back to Quizzes
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold text-destructive">Error Loading Quiz</h2>
            <p className="text-muted-foreground mt-2">Failed to load quiz details. Please try again.</p>
            <div className="flex gap-3 mt-4">
              <Button onClick={() => window.location.reload()} data-testid="button-retry">
                Retry
              </Button>
              <Button variant="outline" onClick={() => setLocation('/quizzes')} data-testid="button-back-to-quizzes">
                Back to Quizzes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz) {
    // This should not happen if isLoading and isError are handled above
    return null;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold">Login Required</h2>
            <p className="text-muted-foreground mt-2">Please login to join this quiz</p>
            <Button className="mt-4" onClick={() => setLocation('/login')} data-testid="button-login">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-amber-500/5 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <CardTitle className="text-3xl flex items-center gap-3" data-testid="text-quiz-title">
                    <Sparkles className="w-8 h-8 text-amber-500" />
                    {quiz.title}
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">{quiz.description}</CardDescription>
                </div>
                <Badge className="bg-red-500 text-white animate-pulse" data-testid="badge-live">
                  LIVE
                </Badge>
              </div>

              {/* Quiz details badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {quiz.difficulty && (
                  <Badge className={getDifficultyColor(quiz.difficulty)} data-testid="badge-difficulty">
                    {quiz.difficulty}
                  </Badge>
                )}
                {quiz.category && (
                  <Badge variant="secondary" data-testid="badge-category">
                    {quiz.category}
                  </Badge>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Countdown Timer */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <Clock className="w-8 h-8 text-primary" />
                  <h3 className="text-2xl font-bold">
                    {quizStarted ? 'Quiz Starting!' : 'Starts In'}
                  </h3>
                </div>
                <div className="text-6xl font-bold text-primary" data-testid="text-countdown">
                  {timeUntilStart !== null ? formatTime(timeUntilStart) : '--:--'}
                </div>
                {quiz.startTime && (
                  <p className="text-sm text-muted-foreground" data-testid="text-start-time">
                    Scheduled: {new Date(quiz.startTime).toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Participants
                <Badge variant="secondary" data-testid="badge-participant-count">
                  {participants.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {participants.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {participants.map((participant, idx) => (
                    <div
                      key={`${participant.userId}-${idx}`}
                      className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                      data-testid={`participant-${participant.userId}`}
                    >
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-semibold">
                        {participant.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm truncate">{participant.username}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Waiting for participants to join...
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quiz Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {quiz.totalQuestions && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Trophy className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">Total Questions</p>
                      <p className="text-sm text-muted-foreground" data-testid="text-total-questions">
                        {quiz.totalQuestions}
                      </p>
                    </div>
                  </div>
                )}

                {quiz.questionTime && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">Time Per Question</p>
                      <p className="text-sm text-muted-foreground" data-testid="text-question-time">
                        {quiz.questionTime} seconds
                      </p>
                    </div>
                  </div>
                )}

                {quiz.passingScore && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Target className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">Passing Score</p>
                      <p className="text-sm text-muted-foreground" data-testid="text-passing-score">
                        {quiz.passingScore}%
                      </p>
                    </div>
                  </div>
                )}

                {quiz.entryFee && quiz.entryFee > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Coins className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">Entry Fee</p>
                      <p className="text-sm text-muted-foreground" data-testid="text-entry-fee">
                        ₹{quiz.entryFee}
                      </p>
                    </div>
                  </div>
                )}

                {quiz.certificateType && (
                  <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <Award className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-semibold">Certificate</p>
                      <p className="text-sm text-amber-600" data-testid="text-certificate-type">
                        {quiz.certificateType}
                      </p>
                    </div>
                  </div>
                )}

                {quiz.rewardInfo && (
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <Trophy className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Rewards</p>
                      <p className="text-sm text-green-600" data-testid="text-reward-info">
                        {quiz.rewardInfo}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>The quiz will start automatically at the scheduled time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Questions will appear one at a time with a countdown timer</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Answer quickly - time is limited for each question</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Your score will be calculated based on correct answers and speed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Check the leaderboard after the quiz to see your rank</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
