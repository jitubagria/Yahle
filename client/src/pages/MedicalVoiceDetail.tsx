import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Heart, Share2, MapPin, Calendar, Clock, Users, FileText, Phone, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VoiceData {
  voice: any;
  contacts: any[];
  updates: any[];
  isSupporting: boolean;
  hasJoinedGathering: boolean;
  gatheringJoinStatus: string | null;
}

export default function MedicalVoiceDetail() {
  const [, params] = useRoute("/voices/:slug");
  const { toast } = useToast();
  const [motivationNote, setMotivationNote] = useState("");
  const [gatheringRemarks, setGatheringRemarks] = useState("");
  const [gatheringStatus, setGatheringStatus] = useState<string>("interested");
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [gatheringDialogOpen, setGatheringDialogOpen] = useState(false);

  const { data, isLoading } = useQuery<VoiceData>({
    queryKey: [`/api/voices/${params?.slug}`],
    enabled: !!params?.slug,
  });

  const supportMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/voices/${data?.voice.id}/support`, {
        motivationNote,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/voices/${params?.slug}`] });
      toast({
        title: "Thank you for your support!",
        description: "You are now supporting this voice.",
      });
      setSupportDialogOpen(false);
      setMotivationNote("");
    },
    onError: () => {
      toast({
        title: "Failed to support",
        description: "You may already be supporting this voice.",
        variant: "destructive",
      });
    },
  });

  const withdrawSupportMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/voices/${data?.voice.id}/support`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/voices/${params?.slug}`] });
      toast({
        title: "Support withdrawn",
        description: "You are no longer supporting this voice.",
      });
    },
  });

  const joinGatheringMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/voices/${data?.voice.id}/gathering/join`, {
        status: gatheringStatus,
        remarks: gatheringRemarks,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/voices/${params?.slug}`] });
      toast({
        title: "Gathering RSVP confirmed!",
        description: "You've been added to the gathering list.",
      });
      setGatheringDialogOpen(false);
      setGatheringRemarks("");
    },
  });

  const withdrawGatheringMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/voices/${data?.voice.id}/gathering/join`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/voices/${params?.slug}`] });
      toast({
        title: "Gathering RSVP withdrawn",
        description: "You are no longer attending this gathering.",
      });
    },
  });

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: data?.voice.title,
        text: data?.voice.shortDescription,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Share this voice with others.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg text-muted-foreground">Voice not found</p>
      </div>
    );
  }

  const { voice, contacts, updates, isSupporting, hasJoinedGathering } = data;
  const relatedDocs = voice.relatedDocuments ? JSON.parse(voice.relatedDocuments) : [];
  const relatedImages = voice.relatedImages ? JSON.parse(voice.relatedImages) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      {voice.bannerImage && (
        <div className="h-96 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
          <img
            src={voice.bannerImage}
            alt={voice.title}
            className="w-full h-full object-cover"
            data-testid="img-voice-banner"
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3" data-testid="badge-category">
                {voice.category}
              </Badge>
              <h1 className="text-4xl font-bold mb-4" data-testid="text-voice-title">
                {voice.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-6" data-testid="text-voice-short-description">
                {voice.shortDescription}
              </p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2" data-testid="text-supporters-count">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-lg">{voice.supportersCount}</span>
                  <span className="text-muted-foreground">supporters</span>
                </div>
              </div>

              <div className="flex gap-3 mb-8">
                {!isSupporting ? (
                  <Dialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="gap-2" data-testid="button-support-voice">
                        <Heart className="h-5 w-5" />
                        Support this Voice
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Support this Voice</DialogTitle>
                        <DialogDescription>
                          Your support helps amplify this important cause.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="motivation">Why are you supporting? (optional)</Label>
                          <Textarea
                            id="motivation"
                            value={motivationNote}
                            onChange={(e) => setMotivationNote(e.target.value)}
                            placeholder="Share your motivation..."
                            className="mt-2"
                            data-testid="textarea-motivation-note"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={() => supportMutation.mutate()}
                          disabled={supportMutation.isPending}
                          data-testid="button-confirm-support"
                        >
                          {supportMutation.isPending ? "Supporting..." : "Confirm Support"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => withdrawSupportMutation.mutate()}
                    disabled={withdrawSupportMutation.isPending}
                    data-testid="button-withdraw-support"
                  >
                    Withdraw Support
                  </Button>
                )}
                <Button variant="outline" onClick={handleShare} className="gap-2" data-testid="button-share">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">About this Voice</h2>
              <div
                className="prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: voice.description }}
                data-testid="text-voice-description"
              />
            </div>

            {/* Related Documents */}
            {relatedDocs.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Related Documents</h2>
                <div className="space-y-2">
                  {relatedDocs.map((doc: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span data-testid={`text-document-name-${index}`}>{doc.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(doc.url, "_blank")}
                          data-testid={`button-open-document-${index}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Related Images */}
            {relatedImages.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {relatedImages.map((url: string, index: number) => (
                    <div key={index} className="aspect-video overflow-hidden rounded-lg">
                      <img
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                        data-testid={`img-gallery-${index}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Updates */}
            {updates.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Updates</h2>
                <div className="space-y-4">
                  {updates.map((update) => (
                    <Card key={update.id}>
                      <CardHeader>
                        <CardTitle data-testid={`text-update-title-${update.id}`}>
                          {update.updateTitle}
                        </CardTitle>
                        <CardDescription>
                          {new Date(update.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div
                          dangerouslySetInnerHTML={{ __html: update.updateBody }}
                          data-testid={`text-update-body-${update.id}`}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Gathering Card */}
            {voice.hasGathering && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Gathering
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2" data-testid="text-gathering-date">
                      <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {new Date(voice.gatheringDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(voice.gatheringDate).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2" data-testid="text-gathering-location">
                      <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{voice.gatheringLocation}</p>
                        <p className="text-sm text-muted-foreground">
                          {voice.gatheringCity}, {voice.gatheringState}
                        </p>
                      </div>
                    </div>
                  </div>

                  {voice.gatheringMapLink && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(voice.gatheringMapLink, "_blank")}
                      data-testid="button-view-map"
                    >
                      View on Map
                    </Button>
                  )}

                  {!hasJoinedGathering ? (
                    <Dialog open={gatheringDialogOpen} onOpenChange={setGatheringDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full" data-testid="button-join-gathering">
                          Join Gathering
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Join Gathering</DialogTitle>
                          <DialogDescription>
                            RSVP for this gathering event.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="status">Your Status</Label>
                            <Select value={gatheringStatus} onValueChange={setGatheringStatus}>
                              <SelectTrigger id="status" data-testid="select-gathering-status">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="interested">Interested</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="remarks">Remarks (optional)</Label>
                            <Textarea
                              id="remarks"
                              value={gatheringRemarks}
                              onChange={(e) => setGatheringRemarks(e.target.value)}
                              placeholder="Any special requirements or notes..."
                              data-testid="textarea-gathering-remarks"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={() => joinGatheringMutation.mutate()}
                            disabled={joinGatheringMutation.isPending}
                            data-testid="button-confirm-gathering"
                          >
                            {joinGatheringMutation.isPending ? "Joining..." : "Confirm"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => withdrawGatheringMutation.mutate()}
                      disabled={withdrawGatheringMutation.isPending}
                      data-testid="button-withdraw-gathering"
                    >
                      Withdraw from Gathering
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Authority Card */}
            {(voice.concernedAuthority || voice.targetDepartment) && (
              <Card>
                <CardHeader>
                  <CardTitle>Concerned Authorities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {voice.concernedAuthority && (
                    <div>
                      <p className="text-sm text-muted-foreground">Authority</p>
                      <p className="font-medium" data-testid="text-concerned-authority">
                        {voice.concernedAuthority}
                      </p>
                    </div>
                  )}
                  {voice.targetDepartment && (
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium" data-testid="text-target-department">
                        {voice.targetDepartment}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Contacts */}
            {contacts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Persons</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="space-y-2" data-testid={`contact-${contact.id}`}>
                      {contact.isPrimary && (
                        <Badge variant="secondary" className="mb-2">
                          Primary Contact
                        </Badge>
                      )}
                      <p className="font-medium" data-testid={`text-contact-name-${contact.id}`}>
                        {contact.name}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-contact-designation-${contact.id}`}>
                        {contact.designation}
                      </p>
                      <div className="space-y-1">
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3" />
                            <a href={`tel:${contact.phone}`} data-testid={`link-contact-phone-${contact.id}`}>
                              {contact.phone}
                            </a>
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3" />
                            <a href={`mailto:${contact.email}`} data-testid={`link-contact-email-${contact.id}`}>
                              {contact.email}
                            </a>
                          </div>
                        )}
                      </div>
                      {contacts.indexOf(contact) < contacts.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
