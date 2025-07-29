import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Users, X, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Apartment } from '@/services/api';

interface MapMarkerOverlayProps {
  apartment: Apartment | null;
  isVisible: boolean;
  onClose: () => void;
}

const MapMarkerOverlay = ({ apartment, isVisible, onClose }: MapMarkerOverlayProps) => {
  const navigate = useNavigate();

  if (!apartment || !isVisible) return null;

  const handleViewDetails = () => {
    navigate(`/apartment/${apartment.id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Overlay Card */}
      <Card className="w-full max-w-md bg-background/95 backdrop-blur border shadow-xl pointer-events-auto transform transition-all duration-300 ease-out">
        <CardContent className="p-0">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Apartment Details</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default MapMarkerOverlay; 