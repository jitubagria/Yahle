import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, ArrowLeft, GripVertical, Video, FileText, File, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { CourseModule, Course } from '@shared/schema';
import { ModuleForm, ModuleDeleteDialog } from '@/components/admin';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminCourseModules() {
  const [, params] = useRoute('/admin/courses/:courseId/modules');
  const courseId = params?.courseId ? parseInt(params.courseId) : null;

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [deletingModule, setDeletingModule] = useState<CourseModule | null>(null);

  const { data: course, isLoading: courseLoading, isError: courseError, error: courseErrorObj } = useQuery<Course>({
    queryKey: ['/api/courses', courseId],
    enabled: !!courseId,
  });

  const { data: modules = [], isLoading: modulesLoading, isError: modulesError, error: modulesErrorObj, refetch } = useQuery<CourseModule[]>({
    queryKey: ['/api/courses', courseId, 'modules'],
    enabled: !!courseId,
  });

  if (!courseId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Invalid Course</AlertTitle>
          <AlertDescription>Course ID is missing or invalid.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'pdf': return <File className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      case 'quiz': return <HelpCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getContentBadgeVariant = (type: string): "default" | "secondary" | "outline" => {
    switch (type) {
      case 'video': return 'default';
      case 'quiz': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/courses">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-1">
            {courseLoading ? 'Loading...' : course?.title || 'Course Modules'}
          </h1>
          <p className="text-muted-foreground">Manage modules and lessons for this course</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} data-testid="button-create-module">
          <Plus className="w-4 h-4 mr-2" />
          Add Module
        </Button>
      </div>

      {/* Error State for Course */}
      {courseError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Course</AlertTitle>
          <AlertDescription>
            {courseErrorObj instanceof Error ? courseErrorObj.message : 'Failed to fetch course details.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Modules List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Course Modules ({modules.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {modulesLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading modules...</div>
          ) : modulesError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Modules</AlertTitle>
              <AlertDescription>
                {modulesErrorObj instanceof Error ? modulesErrorObj.message : 'Failed to fetch modules. Please try again.'}
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
          ) : modules.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No modules added yet</p>
              <Button onClick={() => setShowCreateForm(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Module
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {modules
                .sort((a, b) => a.orderNo - b.orderNo)
                .map((module) => (
                  <div
                    key={module.id}
                    className="flex items-center gap-3 p-4 rounded-lg border hover-elevate"
                    data-testid={`row-module-${module.id}`}
                  >
                    <div className="cursor-move text-muted-foreground">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground w-8">
                        #{module.orderNo}
                      </span>
                      {getContentIcon(module.contentType)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{module.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getContentBadgeVariant(module.contentType)}>
                          {module.contentType.toUpperCase()}
                        </Badge>
                        {module.duration && (
                          <span className="text-sm text-muted-foreground">{module.duration} min</span>
                        )}
                        {module.isPreview && (
                          <Badge variant="outline">Preview</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingModule(module)}
                        data-testid={`button-edit-${module.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingModule(module)}
                        data-testid={`button-delete-${module.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Module Form Dialog */}
      {(showCreateForm || editingModule) && (
        <ModuleForm
          courseId={courseId}
          module={editingModule || undefined}
          onClose={() => {
            setShowCreateForm(false);
            setEditingModule(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingModule && (
        <ModuleDeleteDialog
          courseId={courseId}
          module={deletingModule}
          onClose={() => setDeletingModule(null)}
        />
      )}
    </div>
  );
}
