import { useEffect, useRef, useState } from 'react';
import type { Apartment, Institution } from '@/services/api';
import { mapsService, POI_TYPES, type POIType } from '@/services/maps';

interface MapMarkersProps {
  map: google.maps.Map | null;
  apartments: Apartment[];
  institutions: Institution[];
  selectedApartment: Apartment | null;
  selectedUniversity: Institution | null;
  showPOIs: boolean;
  showDirections: boolean;
  onMarkerClick?: (apartment: Apartment, event?: MouseEvent) => void;
  onInstitutionClick?: (institution: Institution) => void;
  onDirectionsUpdate?: (directions: {
    duration: string;
    distance: string;
    steps: google.maps.DirectionsStep[];
  } | null) => void;
}

const MapMarkers = ({ 
  map, 
  apartments, 
  institutions, 
  selectedApartment,
  selectedUniversity,
  showPOIs,
  showDirections,
  onMarkerClick, 
  onInstitutionClick,
  onDirectionsUpdate
}: MapMarkersProps) => {
  const markersRef = useRef<any[]>([]);
  const poiMarkersRef = useRef<any[]>([]);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [nearbyPOIs, setNearbyPOIs] = useState<Array<{
    lat: number;
    lng: number;
    name: string;
    type: POIType;
    placeId?: string;
  }>>([]);

  // Clear all markers with conditional checks
  const clearMarkers = () => {
    markersRef.current.forEach(marker => {
      try {
        // Check if marker exists and is still attached to a map
        if (marker && marker.map && marker.position) {
          console.log("🗑️ Clearing marker:", marker.title || 'unknown');
          marker.map = null; // Safe removal for AdvancedMarkerElement
        }
      } catch (error) {
        console.warn("⚠️ Error clearing marker:", error);
      }
    });
    markersRef.current = [];
  };

  // Clear POI markers
  const clearPOIMarkers = () => {
    poiMarkersRef.current.forEach(marker => {
      try {
        if (marker && marker.map && marker.position) {
          console.log("🗑️ Clearing POI marker:", marker.title || 'unknown');
          marker.map = null;
        }
      } catch (error) {
        console.warn("⚠️ Error clearing POI marker:", error);
      }
    });
    poiMarkersRef.current = [];
  };

  // Clear directions
  const clearDirections = () => {
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }
  };

  // Search for nearby POIs when apartment is selected
  useEffect(() => {
    if (!map || !selectedApartment || !showPOIs) {
      clearPOIMarkers();
      setNearbyPOIs([]);
      return;
    }

    const searchPOIs = async () => {
      try {
        console.log("🔍 Searching for nearby POIs around:", selectedApartment.title);
        console.log("🔍 Location:", selectedApartment.lat, selectedApartment.lng);
        const pois = await mapsService.searchNearbyPOIs(
          { lat: selectedApartment.lat, lng: selectedApartment.lng },
          1000 // 1km radius
        );
        console.log("🔍 POI search results:", pois);
        setNearbyPOIs(pois);
        console.log(`✅ Found ${pois.length} nearby POIs`);
      } catch (error) {
        console.warn("⚠️ Error searching for POIs:", error);
        setNearbyPOIs([]);
      }
    };

    searchPOIs();
  }, [map, selectedApartment, showPOIs]);

  // Add POI markers when nearby POIs change
  useEffect(() => {
    if (!map || !showPOIs || nearbyPOIs.length === 0) {
      clearPOIMarkers();
      return;
    }

    console.log("📍 Adding POI markers to map...");
    console.log("📍 POIs to add:", nearbyPOIs);
    clearPOIMarkers();

    try {
      const newPOIMarkers = mapsService.addPOIMarkers(map, nearbyPOIs);
      poiMarkersRef.current = newPOIMarkers;
      console.log(`✅ Added ${newPOIMarkers.length} POI markers to map`);
    } catch (error) {
      console.error('❌ Error adding POI markers:', error);
    }
  }, [map, nearbyPOIs, showPOIs]);

  // Get directions when apartment and university are selected
  useEffect(() => {
    if (!map || !selectedApartment || !selectedUniversity || !showDirections) {
      clearDirections();
      onDirectionsUpdate?.(null);
      return;
    }

    const getDirections = async () => {
      try {
        console.log("🗺️ Getting directions from", selectedApartment.title, "to", selectedUniversity.name);
        
        const directions = await mapsService.getDirections(
          { lat: selectedApartment.lat, lng: selectedApartment.lng },
          { lat: selectedUniversity.lat, lng: selectedUniversity.lng }
        );

        // Render directions on map
        clearDirections();
        const directionsRenderer = mapsService.renderDirections(map, {
          routes: [directions.route!],
          request: {
            origin: { lat: selectedApartment.lat, lng: selectedApartment.lng },
            destination: { lat: selectedUniversity.lat, lng: selectedUniversity.lng },
            travelMode: google.maps.TravelMode.TRANSIT
          }
        });
        directionsRendererRef.current = directionsRenderer;

        // Update UI with directions info
        onDirectionsUpdate?.({
          duration: directions.duration,
          distance: directions.distance,
          steps: directions.steps
        });

        console.log(`✅ Directions: ${directions.duration} (${directions.distance})`);
      } catch (error) {
        console.warn("⚠️ Error getting directions:", error);
        onDirectionsUpdate?.(null);
      }
    };

    getDirections();
  }, [map, selectedApartment, selectedUniversity, showDirections, onDirectionsUpdate]);

  // Add apartment and institution markers to map (only when explicitly requested)
  useEffect(() => {
    if (!map || !google) return;

    console.log("📍 MapMarkers - Adding markers to map...");

    // Clear existing markers safely
    clearMarkers();

    const newMarkers: any[] = [];

    try {
      // Only add apartment markers if showApartments is true (we'll add this prop later)
      // For now, let's not add any apartment markers to keep the map clean
      console.log("📍 Skipping apartment markers for clean map view");

      // Only add institution markers if showInstitutions is true
      // For now, let's not add any institution markers to keep the map clean
      console.log("📍 Skipping institution markers for clean map view");

      markersRef.current = newMarkers;
      console.log(`✅ Added ${newMarkers.length} markers to map (clean view)`);
    } catch (err) {
      console.error('❌ Error adding markers:', err);
    }
  }, [map, apartments, institutions, onMarkerClick, onInstitutionClick]);

  // Cleanup on unmount with additional safety checks
  useEffect(() => {
    return () => {
      console.log("🧹 MapMarkers - Cleaning up on unmount");
      clearMarkers();
      clearPOIMarkers();
      clearDirections();
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default MapMarkers; 