import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, GraduationCap, AlertCircle, RefreshCw, Calendar, Users, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';

type Masterclass = {
  id: number;
  title: string;
  description: string | null;
  instructor: string | null;
  eventDate: Date;
  duration: number | null;
  maxParticipants: number | null;
  currentParticipants: number | null;
  price: number | null;
  location: string | null;
  thumbnailImage: string | null;
  isActive: boolean | null;
};

export default function AdminMasterclasses() {
  const { data: masterclasses = [], isLoading, isError, error, refetch } = useQuery<Masterclass[]>({
    queryKey: ['/api/masterclasses'],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Masterclasses Management</h1>
          <p className="text-muted-foreground">Create and manage masterclass events</p>
        </div>
        <Button data-testid="button-create-masterclass">
          <Plus className="w-4 h-4 mr-2" />
          Create Masterclass
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            All Masterclasses ({masterclasses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading masterclasses...</div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Masterclasses</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : 'Failed to fetch masterclasses. Please try again.'}
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
          ) : masterclasses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No masterclasses scheduled yet</p>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Your First Masterclass
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Title</th>
                    <th className="text-left py-3 px-4 font-semibold">Instructor</th>
                    <th className="text-left py-3 px-4 font-semibold">Event Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Duration</th>
                    <th className="text-left py-3 px-4 font-semibold">Participants</th>
                    <th className="text-left py-3 px-4 font-semibold">Price</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {masterclasses.map((masterclass) => (
                    <tr key={masterclass.id} className="border-b hover-elevate" data-testid={`row-masterclass-${masterclass.id}`}>
                      <td className="py-3 px-4">
                        <div className="font-medium">{masterclass.title}</div>
                        {masterclass.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {masterclass.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {masterclass.instructor || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(masterclass.eventDate), 'MMM dd, yyyy')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {masterclass.duration ? (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {masterclass.duration} min
                          </div>
                        ) : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {masterclass.currentParticipants || 0}
                          {masterclass.maxParticipants && `/${masterclass.maxParticipants}`}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {masterclass.price === 0 ? (
                          <Badge variant="secondary">Free</Badge>
                        ) : (
                          <span className="font-medium">₹{masterclass.price}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {masterclass.isActive ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-edit-${masterclass.id}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-delete-${masterclass.id}`}
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
