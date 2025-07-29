import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MapPin, Calendar, User, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import { apartmentsApi } from "@/services/api";
import type { Apartment } from "@/services/api";

const ApartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  // Fetch apartment details
  const { data: apartment, isLoading, error } = useQuery({
    queryKey: ['apartment', id],
    queryFn: () => apartmentsApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading apartment details...</p>
        </div>
      </div>
    );
  }

  if (error || !apartment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Apartment not found</h2>
          <p className="text-muted-foreground mb-4">The apartment you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={isLiked ? "text-red-500" : ""}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Image Carousel */}
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {apartment.image_urls && apartment.image_urls.length > 0 ? (
              apartment.image_urls.map((url, index) => (
                <CarouselItem key={index}>
                  <div className="h-80 bg-muted overflow-hidden">
                    <img
                      src={url}
                      alt={`${apartment.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <div className="h-80 bg-muted flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-muted-foreground" />
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          {apartment.image_urls && apartment.image_urls.length > 1 && (
            <>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </>
          )}
        </Carousel>
        
        {/* Price overlay */}
        <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-lg">
          ₪{apartment.price.toLocaleString()}/month
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Title and Basic Info */}
        <div>
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-2xl font-bold text-foreground pr-4">
              {apartment.title}
            </h1>
            <Badge variant="secondary" className="flex-shrink-0">
              {apartment.room_type}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span>{apartment.address}</span>
          </div>
        </div>

        {/* Description */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {apartment.description}
            </p>
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Room Type</span>
                <span className="font-medium">{apartment.room_type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Monthly Rent</span>
                <span className="font-medium">₪{apartment.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Posted</span>
                <span className="font-medium">
                  {new Date(apartment.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map placeholder */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Location</h3>
            <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Interactive map showing exact location
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {apartment.address}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current text-red-500" : ""}`} />
            {isLiked ? "Liked" : "Like"}
          </Button>
          <Button className="flex-1">
            Contact Owner
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetail;