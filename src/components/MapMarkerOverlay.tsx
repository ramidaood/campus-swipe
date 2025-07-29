import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Users, X, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Apartment } from '@/services/api';

interface MapMarkerOverlayProps {
  apartment: Apartment | null;
  isVisible: boolean;
  onClose: () => void;
  markerPosition?: { x: number; y: number };
}

const MapMarkerOverlay = ({ apartment, isVisible, onClose, markerPosition }: MapMarkerOverlayProps) => {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  console.log("🎯 MapMarkerOverlay - Props:", {
    apartment: apartment?.title,
    isVisible,
    markerPosition
  });

  if (!apartment || !isVisible) return null;

  const handleViewDetails = () => {
    navigate(`/apartment/${apartment.id}`);
    onClose();
  };

  // Calculate position based on marker or default to center
  const getPosition = () => {
    if (markerPosition) {
      console.log("🎯 MapMarkerOverlay - Positioning at:", markerPosition.x, markerPosition.y);
      return {
        left: `${markerPosition.x}px`,
        top: `${markerPosition.y}px`,
        transform: 'translate(-50%, -100%) translateY(-10px)'
      };
    }
    console.log("🎯 MapMarkerOverlay - Using center position");
    return {
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    };
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Overlay Card - positioned at marker or center */}
      <div 
        ref={overlayRef}
        className={`absolute pointer-events-auto transition-all duration-300 ease-out ${
          isMinimized ? 'w-12 h-12' : 'w-full max-w-md'
        }`}
        style={getPosition()}
      >
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute -top-8 left-0 bg-red-500 text-white text-xs p-1 rounded">
            Debug: {markerPosition ? `${markerPosition.x}, ${markerPosition.y}` : 'center'}
          </div>
        )}
        <Card className={`bg-background border shadow-xl transition-all duration-300 ${
          isMinimized ? 'w-12 h-12 rounded-full overflow-hidden' : 'w-full'
        }`}>
          <CardContent className="p-0">
            {isMinimized ? (
              /* Minimized state - just a small circular button */
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(false)}
                className="w-12 h-12 rounded-full p-0 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Eye className="w-5 h-5" />
              </Button>
            ) : (
              /* Full overlay content */
              <>
                {/* Header with controls */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Apartment Details</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(true)}
                      className="h-8 w-8 p-0"
                      title="Minimize"
                    >
                      <EyeOff className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-48 bg-muted overflow-hidden">
                  {apartment.image_urls && apartment.image_urls.length > 0 ? (
                    <img
                      src={apartment.image_urls[0]}
                      alt={apartment.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                      {apartment.room_type}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Title and Price */}
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg text-foreground line-clamp-2">
                      {apartment.title}
                    </h3>
                    <span className="text-lg font-bold text-primary ml-2 flex-shrink-0">
                      ₪{apartment.price.toLocaleString()}/mo
                    </span>
                  </div>

                  {/* Address */}
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {apartment.address}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {apartment.description}
                  </p>

                  {/* Features */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{apartment.room_type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-primary font-medium">
                        ₪{apartment.price.toLocaleString()}/mo
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={handleViewDetails}
                    className="w-full"
                    size="lg"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapMarkerOverlay; 