import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin } from 'lucide-react';
import { mapsService, POIType } from '@/services/maps';
import MapMarkers from './MapMarkers';
import { POIMarkers } from './POIMarkers';
import type { Apartment, Institution } from '@/services/api';

interface MapProps {
  apartments?: Apartment[];
  institutions?: Institution[];
  selectedApartment?: Apartment | null;
  selectedUniversity?: Institution | null;
  showPOIs?: boolean;
  showDirections?: boolean;
  enabledPOITypes?: POIType[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onMarkerClick?: (apartment: Apartment, event?: MouseEvent) => void;
  onInstitutionClick?: (institution: Institution) => void;
  onPOIClick?: (poi: any) => void;
  onDirectionsUpdate?: (directions: {
    duration: string;
    distance: string;
    steps: google.maps.DirectionsStep[];
  } | null) => void;
  className?: string;
}

export default function Map({
  apartments = [],
  institutions = [],
  selectedApartment = null,
  selectedUniversity = null,
  showPOIs = false,
  showDirections = false,
  enabledPOITypes = [],
  center = { lat: 32.794167, lng: 34.989167 }, // Haifa center
  zoom = 12,
  height = '400px',
  onMarkerClick,
  onInstitutionClick,
  onPOIClick,
  onDirectionsUpdate,
  className = ''
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("🗺️ Map component - Starting initialization...");
        
        // Check API key first
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          throw new Error('Google Maps API key is not set. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
        }

        console.log("🗺️ Map component - API key found, initializing maps service...");
        await mapsService.init();
        
        if (!mapRef.current) {
          console.error("❌ Map container not found");
          setError("Map container not found");
          return;
        }

        console.log("🗺️ Map component - Creating map instance...");
        const mapInstance = mapsService.createMap(mapRef.current, {
          center,
          zoom,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          scrollwheel: true,
          gestureHandling: 'greedy'
        });

        setMap(mapInstance);
        console.log("✅ Map component - Map created successfully");
        console.log("✅ Map component - Clean styles applied");
      } catch (err) {
        console.error('❌ Map component - Failed to initialize map:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Failed to load map: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    initMap();
  }, [center.lat, center.lng, zoom]);

  if (error) {
    return (
      <div className={className}>
        <div className="p-6 text-center bg-background border rounded-lg">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Map Unavailable</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="space-y-2 text-sm text-left bg-muted p-3 rounded">
            <p><strong>Troubleshooting:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check your Google Maps API key</li>
              <li>Ensure the API key has Maps JavaScript API enabled</li>
              <li>Check your internet connection</li>
              <li>Try refreshing the page</li>
            </ul>
          </div>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div 
        ref={mapRef} 
        style={{ height }}
        className="relative w-full"
      >
        {isLoading && (
          <div className="absolute inset-0 bg-muted/50 flex items-center justify-center z-10">
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading map...</span>
            </div>
          </div>
        )}
        
        {/* Declarative markers component */}
        <MapMarkers
          map={map}
          apartments={apartments}
          institutions={institutions}
          selectedApartment={selectedApartment}
          selectedUniversity={selectedUniversity}
          showPOIs={showPOIs}
          showDirections={showDirections}
          onMarkerClick={onMarkerClick}
          onInstitutionClick={onInstitutionClick}
          onDirectionsUpdate={onDirectionsUpdate}
        />

        {/* POI Markers component */}
        {showPOIs && enabledPOITypes.length > 0 && (
          <POIMarkers
            map={map}
            google={mapsService.getGoogle()}
            center={center}
            enabledTypes={enabledPOITypes}
            radius={1000}
            onPOIClick={onPOIClick}
          />
        )}
      </div>
    </div>
  );
} 