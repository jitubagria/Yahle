import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, CheckCircle, XCircle, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { getAuthenticatedUser } from '@/lib/auth';

export default function QuizTake() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ['/api/quizzes', id],
  });

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: [`/api/quiz-questions?quizId=${id}`],
    enabled: started && !!id,
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (data: { 
      quizId: number; 
      userId: number;
      score: number;
      totalQuestions: number;
      timeTaken?: number;
    }) => {
      const response = await fetch(`/api/quizzes/${data.quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: data.userId,
          score: data.score,
          totalQuestions: data.totalQuestions,
          timeTaken: data.timeTaken,
        }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }
      
      return response.json();
    },
    onSuccess: (result) => {
      setScore(result.score);
      setQuizCompleted(true);
      queryClient.invalidateQueries({ queryKey: ['/api/quiz-attempts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/quizzes', id, 'leaderboard'] });
      toast({
        title: 'Quiz Submitted!',
        description: `You scored ${result.score}%`,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to submit quiz. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Timer countdown
  useEffect(() => {
    if (started && quiz?.timeLimit && timeRemaining === null) {
      setTimeRemaining(quiz.timeLimit * 60); // Convert minutes to seconds
    }

    if (timeRemaining !== null && timeRemaining > 0 && started && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev !== null && prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [started, timeRemaining, quizCompleted, quiz]);

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
    setStarted(true);
    setStartTime(Date.now());
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuiz = () => {
    if (!id || !questions) return;
    
    const user = getAuthenticatedUser();
    if (!user || !user.id) {
      toast({
        title: 'Error',
        description: 'User session not found. Please login again.',
        variant: 'destructive',
      });
      return;
    }

    // Calculate score
    let correctCount = 0;
    questions.forEach((question: any) => {
      if (answers[question.id] === question.correctOption) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : undefined;

    submitQuizMutation.mutate({
      quizId: parseInt(id),
      userId: user.id,
      score: scorePercentage,
      totalQuestions: questions.length,
      timeTaken,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions?.[currentQuestionIndex];
  const totalQuestions = questions?.length || 0;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  if (quizLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="animate-pulse">
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

  // Quiz completion/results screen
  if (quizCompleted && score !== null) {
    const passed = quiz.passingScore ? score >= quiz.passingScore : score >= 70;
    
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
              passed ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {passed ? (
                <CheckCircle className="w-12 h-12 text-green-600" />
              ) : (
                <XCircle className="w-12 h-12 text-red-600" />
              )}
            </div>
            <CardTitle className="text-3xl">
              {passed ? 'Congratulations!' : 'Quiz Complete'}
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              You scored {score}% on {quiz.title}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary">{score}%</div>
              {quiz.passingScore && (
                <p className="text-sm text-muted-foreground mt-2">
                  Passing score: {quiz.passingScore}%
                </p>
              )}
            </div>

            {passed && quiz.certificateTemplate && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-amber-600" />
                  <div>
                    <p className="font-semibold">Certificate Available!</p>
                    <p className="text-sm text-muted-foreground">
                      You've earned a certificate for completing this quiz
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button className="w-full" onClick={() => setLocation('/quizzes')} data-testid="button-back-to-quizzes">
                Back to Quizzes
              </Button>
              <Button variant="outline" className="w-full" onClick={() => window.location.reload()} data-testid="button-retake-quiz">
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz start screen
  if (!started) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl" data-testid="text-quiz-title">{quiz.title}</CardTitle>
            <CardDescription className="text-lg">{quiz.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {quiz.timeLimit && (
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Clock className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold">Time Limit</p>
                    <p className="text-sm text-muted-foreground">{quiz.timeLimit} minutes</p>
                  </div>
                </div>
              )}
              
              {quiz.passingScore && (
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Trophy className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold">Passing Score</p>
                    <p className="text-sm text-muted-foreground">{quiz.passingScore}%</p>
                  </div>
                </div>
              )}
            </div>

            {quiz.certificateTemplate && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-600" />
                  <div>
                    <p className="font-semibold">Certificate Available</p>
                    <p className="text-sm text-muted-foreground">
                      Pass this quiz to earn a certificate
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-2">Instructions</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Answer all questions to the best of your ability</li>
                <li>• You can review your answers before submitting</li>
                {quiz.timeLimit && <li>• The quiz will auto-submit when time runs out</li>}
                <li>• Your score will be shown immediately after submission</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter>
            <Button className="w-full" size="lg" onClick={handleStartQuiz} data-testid="button-start-quiz">
              Start Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Quiz taking screen
  if (questionsLoading || !questions || questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Loading questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Timer and Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>
              {timeRemaining !== null && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-mono font-semibold">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card data-testid={`card-question-${currentQuestion.id}`}>
          <CardHeader>
            <CardTitle className="text-xl" data-testid="text-question">
              {currentQuestion.questionText}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
            >
              <div className="space-y-3">
                {['A', 'B', 'C', 'D'].map((option) => {
                  const optionKey = `option${option}` as keyof typeof currentQuestion;
                  const optionText = currentQuestion[optionKey];
                  
                  if (!optionText) return null;
                  
                  return (
                    <div
                      key={option}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                        answers[currentQuestion.id] === option
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                    >
                      <RadioGroupItem value={option} id={`option-${option}`} data-testid={`radio-option-${option}`} />
                      <Label
                        htmlFor={`option-${option}`}
                        className="flex-1 cursor-pointer font-medium"
                      >
                        {option}. {optionText}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </CardContent>

          <CardFooter className="flex justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              data-testid="button-previous-question"
            >
              Previous
            </Button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <Button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                data-testid="button-next-question"
              >
                Next Question
              </Button>
            ) : (
              <Button
                onClick={handleSubmitQuiz}
                disabled={submitQuizMutation.isPending}
                data-testid="button-submit-quiz"
              >
                {submitQuizMutation.isPending ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Answer Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Answer Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {questions.map((q: any, idx: number) => (
                <Button
                  key={q.id}
                  variant={currentQuestionIndex === idx ? 'default' : answers[q.id] ? 'secondary' : 'outline'}
                  size="sm"
                  className="w-10 h-10 p-0"
                  onClick={() => setCurrentQuestionIndex(idx)}
                  data-testid={`button-question-${idx + 1}`}
                >
                  {idx + 1}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Answered: {Object.keys(answers).length} / {totalQuestions}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
