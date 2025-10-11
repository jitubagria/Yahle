import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

export default function AdminDoctors() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Doctors Directory Management</h1>
        <p className="text-muted-foreground">Manage doctor profiles, import Excel, approval queue</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Doctor Management Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline">View All Doctors</Button>
            <Button variant="outline">Import from Excel/CSV</Button>
            <Button variant="outline">Approval Queue</Button>
            <Button variant="outline">Export Data</Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Management panel coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
