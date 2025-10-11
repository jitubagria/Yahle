import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Clock, Award, Target, Filter, Coins, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

interface Quiz {
  id: number;
  title: string;
  description: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  type?: 'free' | 'paid' | 'live' | 'practice';
  totalQuestions?: number;
  questionTime?: number;
  duration?: number;
  passingScore?: number;
  entryFee?: number;
  rewardInfo?: string;
  certificateType?: string;
  status?: string;
  timeLimit?: number;
  certificateTemplate?: string;
}

export default function Quizzes() {
  const { data: quizzes, isLoading } = useQuery<Quiz[]>({
    queryKey: ['/api/quizzes'],
  });

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Get unique categories from quizzes
  const categories = useMemo(() => {
    if (!quizzes) return [];
    const cats = new Set(quizzes.map(q => q.category).filter(Boolean));
    return Array.from(cats);
  }, [quizzes]);

  // Filter quizzes based on selected filters
  const filteredQuizzes = useMemo(() => {
    if (!quizzes) return [];
    
    return quizzes.filter(quiz => {
      if (typeFilter !== 'all' && quiz.type !== typeFilter) return false;
      if (difficultyFilter !== 'all' && quiz.difficulty !== difficultyFilter) return false;
      if (categoryFilter !== 'all' && quiz.category !== categoryFilter) return false;
      return true;
    });
  }, [quizzes, typeFilter, difficultyFilter, categoryFilter]);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-amber-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'live': return <Sparkles className="w-3 h-3" />;
      case 'paid': return <Coins className="w-3 h-3" />;
      default: return null;
    }
  };

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
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5" />
              Filter Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger data-testid="select-quiz-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" data-testid="option-type-all">All Types</SelectItem>
                    <SelectItem value="free" data-testid="option-type-free">Free</SelectItem>
                    <SelectItem value="paid" data-testid="option-type-paid">Paid</SelectItem>
                    <SelectItem value="live" data-testid="option-type-live">Live</SelectItem>
                    <SelectItem value="practice" data-testid="option-type-practice">Practice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger data-testid="select-quiz-difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" data-testid="option-difficulty-all">All Levels</SelectItem>
                    <SelectItem value="beginner" data-testid="option-difficulty-beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate" data-testid="option-difficulty-intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced" data-testid="option-difficulty-advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger data-testid="select-quiz-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" data-testid="option-category-all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat as string} data-testid={`option-category-${cat}`}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

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
        ) : filteredQuizzes && filteredQuizzes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-all hover-elevate" data-testid={`card-quiz-${quiz.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="flex-1" data-testid={`text-quiz-title-${quiz.id}`}>{quiz.title}</CardTitle>
                    <div className="flex flex-col gap-1">
                      {quiz.status === 'active' && (
                        <Badge className="bg-green-500" data-testid={`badge-status-${quiz.id}`}>Active</Badge>
                      )}
                      {quiz.type && (
                        <Badge variant="outline" className="gap-1" data-testid={`badge-type-${quiz.id}`}>
                          {getTypeIcon(quiz.type)}
                          {quiz.type}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription>{quiz.description}</CardDescription>
                  {quiz.category && (
                    <Badge variant="secondary" className="w-fit mt-2" data-testid={`badge-category-${quiz.id}`}>
                      {quiz.category}
                    </Badge>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {quiz.difficulty && (
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(quiz.difficulty)} data-testid={`badge-difficulty-${quiz.id}`}>
                          {quiz.difficulty}
                        </Badge>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {(quiz.duration || quiz.questionTime) && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span data-testid={`text-duration-${quiz.id}`}>
                            {quiz.duration ? `${quiz.duration} min total` : `${quiz.questionTime}s per question`}
                          </span>
                        </div>
                      )}
                      {quiz.passingScore && (
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="w-4 h-4 text-muted-foreground" />
                          <span data-testid={`text-passing-score-${quiz.id}`}>Pass at {quiz.passingScore}%</span>
                        </div>
                      )}
                      {quiz.certificateType && (
                        <div className="flex items-center gap-2 text-sm text-amber-600">
                          <Award className="w-4 h-4" />
                          <span data-testid={`text-certificate-type-${quiz.id}`}>{quiz.certificateType} Certificate</span>
                        </div>
                      )}
                      {quiz.entryFee && quiz.entryFee > 0 && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Coins className="w-4 h-4" />
                          <span data-testid={`text-entry-fee-${quiz.id}`}>₹{quiz.entryFee}</span>
                        </div>
                      )}
                      {quiz.rewardInfo && (
                        <div className="text-sm text-green-600 font-medium" data-testid={`text-reward-info-${quiz.id}`}>
                          {quiz.rewardInfo}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Link href={quiz.type === 'live' ? `/quiz/${quiz.id}/lobby` : `/quiz/${quiz.id}`} className="w-full">
                    <Button className="w-full" data-testid={`button-start-quiz-${quiz.id}`}>
                      {quiz.type === 'live' ? 'Join Lobby' : 'Start Quiz'}
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
            <h3 className="text-xl font-semibold mb-2">No quizzes match your filters</h3>
            <p className="text-muted-foreground">Try adjusting your filter criteria</p>
          </div>
        )}

        {/* Leaderboard Teaser */}
        {filteredQuizzes && filteredQuizzes.length > 0 && (
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
