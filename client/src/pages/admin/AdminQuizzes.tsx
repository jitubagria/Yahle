import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Brain, AlertCircle, RefreshCw, Trophy, Users, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';

type Quiz = {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | null;
  type: 'free' | 'paid' | 'live' | 'practice' | null;
  totalQuestions: number | null;
  questionTime: number | null;
  duration: number | null;
  passingScore: number | null;
  entryFee: number | null;
  rewardInfo: string | null;
  certificateType: string | null;
  startTime: Date | null;
  endTime: Date | null;
  status: 'draft' | 'active' | 'completed' | 'archived' | null;
};

export default function AdminQuizzes() {
  const { data: quizzes = [], isLoading, isError, error, refetch } = useQuery<Quiz[]>({
    queryKey: ['/api/quizzes'],
  });

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case 'beginner': return 'default';
      case 'intermediate': return 'secondary';
      case 'advanced': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: string | null) => {
    switch (type) {
      case 'free': return 'secondary';
      case 'paid': return 'default';
      case 'live': return 'destructive';
      case 'practice': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quizzes Management</h1>
          <p className="text-muted-foreground">Create and manage quizzes and competitions</p>
        </div>
        <Button data-testid="button-create-quiz">
          <Plus className="w-4 h-4 mr-2" />
          Create Quiz
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            All Quizzes ({quizzes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading quizzes...</div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Quizzes</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : 'Failed to fetch quizzes. Please try again.'}
              </AlertDescription>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-4"
                data-testid="button-retry-fetch"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </Alert>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No quizzes created yet</p>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Quiz
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Title</th>
                    <th className="text-left py-3 px-4 font-semibold">Category</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Difficulty</th>
                    <th className="text-left py-3 px-4 font-semibold">Questions</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr key={quiz.id} className="border-b hover-elevate" data-testid={`row-quiz-${quiz.id}`}>
                      <td className="py-3 px-4">
                        <div className="font-medium">{quiz.title}</div>
                        {quiz.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {quiz.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {quiz.category || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getTypeColor(quiz.type)}>
                          {quiz.type || 'free'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getDifficultyColor(quiz.difficulty)}>
                          {quiz.difficulty || 'beginner'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {quiz.totalQuestions || 0}
                      </td>
                      <td className="py-3 px-4">
                        {quiz.status === 'active' ? (
                          <Badge variant="default">Active</Badge>
                        ) : quiz.status === 'draft' ? (
                          <Badge variant="secondary">Draft</Badge>
                        ) : quiz.status === 'completed' ? (
                          <Badge variant="outline">Completed</Badge>
                        ) : (
                          <Badge variant="secondary">Archived</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-questions-${quiz.id}`}
                          >
                            Questions
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-edit-${quiz.id}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-delete-${quiz.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
