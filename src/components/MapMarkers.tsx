import { useEffect, useRef } from 'react';
import type { Apartment, Institution } from '@/services/api';

interface MapMarkersProps {
  map: google.maps.Map | null;
  apartments: Apartment[];
  institutions: Institution[];
  onMarkerClick?: (apartment: Apartment) => void;
  onInstitutionClick?: (institution: Institution) => void;
}

const MapMarkers = ({ 
  map, 
  apartments, 
  institutions, 
  onMarkerClick, 
  onInstitutionClick 
}: MapMarkersProps) => {
  const markersRef = useRef<any[]>([]);

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

  // Add markers to map
  useEffect(() => {
    if (!map || !google) return;

    console.log("📍 MapMarkers - Adding markers to map...");

    // Clear existing markers safely
    clearMarkers();

    const newMarkers: any[] = [];

    try {
      // Add apartment markers
      apartments.forEach(apartment => {
        console.log("📍 Adding apartment marker:", apartment.title, "at", apartment.lat, apartment.lng);
        
        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.innerHTML = `
          <div style="
            width: 32px; 
            height: 32px; 
            background: #3B82F6; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            color: white;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">
            🏠
          </div>
        `;
        
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: { lat: apartment.lat, lng: apartment.lng },
          map,
          title: apartment.title,
          content: markerElement
        });

        // Add click listener
        marker.addListener('click', () => {
          console.log("📍 Apartment marker clicked:", apartment.title);
          onMarkerClick?.(apartment);
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">${apartment.title}</h3>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${apartment.address}</p>
              <p style="margin: 0; font-size: 14px; font-weight: bold; color: #3B82F6;">₪${apartment.price.toLocaleString()}/mo</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        newMarkers.push(marker);
      });

      // Add institution markers
      institutions.forEach(institution => {
        console.log("🏫 Adding institution marker:", institution.name, "at", institution.lat, institution.lng);
        
        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.innerHTML = `
          <div style="
            width: 32px; 
            height: 32px; 
            background: #10B981; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            color: white;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">
            🏫
          </div>
        `;
        
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: { lat: institution.lat, lng: institution.lng },
          map,
          title: institution.name,
          content: markerElement
        });

        // Add click listener
        marker.addListener('click', () => {
          console.log("🏫 Institution marker clicked:", institution.name);
          onInstitutionClick?.(institution);
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0; font-size: 14px; font-weight: bold; color: #10B981;">${institution.name}</h3>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        newMarkers.push(marker);
      });

      markersRef.current = newMarkers;
      console.log(`✅ Added ${newMarkers.length} markers to map`);
    } catch (err) {
      console.error('❌ Error adding markers:', err);
    }
  }, [map, apartments, institutions, onMarkerClick, onInstitutionClick]);

  // Cleanup on unmount with additional safety checks
  useEffect(() => {
    return () => {
      console.log("🧹 MapMarkers - Cleaning up on unmount");
      clearMarkers();
    };
  }, []);



  // This component doesn't render anything visible
  return null;
};

export default MapMarkers; 