import { useEffect, useRef, useState } from 'react';
import { mapsService, POI_TYPES, POIType } from '../services/maps';

interface POIMarkersProps {
  map: google.maps.Map | null;
  google: typeof globalThis.google | null;
  center: { lat: number; lng: number } | null;
  enabledTypes: POIType[];
  radius?: number;
  onPOIClick?: (poi: any) => void;
}

export const POIMarkers = ({ 
  map, 
  google, 
  center, 
  enabledTypes, 
  radius = 1000,
  onPOIClick 
}: POIMarkersProps) => {
  const markersRef = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear existing markers safely
  const clearMarkers = () => {
    if (markersRef.current.length > 0) {
      console.log(`🗑️ Clearing ${markersRef.current.length} POI markers`);
      markersRef.current.forEach(marker => {
        if (marker && marker.map) {
          marker.map = null;
        }
      });
      markersRef.current = [];
    }
  };

  // Load POI markers
  useEffect(() => {
    if (!map || !google || !center || enabledTypes.length === 0) {
      clearMarkers();
      return;
    }

    const loadPOIs = async () => {
      setIsLoading(true);
      setError(null);
      clearMarkers();

      try {
        console.log(`🔍 Loading POIs for types: ${enabledTypes.join(', ')}`);
        
        const pois = await mapsService.searchNearbyPOIs(center, radius, enabledTypes);
        
        if (pois.length === 0) {
          console.log('ℹ️ No POIs found in the specified area');
          return;
        }

        console.log(`✅ Creating ${pois.length} POI markers`);
        const newMarkers: any[] = [];

        pois.forEach(poi => {
          try {
            const poiConfig = POI_TYPES[poi.type];
            
            // Create custom marker element
            const markerElement = document.createElement('div');
            markerElement.innerHTML = `
              <div style="
                width: 28px; 
                height: 28px; 
                background: ${poiConfig.color}; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                color: white;
                font-size: 14px;
                font-weight: bold;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                border: 2px solid white;
                cursor: pointer;
                transition: transform 0.2s ease;
              " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                ${poiConfig.icon}
              </div>
            `;

            const marker = new google.maps.marker.AdvancedMarkerElement({
              position: { lat: poi.lat, lng: poi.lng },
              map,
              title: poi.name,
              content: markerElement
            });

            // Add info window
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div style="padding: 12px; max-width: 250px; font-family: system-ui;">
                  <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: bold; color: ${poiConfig.color};">${poi.name}</h3>
                  <p style="margin: 0; font-size: 14px; color: #666; display: flex; align-items: center; gap: 4px;">
                    <span style="font-size: 16px;">${poiConfig.icon}</span>
                    ${poiConfig.name}
                  </p>
                </div>
              `
            });

            // Add click listeners
            marker.addListener('click', () => {
              console.log(`📍 POI clicked: ${poi.name} (${poi.type})`);
              infoWindow.open(map, marker);
              onPOIClick?.(poi);
            });

            newMarkers.push(marker);
          } catch (err) {
            console.error(`❌ Error creating marker for ${poi.name}:`, err);
          }
        });

        markersRef.current = newMarkers;
        console.log(`✅ Successfully added ${newMarkers.length} POI markers`);

      } catch (err) {
        console.error('❌ Error loading POIs:', err);
        setError(err instanceof Error ? err.message : 'Failed to load POIs');
      } finally {
        setIsLoading(false);
      }
    };

    loadPOIs();

    // Cleanup on unmount
    return () => {
      clearMarkers();
    };
  }, [map, google, center, enabledTypes, radius, onPOIClick]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      clearMarkers();
    };
  }, []);

  return null; // This component doesn't render anything visible
}; 