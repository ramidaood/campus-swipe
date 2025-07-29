import { Loader } from '@googlemaps/js-api-loader';

// You'll need to get a Google Maps API key from Google Cloud Console
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

let google: typeof globalThis.google | null = null;
let markerLibrary: any = null;

// Expose google object for components that need it
export const getGoogle = () => google;

// POI Types and their icons
export const POI_TYPES = {
  supermarket: { icon: '🛒', color: '#10B981', name: 'Supermarket' },
  gym: { icon: '💪', color: '#F59E0B', name: 'Gym' },
  restaurant: { icon: '🍽️', color: '#EF4444', name: 'Restaurant' },
  transit_station: { icon: '🚌', color: '#8B5CF6', name: 'Bus Stop' }
} as const;

export type POIType = keyof typeof POI_TYPES;

export const mapsService = {
  // Get the google object
  getGoogle() {
    return google;
  },

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

  // Create a map instance with clean styling
  createMap(element: HTMLElement, options: google.maps.MapOptions = {}) {
    if (!google) {
      throw new Error('Google Maps not initialized. Call mapsService.init() first.');
    }

    // Try to use custom map ID, fallback to programmatic styles
    const useCustomMapId = true; // Set to false to use programmatic styles instead
    
    const defaultOptions: google.maps.MapOptions = {
      center: { lat: 32.794167, lng: 34.989167 }, // Haifa center
      zoom: 12,
      styles: this.getCleanMapStyle(), // Fallback to programmatic styles
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      ...(useCustomMapId ? {
        mapId: 'Clean_Map', // Custom map style from Google Cloud Console
        // Note: When using mapId, styles are managed via Google Cloud Console
      } : {
        styles: this.getCleanMapStyle(), // Fallback to programmatic styles
      }),
      ...options
    };

    console.log('🗺️ Creating map with options:', {
      useCustomMapId,
      mapId: useCustomMapId ? 'Clean_Map' : undefined,
      hasStyles: !useCustomMapId
    });

    const map = new google.maps.Map(element, defaultOptions);
    
    // Log map creation success
    console.log('✅ Map created successfully with', useCustomMapId ? 'custom map ID' : 'programmatic styles');
    
    return map;
  },

  // Add apartment markers to map using AdvancedMarkerElement
  addApartmentMarkers(map: google.maps.Map, apartments: Array<{
    lat: number;
    lng: number;
    title: string;
    infoWindow?: string;
  }>) {
    if (!google || !markerLibrary) {
      throw new Error('Google Maps not initialized');
    }

    return apartments.map(apartment => {
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
        position: { lat: apartment.lat, lng: apartment.lng },
        map,
        title: apartment.title,
        content: markerElement
      });

      if (apartment.infoWindow) {
        const infoWindow = new google.maps.InfoWindow({
          content: apartment.infoWindow
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      }

      return marker;
    });
  },

  // Add POI markers to map
  addPOIMarkers(map: google.maps.Map, pois: Array<{
    lat: number;
    lng: number;
    name: string;
    type: POIType;
    placeId?: string;
  }>) {
    if (!google || !markerLibrary) {
      throw new Error('Google Maps not initialized');
    }

    return pois.map(poi => {
      const poiConfig = POI_TYPES[poi.type];
      
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.innerHTML = `
        <div style="
          width: 24px; 
          height: 24px; 
          background: ${poiConfig.color}; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          ${poiConfig.icon}
        </div>
      `;

      const marker = new markerLibrary.AdvancedMarkerElement({
        position: { lat: poi.lat, lng: poi.lng },
        map,
        title: poi.name,
        content: markerElement
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold; color: ${poiConfig.color};">${poi.name}</h3>
            <p style="margin: 0; font-size: 12px; color: #666;">${poiConfig.name}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      return marker;
    });
  },

  // Search for nearby POIs with enhanced error handling and duplicate prevention
  async searchNearbyPOIs(
    location: google.maps.LatLngLiteral, 
    radius: number = 1000,
    types: POIType[] = ['supermarket', 'restaurant', 'transit_station']
  ): Promise<{
    lat: number;
    lng: number;
    name: string;
    type: POIType;
    placeId?: string;
  }[]> {
    if (!google) {
      throw new Error('Google Maps not initialized');
    }

    // Create a temporary div for PlacesService (required by Google Maps API)
    const tempDiv = document.createElement('div');
    const service = new google.maps.places.PlacesService(tempDiv);
    const pois: any[] = [];
    const seenPlaceIds = new Set<string>(); // Prevent duplicates

    console.log(`🔍 Searching for POIs: ${types.join(', ')} near`, location, `radius: ${radius}m`);

    for (const type of types) {
      try {
        console.log(`🔍 Searching for ${type}...`);
        
        const results = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
          const searchRequest: google.maps.places.PlaceSearchRequest = {
            location,
            radius,
            type: type as any, // Type assertion for Places API compatibility
            rankBy: google.maps.places.RankBy.DISTANCE
          };

          service.nearbySearch(searchRequest, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              console.log(`✅ Found ${results.length} ${type} places`);
              resolve(results);
            } else {
              console.warn(`⚠️ No ${type} found or error:`, status);
              resolve([]);
            }
          });
        });

        // Filter out duplicates and add to results
        const uniqueResults = results.filter(place => {
          if (!place.place_id || seenPlaceIds.has(place.place_id)) {
            return false;
          }
          seenPlaceIds.add(place.place_id);
          return true;
        });

        pois.push(...uniqueResults.map(place => ({
          lat: place.geometry?.location?.lat() || 0,
          lng: place.geometry?.location?.lng() || 0,
          name: place.name || '',
          type,
          placeId: place.place_id
        })));

      } catch (error) {
        console.error(`❌ Error searching for ${type}:`, error);
      }
    }

    console.log(`✅ Total unique POIs found: ${pois.length}`);
    return pois;
  },

  // Get directions between two points with transit mode
  async getDirections(
    origin: google.maps.LatLngLiteral,
    destination: google.maps.LatLngLiteral,
    mode: google.maps.TravelMode = google.maps.TravelMode.TRANSIT
  ): Promise<{
    route: google.maps.DirectionsRoute | null;
    duration: string;
    distance: string;
    steps: google.maps.DirectionsStep[];
  }> {
    if (!google) {
      throw new Error('Google Maps not initialized');
    }

    const directionsService = new google.maps.DirectionsService();

    try {
      const response = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
        directionsService.route({
          origin,
          destination,
          travelMode: mode,
          transitOptions: {
            modes: [google.maps.TransitMode.BUS, google.maps.TransitMode.TRAIN]
          }
        }, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            resolve(result);
          } else {
            reject(new Error(`Directions request failed: ${status}`));
          }
        });
      });

      const route = response.routes[0];
      const leg = route.legs[0];
      
      return {
        route,
        duration: leg.duration?.text || 'Unknown',
        distance: leg.distance?.text || 'Unknown',
        steps: leg.steps || []
      };
    } catch (error) {
      console.warn('⚠️ Error getting directions:', error);
      throw error;
    }
  },

  // Render directions on map
  renderDirections(
    map: google.maps.Map,
    directionsResult: google.maps.DirectionsResult
  ): google.maps.DirectionsRenderer {
    if (!google) {
      throw new Error('Google Maps not initialized');
    }

    const directionsRenderer = new google.maps.DirectionsRenderer({
      map,
      directions: directionsResult,
      suppressMarkers: true, // Don't show default markers
      polylineOptions: {
        strokeColor: '#3B82F6',
        strokeWeight: 4,
        strokeOpacity: 0.8
      }
    });

    return directionsRenderer;
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

  // Ultra-clean map style - hide ALL POIs and transit for manual control
  getCleanMapStyle(): google.maps.MapTypeStyle[] {
    return [
      // Hide ALL POIs completely
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi.business',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi.medical',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi.school',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi.sports_complex',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi.place_of_worship',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi.government',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      // Hide ALL transit features
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit.station',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit.line',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      // Hide ALL labels
      {
        featureType: 'landscape',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'administrative',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'road',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'water',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      // Simplify other features
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ visibility: 'simplified' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ visibility: 'simplified' }]
      }
    ];
  }
}; 