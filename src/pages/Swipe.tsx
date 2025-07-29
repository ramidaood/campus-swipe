import { useState } from "react";
import { Heart, X, MapPin, Camera, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apartmentsApi } from "@/services/api";
import type { Apartment } from "@/services/api";

const Swipe = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedApartments, setLikedApartments] = useState<string[]>([]);
  const [showImageCarousel, setShowImageCarousel] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  // Fetch apartments
  const { data: apartments = [], isLoading } = useQuery({
    queryKey: ['apartments'],
    queryFn: apartmentsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const currentApartment = apartments[currentIndex];

  const handleSwipe = (liked: boolean) => {
    if (liked && currentApartment) {
      setLikedApartments(prev => [...prev, currentApartment.id]);
    }
    
    if (currentIndex < apartments.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // All apartments swiped
      setCurrentIndex(0);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading apartments...</p>
        </div>
      </div>
    );
  }

  if (!currentApartment) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No more apartments!</h2>
          <p className="text-muted-foreground mb-4">Check back later for new listings</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Discover</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              {currentIndex + 1} of {apartments.length}
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Card */}
      <div className="px-4 py-6 max-w-md mx-auto">
        <Card className="overflow-hidden">
          <div className="relative">
            {/* Image */}
            <div 
              className="h-80 bg-muted overflow-hidden cursor-pointer"
              onClick={() => setShowImageCarousel(true)}
            >
              {currentApartment.image_urls && currentApartment.image_urls.length > 0 ? (
                <img
                  src={currentApartment.image_urls[0]}
                  alt={currentApartment.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              
              {/* Image indicators */}
              {currentApartment.image_urls && currentApartment.image_urls.length > 1 && (
                <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  <Camera className="w-3 h-3 inline mr-1" />
                  {currentApartment.image_urls.length}
                </div>
              )}
              
              {/* Price tag */}
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full font-bold">
                ₪{currentApartment.price.toLocaleString()}/mo
              </div>
            </div>

            <CardContent className="p-6">
              {/* Title and Room Type */}
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-bold text-foreground pr-2">
                  {currentApartment.title}
                </h2>
                <Badge variant="secondary">
                  {currentApartment.room_type}
                </Badge>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{currentApartment.address}</span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {currentApartment.description}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 h-14"
                  onClick={() => handleSwipe(false)}
                >
                  <X className="w-6 h-6 mr-2" />
                  Skip
                </Button>
                <Button
                  size="lg"
                  className="flex-1 h-14"
                  onClick={() => handleSwipe(true)}
                >
                  <Heart className="w-6 h-6 mr-2" />
                  Like
                </Button>
              </div>
              
              {/* View Details */}
              <Button
                variant="ghost"
                className="w-full mt-3"
                onClick={() => setShowDetailsModal(true)}
              >
                View Full Details
              </Button>
            </CardContent>
          </div>
        </Card>

        {/* Progress indicator */}
        <div className="mt-6">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / apartments.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Image Carousel Modal */}
      <Dialog open={showImageCarousel} onOpenChange={setShowImageCarousel}>
        <DialogContent className="max-w-lg p-0">
          <Carousel className="w-full">
            <CarouselContent>
              {currentApartment.image_urls && currentApartment.image_urls.length > 0 ? (
                currentApartment.image_urls.map((url, index) => (
                  <CarouselItem key={index}>
                    <div className="h-80 bg-muted overflow-hidden">
                      <img
                        src={url}
                        alt={`${currentApartment.title} - Image ${index + 1}`}
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
            {currentApartment.image_urls && currentApartment.image_urls.length > 1 && (
              <>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </>
            )}
          </Carousel>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentApartment.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{currentApartment.address}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{currentApartment.room_type}</Badge>
              <span className="text-lg font-bold">₪{currentApartment.price.toLocaleString()}/month</span>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground leading-relaxed">
                {currentApartment.description}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posted:</span>
                  <span>{new Date(currentApartment.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Swipe;