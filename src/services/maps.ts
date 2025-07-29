import { Loader } from '@googlemaps/js-api-loader';

// You'll need to get a Google Maps API key from Google Cloud Console
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

let google: typeof globalThis.google | null = null;
let markerLibrary: any = null;

export const mapsService = {
  // Initialize Google Maps
  async init() {
    if (google && markerLibrary) return google;

    console.log("🗺️ MapsService - Initializing Google Maps...");
    console.log("🗺️ MapsService - API Key check:", {
      hasKey: !!GOOGLE_MAPS_API_KEY,
      keyLength: GOOGLE_MAPS_API_KEY.length,
      keyPreview: GOOGLE_MAPS_API_KEY.substring(0, 10) + "..."
    });

    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key is not set. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
    }

    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry', 'marker']
    });

    try {
      console.log("🗺️ MapsService - Loading Google Maps API...");
      google = await loader.load();
      
      // Load the marker library
      console.log("🗺️ MapsService - Loading marker library...");
      markerLibrary = await google.maps.importLibrary("marker");
      
      console.log("✅ MapsService - Google Maps API and marker library loaded successfully");
      return google;
    } catch (error) {
      console.error('❌ MapsService - Failed to load Google Maps:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('Invalid Google Maps API key. Please check your API key in the .env file.');
        } else if (error.message.includes('quota') || error.message.includes('Quota')) {
          throw new Error('Google Maps API quota exceeded. Please check your billing settings or try again later.');
        } else if (error.message.includes('network')) {
          throw new Error('Network error loading Google Maps. Please check your internet connection.');
        }
      }
      
      throw new Error(`Failed to load Google Maps: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Create a map instance
  createMap(element: HTMLElement, options: google.maps.MapOptions = {}) {
    if (!google) {
      throw new Error('Google Maps not initialized. Call mapsService.init() first.');
    }

    const defaultOptions: google.maps.MapOptions = {
      center: { lat: 32.794167, lng: 34.989167 }, // Haifa center
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapId: 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
      // Note: styles are managed via Google Cloud Console when using mapId
      ...options
    };

    return new google.maps.Map(element, defaultOptions);
  },

  // Add markers to map using AdvancedMarkerElement
  addMarkers(map: google.maps.Map, locations: Array<{
    lat: number;
    lng: number;
    title?: string;
    icon?: string;
    infoWindow?: string;
  }>) {
    if (!google || !markerLibrary) {
      throw new Error('Google Maps not initialized');
    }

    return locations.map(location => {
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

      const marker = new markerLibrary.AdvancedMarkerElement({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.title,
        content: markerElement
      });

      if (location.infoWindow) {
        const infoWindow = new google.maps.InfoWindow({
          content: location.infoWindow
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      }

      return marker;
    });
  },

  // Geocode address to coordinates
  async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    if (!google) {
      await this.init();
    }

    const geocoder = new google!.maps.Geocoder();

    try {
      const result = await geocoder.geocode({ address });
      if (result.results.length > 0) {
        const location = result.results[0].geometry.location;
        return {
          lat: location.lat(),
          lng: location.lng()
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  },

  // Reverse geocode coordinates to address
  async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    if (!google) {
      await this.init();
    }

    const geocoder = new google!.maps.Geocoder();

    try {
      const result = await geocoder.geocode({
        location: { lat, lng }
      });
      
      if (result.results.length > 0) {
        return result.results[0].formatted_address;
      }
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  },

  // Calculate distance between two points
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    if (!google) {
      throw new Error('Google Maps not initialized');
    }

    const point1 = new google.maps.LatLng(lat1, lng1);
    const point2 = new google.maps.LatLng(lat2, lng2);
    
    return google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
  },

  // Get directions between two points
  async getDirections(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ): Promise<google.maps.DirectionsResult | null> {
    if (!google) {
      await this.init();
    }

    const directionsService = new google!.maps.DirectionsService();

    try {
      const result = await directionsService.route({
        origin: new google!.maps.LatLng(origin.lat, origin.lng),
        destination: new google!.maps.LatLng(destination.lat, destination.lng),
        travelMode: google!.maps.TravelMode.TRANSIT
      });

      return result;
    } catch (error) {
      console.error('Directions error:', error);
      return null;
    }
  },

  // Note: Map styles are now managed via Google Cloud Console when using mapId
  // This method is kept for backward compatibility but not used with AdvancedMarkerElement
  getCustomMapStyle(): google.maps.MapTypeStyle[] {
    return [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ];
  }
}; 