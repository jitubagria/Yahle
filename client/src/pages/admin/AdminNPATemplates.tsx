import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, AlertCircle, RefreshCw, Plus, Edit, Trash2, Eye, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';

type NPATemplate = {
  id: number;
  title: string;
  description: string | null;
  htmlTemplate: string;
  placeholders: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export default function AdminNPATemplates() {
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NPATemplate | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    htmlTemplate: '',
    placeholders: [] as string[],
    isActive: true,
  });

  const { data: templates = [], isLoading, isError, error, refetch } = useQuery<NPATemplate[]>({
    queryKey: ['/api/admin/npa/templates'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest('POST', '/api/admin/npa/templates', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/npa/templates'] });
      toast({ title: 'Template created successfully' });
      setCreateDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: 'Failed to create template', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<typeof formData> }) => {
      return await apiRequest('PATCH', `/api/admin/npa/templates/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/npa/templates'] });
      toast({ title: 'Template updated successfully' });
      setEditDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: 'Failed to update template', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/admin/npa/templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/npa/templates'] });
      toast({ title: 'Template deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete template', variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      htmlTemplate: '',
      placeholders: [],
      isActive: true,
    });
    setSelectedTemplate(null);
  };

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleEdit = (template: NPATemplate) => {
    setSelectedTemplate(template);
    setFormData({
      title: template.title,
      description: template.description || '',
      htmlTemplate: template.htmlTemplate,
      placeholders: template.placeholders,
      isActive: template.isActive,
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (selectedTemplate) {
      updateMutation.mutate({ id: selectedTemplate.id, data: formData });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteMutation.mutate(id);
    }
  };

  const handlePreview = (template: NPATemplate) => {
    setSelectedTemplate(template);
    setPreviewDialogOpen(true);
  };

  const extractPlaceholders = (html: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g;
    const placeholders = new Set<string>();
    let match;
    while ((match = regex.exec(html)) !== null) {
      placeholders.add(match[1]);
    }
    return Array.from(placeholders);
  };

  const handleTemplateChange = (value: string) => {
    setFormData({
      ...formData,
      htmlTemplate: value,
      placeholders: extractPlaceholders(value),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">NPA Templates</h1>
          <p className="text-muted-foreground">Manage Non-Practicing Allowance certificate templates</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-create-template">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Templates ({templates.length})
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
              <p className="text-muted-foreground mb-4">No templates yet</p>
              <p className="text-sm text-muted-foreground">Create your first NPA certificate template</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Title</th>
                    <th className="text-left py-3 px-4 font-semibold">Placeholders</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Created</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((template) => (
                    <tr key={template.id} className="border-b hover-elevate" data-testid={`row-template-${template.id}`}>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{template.title}</div>
                          {template.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {template.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {template.placeholders.slice(0, 3).map((placeholder, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {placeholder}
                            </Badge>
                          ))}
                          {template.placeholders.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.placeholders.length - 3}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {template.isActive ? (
                          <Badge variant="default" className="flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {format(new Date(template.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreview(template)}
                            data-testid={`button-preview-${template.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(template)}
                            data-testid={`button-edit-${template.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(template.id)}
                            data-testid={`button-delete-${template.id}`}
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

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create NPA Template</DialogTitle>
            <DialogDescription>
              Create a new certificate template with placeholders for doctor information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Standard NPA Certificate"
                data-testid="input-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this template"
                data-testid="input-description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="htmlTemplate">HTML Template</Label>
              <Textarea
                id="htmlTemplate"
                value={formData.htmlTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                placeholder="Enter HTML with placeholders: {{name}}, {{designation}}, {{month}}, {{date}}, {{place}}, {{district}}"
                className="font-mono text-sm min-h-[200px]"
                data-testid="input-htmltemplate"
              />
              <p className="text-xs text-muted-foreground">
                Use double curly braces for placeholders. Available: name, designation, month, date, place, district
              </p>
            </div>
            {formData.placeholders.length > 0 && (
              <div className="space-y-2">
                <Label>Detected Placeholders</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.placeholders.map((placeholder, idx) => (
                    <Badge key={idx} variant="secondary">
                      {placeholder}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded"
                data-testid="checkbox-isactive"
              />
              <Label htmlFor="isActive" className="cursor-pointer">Set as active template</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending} data-testid="button-submit">
              {createMutation.isPending ? 'Creating...' : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update the certificate template details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                data-testid="input-edit-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                data-testid="input-edit-description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-htmlTemplate">HTML Template</Label>
              <Textarea
                id="edit-htmlTemplate"
                value={formData.htmlTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="font-mono text-sm min-h-[200px]"
                data-testid="input-edit-htmltemplate"
              />
            </div>
            {formData.placeholders.length > 0 && (
              <div className="space-y-2">
                <Label>Detected Placeholders</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.placeholders.map((placeholder, idx) => (
                    <Badge key={idx} variant="secondary">
                      {placeholder}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded"
                data-testid="checkbox-edit-isactive"
              />
              <Label htmlFor="edit-isActive" className="cursor-pointer">Set as active template</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} data-testid="button-cancel-edit">
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending} data-testid="button-update">
              {updateMutation.isPending ? 'Updating...' : 'Update Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Template Preview: {selectedTemplate?.title}</DialogTitle>
            <DialogDescription>
              HTML template content
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-muted rounded-md">
              <pre className="text-sm whitespace-pre-wrap break-words">
                {selectedTemplate?.htmlTemplate}
              </pre>
            </div>
            {selectedTemplate && selectedTemplate.placeholders.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Placeholders:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.placeholders.map((placeholder, idx) => (
                    <Badge key={idx} variant="outline">
                      {placeholder}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setPreviewDialogOpen(false)} data-testid="button-close-preview">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
