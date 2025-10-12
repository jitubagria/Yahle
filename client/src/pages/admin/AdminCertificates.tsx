import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Award, AlertCircle, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Schema for template form
const templateFormSchema = z.object({
  entityType: z.enum(['course', 'quiz', 'masterclass']),
  entityId: z.number().int().min(1, 'Entity ID is required'),
  backgroundImage: z.string().url('Must be a valid URL'),
  font: z.string().optional(),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color').optional(),
  textPositions: z.string().min(1, 'Text positions configuration is required'),
});

type TemplateFormData = z.infer<typeof templateFormSchema>;

interface EntityTemplate {
  id: number;
  entityType: 'course' | 'quiz' | 'masterclass';
  entityId: number;
  backgroundImage: string;
  font: string | null;
  textColor: string | null;
  textPositions: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminCertificates() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  const { data: templates = [], isLoading, isError, error, refetch } = useQuery<EntityTemplate[]>({
    queryKey: ['/api/admin/templates'],
  });

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      entityType: 'course',
      entityId: 1,
      backgroundImage: '',
      font: 'Arial',
      textColor: '#000000',
      textPositions: JSON.stringify({
        name: { x: 400, y: 300, alignment: 'center', fontSize: 48 },
        title: { x: 400, y: 400, alignment: 'center', fontSize: 32 },
        date: { x: 400, y: 500, alignment: 'center', fontSize: 24 },
      }, null, 2),
    },
  });

  const onSubmit = async (data: TemplateFormData) => {
    try {
      // Validate JSON format for textPositions
      JSON.parse(data.textPositions);

      await apiRequest('POST', '/api/admin/templates', data);
      
      toast({
        title: 'Success',
        description: 'Certificate template saved successfully',
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      setShowCreateForm(false);
      form.reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save template';
      if (errorMessage.includes('JSON')) {
        toast({
          variant: 'destructive',
          title: 'Invalid JSON',
          description: 'Text positions must be valid JSON',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMessage,
        });
      }
    }
  };

  const getEntityTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'course': return 'default';
      case 'quiz': return 'secondary';
      case 'masterclass': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Certificate Templates</h1>
          <p className="text-muted-foreground">Manage certificate templates for courses, quizzes, and masterclasses</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} data-testid="button-create-template">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            All Templates ({templates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading templates...</div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Templates</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : 'Failed to fetch templates. Please try again.'}
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
          ) : templates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No certificate templates created yet</p>
              <Button onClick={() => setShowCreateForm(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Template
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <Card key={template.id} className="overflow-hidden" data-testid={`card-template-${template.id}`}>
                  <div className="aspect-video bg-muted relative">
                    {template.backgroundImage ? (
                      <img 
                        src={template.backgroundImage} 
                        alt={`${template.entityType} template`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={getEntityTypeBadgeColor(template.entityType)}>
                        {template.entityType.charAt(0).toUpperCase() + template.entityType.slice(1)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        ID: {template.entityId}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      <div>Font: {template.font || 'Arial'}</div>
                      <div className="flex items-center gap-2">
                        Color: 
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: template.textColor || '#000000' }}
                        />
                        {template.textColor || '#000000'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Certificate Template</DialogTitle>
            <DialogDescription>
              Configure a certificate template for automatic generation
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="entityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entity Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-entityType">
                            <SelectValue placeholder="Select entity type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="course">Course</SelectItem>
                          <SelectItem value="quiz">Quiz</SelectItem>
                          <SelectItem value="masterclass">Masterclass</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="entityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entity ID</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          data-testid="input-entityId"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="backgroundImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/certificate-bg.jpg"
                        {...field}
                        data-testid="input-backgroundImage"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="font"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Font (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Arial"
                          {...field}
                          data-testid="input-font"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="textColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text Color (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="#000000"
                          {...field}
                          data-testid="input-textColor"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="textPositions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text Positions (JSON)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='{"name": {"x": 400, "y": 300, "alignment": "center"}}'
                        className="font-mono text-sm"
                        rows={8}
                        {...field}
                        data-testid="input-textPositions"
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Define positions for: name, title, date, score, rank
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-submit">
                  Create Template
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
