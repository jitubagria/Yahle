import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, Users, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  questionText: string;
  image?: string;
  optionA: string;
  optionB: string;
  optionC?: string;
  optionD?: string;
  timeLimit: number; // seconds for this question
}

interface LeaderboardEntry {
  userId: number;
  username: string;
  score: number;
  rank: number;
}

interface User {
  id: number;
  name?: string;
}

export default function QuizPlay() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [quizEnded, setQuizEnded] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: user } = useQuery<User>({
    queryKey: ['/api/auth/me'],
  });

  // WebSocket connection for real-time quiz
  useEffect(() => {
    if (!id || !user) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/quiz`);
    wsRef.current = ws;

    ws.onopen = () => {
      // Join the quiz
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
          setParticipantCount(data.participants?.length || 0);
          break;

        case 'quiz_started':
          toast({
            title: 'Quiz Started!',
            description: 'Get ready for the first question',
          });
          break;

        case 'question':
          // New question received
          setCurrentQuestion(data.question);
          setQuestionNumber(data.questionNumber);
          setTotalQuestions(data.totalQuestions);
          setTimeRemaining(data.question.timeLimit);
          setSelectedAnswer('');
          setHasAnswered(false);
          break;

        case 'leaderboard_update':
          setLeaderboard(data.leaderboard || []);
          break;

        case 'quiz_ended':
          setQuizEnded(true);
          setCurrentQuestion(null);
          toast({
            title: 'Quiz Ended!',
            description: 'Check the final leaderboard',
          });
          // Redirect to results page after a delay
          setTimeout(() => {
            setLocation(`/quiz/${id}/result`);
          }, 3000);
          break;

        case 'timer_update':
          setTimeRemaining(data.timeRemaining);
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: 'Connection Error',
        description: 'Lost connection to quiz server',
        variant: 'destructive',
      });
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [id, user, toast, setLocation]);

  // Local timer countdown (syncs with server timer_update events)
  useEffect(() => {
    if (timeRemaining > 0 && currentQuestion && !hasAnswered) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time's up - auto-submit no answer
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [timeRemaining, currentQuestion, hasAnswered]);

  const handleAnswerSelect = (answer: string) => {
    if (hasAnswered || timeRemaining === 0) return;
    
    setSelectedAnswer(answer);
    setHasAnswered(true);

    // Submit answer via WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'submit_answer',
        quizId: parseInt(id!),
        userId: user!.id,
        questionId: currentQuestion!.id,
        answer,
        timeSpent: currentQuestion!.timeLimit - timeRemaining,
      }));

      toast({
        title: 'Answer Submitted!',
        description: 'Waiting for next question...',
      });
    }
  };

  const progress = totalQuestions > 0 ? (questionNumber / totalQuestions) * 100 : 0;

  // Waiting for quiz to start
  if (!currentQuestion && !quizEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-amber-500/5 to-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                <Zap className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Connected to Quiz</h2>
              <p className="text-muted-foreground">
                Waiting for the admin to start the quiz and broadcast questions...
              </p>
              <div className="flex items-center justify-center gap-2 text-sm">
                <Users className="w-4 h-4" />
                <span data-testid="text-participant-count">{participantCount} participants</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Quiz ended - show final leaderboard
  if (quizEnded) {
    const userRank = leaderboard.find(entry => entry.userId === user?.id);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-500/10 via-primary/5 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-2 border-amber-500/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                  <Trophy className="w-10 h-10 text-amber-600" />
                </div>
                <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
                {userRank && (
                  <p className="text-lg text-muted-foreground mt-2">
                    Your Rank: #{userRank.rank} | Score: {userRank.score} points
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Redirecting to detailed results...
                </p>
              </CardContent>
            </Card>

            {/* Final Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Final Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.slice(0, 10).map((entry, idx) => (
                    <div
                      key={entry.userId}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        entry.userId === user?.id
                          ? 'bg-primary/10 border border-primary/20'
                          : 'bg-muted'
                      }`}
                      data-testid={`leaderboard-entry-${entry.userId}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          idx === 0 ? 'bg-amber-500 text-white' :
                          idx === 1 ? 'bg-gray-400 text-white' :
                          idx === 2 ? 'bg-amber-700 text-white' :
                          'bg-muted-foreground/20'
                        }`}>
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
        </div>
      </div>
    );
  }

  // Active question display
  if (!currentQuestion) return null;

  const options = [
    { key: 'A', text: currentQuestion.optionA },
    { key: 'B', text: currentQuestion.optionB },
    currentQuestion.optionC ? { key: 'C', text: currentQuestion.optionC } : null,
    currentQuestion.optionD ? { key: 'D', text: currentQuestion.optionD } : null,
  ].filter(Boolean) as { key: string; text: string }[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-amber-500/5 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header with timer and progress */}
          <Card className="border-2 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" data-testid="text-question-number">
                    Question {questionNumber}/{totalQuestions}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    <span data-testid="text-live-participant-count">{participantCount}</span>
                  </div>
                </div>
                
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  timeRemaining <= 5 ? 'bg-red-500/20 text-red-600 animate-pulse' : 'bg-primary/10'
                }`}>
                  <Clock className="w-5 h-5" />
                  <span className="text-2xl font-bold font-mono" data-testid="text-timer">
                    {timeRemaining}s
                  </span>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Question */}
          <Card className="border-2 border-primary/10" data-testid={`card-question-${currentQuestion.id}`}>
            <CardHeader>
              <CardTitle className="text-2xl" data-testid="text-question-text">
                {currentQuestion.questionText}
              </CardTitle>
            </CardHeader>

            {currentQuestion.image && (
              <CardContent className="pt-0">
                <img 
                  src={currentQuestion.image} 
                  alt="Question" 
                  className="w-full max-h-64 object-contain rounded-lg"
                  data-testid="img-question"
                />
              </CardContent>
            )}

            <CardContent className="space-y-3">
              {options.map((option) => (
                <Button
                  key={option.key}
                  variant={selectedAnswer === option.key ? 'default' : 'outline'}
                  size="lg"
                  className={`w-full justify-start text-left ${
                    hasAnswered && selectedAnswer === option.key ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleAnswerSelect(option.key)}
                  disabled={hasAnswered || timeRemaining === 0}
                  data-testid={`button-option-${option.key}`}
                >
                  <span className="font-bold mr-3">{option.key}.</span>
                  <span className="flex-1">{option.text}</span>
                </Button>
              ))}
              
              {hasAnswered && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Answer submitted! Waiting for next question...
                </p>
              )}
            </CardContent>
          </Card>

          {/* Live Leaderboard */}
          {leaderboard.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Live Leaderboard
                  <Badge variant="outline" className="ml-auto">Top 5</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.slice(0, 5).map((entry) => (
                    <div
                      key={entry.userId}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        entry.userId === user?.id
                          ? 'bg-primary/10 border border-primary/20'
                          : 'bg-muted'
                      }`}
                      data-testid={`live-leaderboard-${entry.userId}`}
                    >
                      <div className="flex items-center gap-2">
                        <Badge className="w-6 h-6 flex items-center justify-center p-0">
                          {entry.rank}
                        </Badge>
                        <span className="text-sm font-medium">{entry.username}</span>
                      </div>
                      <span className="text-sm font-semibold">{entry.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
