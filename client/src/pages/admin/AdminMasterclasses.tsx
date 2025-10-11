import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AdminMasterclasses() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Masterclasses</h1>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Masterclass management panel will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
