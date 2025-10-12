import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { getAuthenticatedUser } from '@/lib/auth';

type QuizPhase = 'start' | 'question' | 'leaderboard' | 'completed';

export default function QuizTake() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [phase, setPhase] = useState<QuizPhase>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ['/api/quizzes', id],
  });

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: [`/api/quiz-questions?quizId=${id}`],
    enabled: phase !== 'start' && !!id,
  });

  const { data: leaderboard } = useQuery({
    queryKey: ['/api/quizzes', id, 'leaderboard'],
    enabled: phase === 'leaderboard',
    refetchInterval: phase === 'leaderboard' ? 2000 : false,
  });

  // Submit individual answer
  const submitAnswerMutation = useMutation({
    mutationFn: async (data: { questionId: number; selectedOption: string }) => {
      return apiRequest('POST', `/api/quizzes/${id}/responses`, {
        questionId: data.questionId,
        selectedOption: data.selectedOption,
        responseTime: (quiz as any)?.questionTime - timeLeft,
      });
    },
  });

  // Submit final quiz
  const submitQuizMutation = useMutation({
    mutationFn: async (data: { score: number; totalQuestions: number }) => {
      return apiRequest('POST', `/api/quizzes/${id}/submit`, {
        score: data.score,
        totalQuestions: data.totalQuestions,
      });
    },
    onSuccess: (result: any) => {
      setFinalScore(result.score);
      setPhase('completed');
      queryClient.invalidateQueries({ queryKey: ['/api/quizzes', id, 'leaderboard'] });
    },
  });

  // Join quiz mutation
  const joinQuizMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/quizzes/${id}/join`, {});
    },
    onSuccess: () => {
      setPhase('question');
      setTimeLeft((quiz as any)?.questionTime || 10);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to join quiz',
        variant: 'destructive',
      });
    },
  });

  // Timer countdown for each question
  useEffect(() => {
    if (phase === 'question' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [phase, timeLeft, currentQuestionIndex]);

  // Auto-advance from leaderboard to next question
  useEffect(() => {
    if (phase === 'leaderboard') {
      const timer = setTimeout(() => {
        const questionsArr = (questions as any[]) || [];
        const quizObj = quiz as any;
        if (currentQuestionIndex < questionsArr.length - 1) {
          // Move to next question
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedAnswer('');
          setPhase('question');
          setTimeLeft(quizObj?.questionTime || 10);
        } else {
          // Quiz complete - calculate final score
          handleQuizComplete();
        }
      }, 5000); // Show leaderboard for 5 seconds

      return () => clearTimeout(timer);
    }
  }, [phase, currentQuestionIndex, questions, quiz]);

  const handleTimeExpired = async () => {
    const questionsArr = (questions as any[]) || [];
    const currentQuestion = questionsArr[currentQuestionIndex];
    if (!currentQuestion) return;

    // Submit answer (or empty if not answered)
    if (selectedAnswer) {
      await submitAnswerMutation.mutateAsync({
        questionId: currentQuestion.id,
        selectedOption: selectedAnswer,
      });
      
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedAnswer,
      }));
    }

    // Show leaderboard
    queryClient.invalidateQueries({ queryKey: ['/api/quizzes', id, 'leaderboard'] });
    setPhase('leaderboard');
  };

  const handleQuizComplete = () => {
    const questionsArr = (questions as any[]) || [];
    if (questionsArr.length === 0) return;

    // Calculate score
    let correctCount = 0;
    questionsArr.forEach((question: any) => {
      if (userAnswers[question.id] === question.correctOption) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / questionsArr.length) * 100);
    
    submitQuizMutation.mutate({
      score: scorePercentage,
      totalQuestions: questionsArr.length,
    });
  };

  const handleStartQuiz = () => {
    const user = getAuthenticatedUser();
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to take quizzes',
        variant: 'destructive',
      });
      setLocation('/login');
      return;
    }
    joinQuizMutation.mutate();
  };

  const handleAnswerSelect = (option: string) => {
    setSelectedAnswer(option);
  };

  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  const questionsArray = (questions as any[]) || [];
  const currentQuestion = questionsArray[currentQuestionIndex];
  const totalQuestions = questionsArray.length || 0;
  const quizData = quiz as any;

  if (quizLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="animate-pulse">
          <CardContent className="p-12">
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold text-destructive">Quiz Not Found</h2>
            <p className="text-muted-foreground mt-2">The quiz you're looking for doesn't exist.</p>
            <Button className="mt-4" onClick={() => setLocation('/quizzes')}>Back to Quizzes</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Start screen
  if (phase === 'start') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl" data-testid="text-quiz-title">{quizData?.title}</CardTitle>
            <CardDescription className="text-lg">{quizData?.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Clock className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold">Time per Question</p>
                  <p className="text-sm text-muted-foreground">{quizData?.questionTime || 10} seconds</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Trophy className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold">Total Questions</p>
                  <p className="text-sm text-muted-foreground">{quizData?.totalQuestions || 10}</p>
                </div>
              </div>
            </div>

            {quizData?.certificateType && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-600" />
                  <div>
                    <p className="font-semibold">Certificate Available</p>
                    <p className="text-sm text-muted-foreground">
                      Complete this quiz to earn a certificate
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-2">How it Works</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Each question appears with a countdown timer</li>
                <li>• Select your answer before time runs out</li>
                <li>• After each question, see the live leaderboard</li>
                <li>• Next question loads automatically</li>
                <li>• Compete with other participants in real-time!</li>
              </ul>
            </div>

            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleStartQuiz}
              disabled={joinQuizMutation.isPending}
              data-testid="button-start-quiz"
            >
              {joinQuizMutation.isPending ? 'Joining...' : 'Join Quiz'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Question phase
  if (phase === 'question' && currentQuestion) {
    const options = JSON.parse(currentQuestion.options || '{}');
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Timer and Progress */}
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              timeLeft <= 5 ? 'bg-red-500/20 text-red-600' : 'bg-primary/20 text-primary'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="text-2xl font-bold font-mono">
                {timeLeft}
              </span>
            </div>
          </div>

          {/* Question Card */}
          <Card className="border-2">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl leading-relaxed" data-testid="text-question">
                {currentQuestion.questionText}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid gap-3">
                {['A', 'B', 'C', 'D'].map((option) => {
                  const optionText = options[option];
                  if (!optionText) return null;
                  
                  const isSelected = selectedAnswer === option;
                  
                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={timeLeft === 0}
                      className={`
                        relative p-6 rounded-lg border-2 text-left transition-all
                        ${isSelected 
                          ? 'border-primary bg-primary/10 shadow-lg scale-[1.02]' 
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }
                        ${timeLeft === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover-elevate active-elevate-2'}
                      `}
                      data-testid={`button-option-${option}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`
                          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                          ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                        `}>
                          {option}
                        </div>
                        <div className="flex-1 pt-1.5">
                          <p className="text-base font-medium">{optionText}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {selectedAnswer && (
            <div className="text-center text-sm text-muted-foreground">
              Answer selected: <span className="font-bold text-foreground">{selectedAnswer}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Leaderboard phase
  if (phase === 'leaderboard') {
    const leaderboardData = (leaderboard as any[]) || [];
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="border-2 border-primary">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                <Trophy className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Live Rankings</CardTitle>
              <CardDescription>See how you compare with others</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                {leaderboardData.length > 0 ? (
                  leaderboardData.slice(0, 10).map((entry: any, index: number) => {
                    const user = getAuthenticatedUser();
                    const isCurrentUser = user?.id === entry.userId;
                    
                    return (
                      <div
                        key={entry.userId}
                        className={`
                          flex items-center justify-between p-4 rounded-lg
                          ${isCurrentUser ? 'bg-primary/10 border-2 border-primary' : 'bg-muted'}
                        `}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center font-bold
                            ${index === 0 ? 'bg-yellow-500 text-white' : 
                              index === 1 ? 'bg-gray-400 text-white' :
                              index === 2 ? 'bg-orange-600 text-white' :
                              'bg-muted-foreground/20 text-muted-foreground'}
                          `}>
                            {entry.rank || index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">
                              {isCurrentUser ? 'You' : `User ${entry.userId}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">{entry.totalScore || 0}</p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Loading rankings...
                  </p>
                )}
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {currentQuestionIndex < totalQuestions - 1 
                    ? 'Next question loading...' 
                    : 'Calculating final results...'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Completed phase
  if (phase === 'completed' && finalScore !== null) {
    const passed = quizData?.passingScore ? finalScore >= quizData.passingScore : finalScore >= 70;
    
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Trophy className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
            <CardDescription className="text-lg mt-2">
              You scored {finalScore}% on {quizData?.title}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary">{finalScore}%</div>
              {quizData?.passingScore && (
                <p className="text-sm text-muted-foreground mt-2">
                  {passed ? '✓ Passed' : '✗ Did not pass'} (Required: {quizData.passingScore}%)
                </p>
              )}
            </div>

            {passed && quizData?.certificateType && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-amber-600" />
                  <div>
                    <p className="font-semibold">Certificate Earned!</p>
                    <p className="text-sm text-muted-foreground">
                      Check your dashboard for your certificate
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => setLocation(`/quizzes/${id}/leaderboard`)}
                data-testid="button-view-leaderboard"
              >
                View Final Leaderboard
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setLocation('/quizzes')}
                data-testid="button-back-to-quizzes"
              >
                Back to Quizzes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    </div>
  );
}
