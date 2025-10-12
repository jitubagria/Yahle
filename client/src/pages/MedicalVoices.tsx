import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, Users, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface MedicalVoice {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  category: string;
  bannerImage: string;
  supportersCount: number;
  hasGathering: boolean;
  gatheringDate: string;
  gatheringCity: string;
  status: string;
  createdAt: string;
}

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

export default function MedicalVoices() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("active");

  const { data, isLoading } = useQuery<{
    voices: MedicalVoice[];
    total: number;
  }>({
    queryKey: ["/api/voices", { status, category, q: search }],
  });

  const voices = data?.voices || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-page-title">
            Medical Voices
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl" data-testid="text-page-description">
            Unite for change. Support doctor-led advocacy campaigns to improve healthcare policy, 
            workplace safety, and professional welfare across India.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search voices..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-voices"
                />
              </div>
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[200px]" data-testid="select-category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[150px]" data-testid="select-status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Voices Grid */}
      <section className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : voices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg" data-testid="text-no-voices">
              No voices found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {voices.map((voice) => (
              <Card key={voice.id} className="hover-elevate" data-testid={`card-voice-${voice.id}`}>
                <CardHeader className="p-0">
                  {voice.bannerImage && (
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={voice.bannerImage}
                        alt={voice.title}
                        className="w-full h-full object-cover"
                        data-testid={`img-voice-banner-${voice.id}`}
                      />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" data-testid={`badge-category-${voice.id}`}>
                      {voice.category}
                    </Badge>
                    {voice.status === 'closed' && (
                      <Badge variant="outline" data-testid={`badge-status-${voice.id}`}>
                        Closed
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="mb-2 line-clamp-2" data-testid={`text-voice-title-${voice.id}`}>
                    {voice.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 mb-4" data-testid={`text-voice-description-${voice.id}`}>
                    {voice.shortDescription}
                  </CardDescription>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1" data-testid={`text-supporters-count-${voice.id}`}>
                      <Users className="h-4 w-4" />
                      <span>{voice.supportersCount} supporters</span>
                    </div>
                    {voice.hasGathering && voice.gatheringDate && (
                      <div className="flex items-center gap-1" data-testid={`text-gathering-info-${voice.id}`}>
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(voice.gatheringDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {voice.hasGathering && voice.gatheringCity && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4" data-testid={`text-gathering-location-${voice.id}`}>
                      <MapPin className="h-4 w-4" />
                      <span>{voice.gatheringCity}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Link href={`/voices/${voice.slug}`} className="w-full">
                    <Button className="w-full" data-testid={`button-view-voice-${voice.id}`}>
                      View Campaign
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
