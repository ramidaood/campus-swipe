import { useState } from "react";
import { Heart, MapPin, Trash2, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { demoApartments } from "@/data/demoData";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  // Simulate some liked apartments for demo
  const [likedApartmentIds, setLikedApartmentIds] = useState<string[]>(["1", "3"]);
  const navigate = useNavigate();

  const likedApartments = demoApartments.filter(apartment => 
    likedApartmentIds.includes(apartment.id)
  );

  const removeFromFavorites = (apartmentId: string) => {
    setLikedApartmentIds(prev => prev.filter(id => id !== apartmentId));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-foreground">My Favorites</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            {likedApartments.length} apartment{likedApartments.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {likedApartments.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Start swiping to find apartments you love!
            </p>
            <Button onClick={() => navigate("/swipe")}>
              Start Swiping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {likedApartments.map((apartment) => (
              <Card 
                key={apartment.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div 
                      className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                      onClick={() => navigate(`/apartment/${apartment.id}`)}
                    >
                      <img
                        src={apartment.image_urls[0]}
                        alt={apartment.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 
                          className="font-semibold text-foreground truncate cursor-pointer"
                          onClick={() => navigate(`/apartment/${apartment.id}`)}
                        >
                          {apartment.title}
                        </h3>
                        <div className="flex items-center gap-2 ml-2">
                          <Badge variant="secondary" className="flex-shrink-0">
                            {apartment.room_type}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromFavorites(apartment.id)}
                            className="p-1 h-auto text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="text-sm">{apartment.address}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">
                          ₪{apartment.price.toLocaleString()}/mo
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/apartment/${apartment.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;