import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Eye, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const categories = [
  "Policy Reform",
  "Workplace Safety", 
  "Medical Education",
  "Healthcare Ethics",
  "Patient Rights",
  "Professional Welfare",
  "Research & Innovation",
  "Public Health",
];

export default function AdminVoices() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVoice, setEditingVoice] = useState<any>(null);
  const [viewingSupporters, setViewingSupporters] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    category: "",
    bannerImage: "",
    relatedDocuments: "",
    relatedImages: "",
    concernedAuthority: "",
    targetDepartment: "",
    mediaContacts: "",
    visibility: "public" as "public" | "private",
    status: "active" as "draft" | "active" | "closed",
    hasGathering: false,
    gatheringDate: "",
    gatheringLocation: "",
    gatheringAddress: "",
    gatheringCity: "",
    gatheringState: "",
    gatheringPin: "",
    gatheringMapLink: "",
    gatheringNotes: "",
  });

  const { data: voicesData } = useQuery<{ voices: any[]; total: number }>({
    queryKey: ["/api/admin/voices"],
  });

  const { data: analytics } = useQuery<{
    voicesByStatus: Array<{ status: string; count: number }>;
    totalSupporters: number;
    topVoices: any[];
    byCategory: Array<{ category: string; count: number }>;
  }>({
    queryKey: ["/api/admin/voices/analytics"],
  });

  const { data: supportersData } = useQuery<{
    supporters: Array<{
      supporter: any;
      user: any;
      profile: any;
    }>;
    total: number;
  }>({
    queryKey: [`/api/admin/voices/${viewingSupporters}/supporters`],
    enabled: !!viewingSupporters,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/voices", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/voices"] });
      toast({ title: "Voice created successfully" });
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create voice", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest("PATCH", `/api/admin/voices/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/voices"] });
      toast({ title: "Voice updated successfully" });
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update voice", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/voices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/voices"] });
      toast({ title: "Voice deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete voice", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      shortDescription: "",
      description: "",
      category: "",
      bannerImage: "",
      relatedDocuments: "",
      relatedImages: "",
      concernedAuthority: "",
      targetDepartment: "",
      mediaContacts: "",
      visibility: "public",
      status: "active",
      hasGathering: false,
      gatheringDate: "",
      gatheringLocation: "",
      gatheringAddress: "",
      gatheringCity: "",
      gatheringState: "",
      gatheringPin: "",
      gatheringMapLink: "",
      gatheringNotes: "",
    });
    setEditingVoice(null);
  };

  const handleEdit = (voice: any) => {
    setEditingVoice(voice);
    setFormData({
      title: voice.title || "",
      slug: voice.slug || "",
      shortDescription: voice.shortDescription || "",
      description: voice.description || "",
      category: voice.category || "",
      bannerImage: voice.bannerImage || "",
      relatedDocuments: voice.relatedDocuments || "",
      relatedImages: voice.relatedImages || "",
      concernedAuthority: voice.concernedAuthority || "",
      targetDepartment: voice.targetDepartment || "",
      mediaContacts: voice.mediaContacts || "",
      visibility: voice.visibility || "public",
      status: voice.status || "active",
      hasGathering: voice.hasGathering || false,
      gatheringDate: voice.gatheringDate ? new Date(voice.gatheringDate).toISOString().slice(0, 16) : "",
      gatheringLocation: voice.gatheringLocation || "",
      gatheringAddress: voice.gatheringAddress || "",
      gatheringCity: voice.gatheringCity || "",
      gatheringState: voice.gatheringState || "",
      gatheringPin: voice.gatheringPin || "",
      gatheringMapLink: voice.gatheringMapLink || "",
      gatheringNotes: voice.gatheringNotes || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const submitData = { ...formData };
    if (formData.gatheringDate) {
      submitData.gatheringDate = new Date(formData.gatheringDate).toISOString();
    }
    
    if (editingVoice) {
      updateMutation.mutate({ id: editingVoice.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Medical Voices Management</h1>
          <p className="text-muted-foreground">Manage advocacy campaigns</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} data-testid="button-create-voice">
              <Plus className="h-4 w-4 mr-2" />
              Create Voice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingVoice ? "Edit Voice" : "Create New Voice"}</DialogTitle>
              <DialogDescription>Fill in the details for the advocacy campaign</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    data-testid="input-title"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated if empty"
                    data-testid="input-slug"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger id="category" data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Textarea
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    data-testid="textarea-short-description"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Full Description (HTML)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    data-testid="textarea-description"
                  />
                </div>
                <div>
                  <Label htmlFor="bannerImage">Banner Image URL</Label>
                  <Input
                    id="bannerImage"
                    value={formData.bannerImage}
                    onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                    data-testid="input-banner-image"
                  />
                </div>
                <div>
                  <Label htmlFor="concernedAuthority">Concerned Authority</Label>
                  <Input
                    id="concernedAuthority"
                    value={formData.concernedAuthority}
                    onChange={(e) => setFormData({ ...formData, concernedAuthority: e.target.value })}
                    data-testid="input-concerned-authority"
                  />
                </div>
                <div>
                  <Label htmlFor="targetDepartment">Target Department</Label>
                  <Input
                    id="targetDepartment"
                    value={formData.targetDepartment}
                    onChange={(e) => setFormData({ ...formData, targetDepartment: e.target.value })}
                    data-testid="input-target-department"
                  />
                </div>
                <div>
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select value={formData.visibility} onValueChange={(value: any) => setFormData({ ...formData, visibility: value })}>
                    <SelectTrigger id="visibility" data-testid="select-visibility">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger id="status" data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="hasGathering"
                  checked={formData.hasGathering}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasGathering: checked })}
                  data-testid="switch-has-gathering"
                />
                <Label htmlFor="hasGathering">Has Gathering Event</Label>
              </div>

              {formData.hasGathering && (
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div className="col-span-2">
                    <Label htmlFor="gatheringDate">Gathering Date & Time</Label>
                    <Input
                      id="gatheringDate"
                      type="datetime-local"
                      value={formData.gatheringDate}
                      onChange={(e) => setFormData({ ...formData, gatheringDate: e.target.value })}
                      data-testid="input-gathering-date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gatheringLocation">Location Name</Label>
                    <Input
                      id="gatheringLocation"
                      value={formData.gatheringLocation}
                      onChange={(e) => setFormData({ ...formData, gatheringLocation: e.target.value })}
                      data-testid="input-gathering-location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gatheringCity">City</Label>
                    <Input
                      id="gatheringCity"
                      value={formData.gatheringCity}
                      onChange={(e) => setFormData({ ...formData, gatheringCity: e.target.value })}
                      data-testid="input-gathering-city"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="gatheringAddress">Address</Label>
                    <Textarea
                      id="gatheringAddress"
                      value={formData.gatheringAddress}
                      onChange={(e) => setFormData({ ...formData, gatheringAddress: e.target.value })}
                      data-testid="textarea-gathering-address"
                    />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} data-testid="button-submit-voice">
                {editingVoice ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="voices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="voices" data-testid="tab-voices">Voices</TabsTrigger>
          <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="voices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Voices</CardTitle>
              <CardDescription>Manage advocacy campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Supporters</TableHead>
                    <TableHead>Gathering</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {voicesData?.voices.map((voice) => (
                    <TableRow key={voice.id} data-testid={`row-voice-${voice.id}`}>
                      <TableCell className="font-medium">{voice.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{voice.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={voice.status === 'active' ? 'default' : 'outline'}>
                          {voice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{voice.supportersCount}</TableCell>
                      <TableCell>
                        {voice.hasGathering ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(`/voices/${voice.slug}`, "_blank")}
                            data-testid={`button-view-${voice.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(voice)}
                            data-testid={`button-edit-${voice.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewingSupporters(voice.id)}
                            data-testid={`button-supporters-${voice.id}`}
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMutation.mutate(voice.id)}
                            data-testid={`button-delete-${voice.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Supporters</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold" data-testid="text-total-supporters">
                  {analytics?.totalSupporters || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Voices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold" data-testid="text-active-voices">
                  {analytics?.voicesByStatus?.find((v: any) => v.status === 'active')?.count || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Closed Voices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold" data-testid="text-closed-voices">
                  {analytics?.voicesByStatus?.find((v: any) => v.status === 'closed')?.count || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Voices by Supporters</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Supporters</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics?.topVoices?.map((voice: any) => (
                    <TableRow key={voice.id}>
                      <TableCell className="font-medium">{voice.title}</TableCell>
                      <TableCell>{voice.category}</TableCell>
                      <TableCell>{voice.supportersCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Supporters Dialog */}
      <Dialog open={!!viewingSupporters} onOpenChange={() => setViewingSupporters(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Supporters</DialogTitle>
            <DialogDescription>View all supporters for this voice</DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Motivation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supportersData?.supporters.map((item: any) => (
                <TableRow key={item.supporter.id}>
                  <TableCell>
                    {item.profile?.firstName} {item.profile?.lastName}
                  </TableCell>
                  <TableCell>{item.user.phone}</TableCell>
                  <TableCell>
                    {new Date(item.supporter.joinedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {item.supporter.motivationNote || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}
