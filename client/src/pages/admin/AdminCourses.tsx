import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { Course } from '@shared/schema';
import { CourseForm, CourseDeleteDialog } from '@/components/admin';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminCourses() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

  const { data: courses = [], isLoading, isError, error, refetch } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Courses Management</h1>
          <p className="text-muted-foreground">Create and manage learning courses</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} data-testid="button-create-course">
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            All Courses ({courses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading courses...</div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Courses</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : 'Failed to fetch courses. Please try again.'}
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
          ) : courses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No courses created yet</p>
              <Button onClick={() => setShowCreateForm(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Course
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Title</th>
                    <th className="text-left py-3 px-4 font-semibold">Instructor</th>
                    <th className="text-left py-3 px-4 font-semibold">Duration</th>
                    <th className="text-left py-3 px-4 font-semibold">Price</th>
                    <th className="text-left py-3 px-4 font-semibold">Enrollments</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-b hover-elevate" data-testid={`row-course-${course.id}`}>
                      <td className="py-3 px-4">
                        <div className="font-medium">{course.title}</div>
                        {course.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {course.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{course.instructor || '-'}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {course.duration ? `${course.duration} hrs` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {course.price === 0 ? (
                          <Badge variant="secondary">Free</Badge>
                        ) : (
                          <span className="font-medium">₹{course.price}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{course.enrollmentCount || 0}</td>
                      <td className="py-3 px-4">
                        {course.isActive ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/courses/${course.id}/modules`}>
                            <Button
                              variant="outline"
                              size="sm"
                              data-testid={`button-modules-${course.id}`}
                            >
                              <BookOpen className="w-4 h-4 mr-1" />
                              Modules
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingCourse(course)}
                            data-testid={`button-edit-${course.id}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingCourse(course)}
                            data-testid={`button-delete-${course.id}`}
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

      {/* Create/Edit Course Form Dialog */}
      {(showCreateForm || editingCourse) && (
        <CourseForm
          course={editingCourse || undefined}
          onClose={() => {
            setShowCreateForm(false);
            setEditingCourse(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingCourse && (
        <CourseDeleteDialog
          course={deletingCourse}
          onClose={() => setDeletingCourse(null)}
        />
      )}
    </div>
  );
}
