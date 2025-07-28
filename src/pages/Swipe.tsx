import { useState } from "react";
import { Heart, X, MapPin, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { demoApartments } from "@/data/demoData";
import { useNavigate } from "react-router-dom";

const Swipe = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedApartments, setLikedApartments] = useState<string[]>([]);
  const navigate = useNavigate();

  const currentApartment = demoApartments[currentIndex];

  const handleSwipe = (liked: boolean) => {
    if (liked && currentApartment) {
      setLikedApartments(prev => [...prev, currentApartment.id]);
    }
    
    if (currentIndex < demoApartments.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // All apartments swiped
      setCurrentIndex(0);
    }
  };

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
            <h1 className="text-2xl font-bold text-foreground">Discover</h1>
            <div className="text-sm text-muted-foreground">
              {currentIndex + 1} of {demoApartments.length}
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Card */}
      <div className="px-4 py-6 max-w-md mx-auto">
        <Card className="overflow-hidden">
          <div className="relative">
            {/* Image */}
            <div className="h-80 bg-muted overflow-hidden">
              <img
                src={currentApartment.image_urls[0]}
                alt={currentApartment.title}
                className="w-full h-full object-cover"
              />
              
              {/* Image indicators */}
              {currentApartment.image_urls.length > 1 && (
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
                onClick={() => navigate(`/apartment/${currentApartment.id}`)}
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
              style={{ width: `${((currentIndex + 1) / demoApartments.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swipe;