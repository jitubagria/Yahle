import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Users as UsersIcon, AlertCircle, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

type User = {
  id: number;
  phone: string;
  email: string | null;
  role: 'admin' | 'doctor' | 'student' | 'service_provider';
  isVerified: boolean;
  createdAt: Date;
};

export default function AdminUsers() {
  const { toast } = useToast();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    role: '',
    email: '',
    isVerified: false,
  });

  const { data: users = [], isLoading, isError, error, refetch } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; role: string; email: string; isVerified: boolean }) =>
      apiRequest('PUT', `/api/admin/users/${data.id}`, {
        role: data.role,
        email: data.email || null,
        isVerified: data.isVerified,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
      setEditingUser(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      setDeletingUser(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({
      role: user.role,
      email: user.email || '',
      isVerified: user.isVerified,
    });
  };

  const handleUpdate = () => {
    if (editingUser) {
      updateMutation.mutate({
        id: editingUser.id,
        ...editForm,
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'doctor':
        return 'default';
      case 'student':
        return 'secondary';
      case 'service_provider':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Users Management</h1>
          <p className="text-muted-foreground">Manage all registered users and their permissions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5" />
            All Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading users...</div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Users</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : 'Failed to fetch users. Please try again.'}
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
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 font-semibold">Verified</th>
                    <th className="text-left py-3 px-4 font-semibold">Joined</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover-elevate" data-testid={`row-user-${user.id}`}>
                      <td className="py-3 px-4 font-medium">{user.id}</td>
                      <td className="py-3 px-4">{user.phone}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {user.email || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {user.isVerified ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <XCircle className="w-3 h-3" />
                            Unverified
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">
                        {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(user)}
                            data-testid={`button-edit-${user.id}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingUser(user)}
                            data-testid={`button-delete-${user.id}`}
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

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={editingUser.phone} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="user@example.com"
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={editForm.role}
                  onValueChange={(value) => setEditForm({ ...editForm, role: value })}
                >
                  <SelectTrigger id="role" data-testid="select-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="service_provider">Service Provider</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="verified">Verified Status</Label>
                <Switch
                  id="verified"
                  checked={editForm.isVerified}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, isVerified: checked })}
                  data-testid="switch-verified"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditingUser(null)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                data-testid="button-save"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete User Dialog */}
      {deletingUser && (
        <AlertDialog open onOpenChange={() => setDeletingUser(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete user "{deletingUser.phone}"? This action cannot be undone.
                All associated data will also be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteMutation.mutate(deletingUser.id)}
                disabled={deleteMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-testid="button-confirm-delete"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete User'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
