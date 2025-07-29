import { useState, useEffect } from "react";
import { MapPin, Filter, Search, ChevronUp, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apartmentsApi, institutionsApi } from "@/services/api";
import Map from "@/components/Map";
import MapMarkerOverlay from "@/components/MapMarkerOverlay";
import MapControls from "@/components/MapControls";
import { useAuth } from "@/contexts/AuthContext";
import { POIType } from "@/services/maps";
import type { Apartment, Institution } from "@/services/api";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [showMarkerOverlay, setShowMarkerOverlay] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<Institution | null>(null);
  const [showPOIs, setShowPOIs] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [showApartments, setShowApartments] = useState(false);
  const [enabledPOITypes, setEnabledPOITypes] = useState<POIType[]>(['supermarket', 'restaurant', 'transit_station']);
  const [directions, setDirections] = useState<{
    duration: string;
    distance: string;
    steps: google.maps.DirectionsStep[];
  } | null>(null);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Debug logging
  useEffect(() => {
    console.log("🏠 Home component mounted");
    console.log("🔧 Environment check:", {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? "Set" : "Not set"
    });
  }, []);

  // Fetch apartments and institutions
  const { 
    data: apartments = [], 
    isLoading: apartmentsLoading, 
    error: apartmentsError 
  } = useQuery({
    queryKey: ['apartments'],
    queryFn: apartmentsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const { 
    data: institutions = [], 
    isLoading: institutionsLoading,
    error: institutionsError 
  } = useQuery({
    queryKey: ['institutions'],
    queryFn: institutionsApi.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  // Debug logging for queries
  useEffect(() => {
    console.log("📊 Query status:", {
      apartmentsLoading,
      apartmentsError: apartmentsError?.message,
      apartmentsCount: apartments.length,
      institutionsLoading,
      institutionsError: institutionsError?.message,
      institutionsCount: institutions.length
    });
  }, [apartmentsLoading, apartmentsError, apartments.length, institutionsLoading, institutionsError, institutions.length]);

  const filteredApartments = apartments.filter(apartment =>
    apartment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apartment.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApartmentClick = (apartment: Apartment, event?: MouseEvent) => {
    console.log("🏠 Home - Apartment clicked:", apartment.title);
    console.log("🏠 Home - Event position:", event?.clientX, event?.clientY);
    
    setSelectedApartment(apartment);
    setShowMarkerOverlay(true);
    
    // Capture click position for overlay positioning
    if (event) {
      setMarkerPosition({ x: event.clientX, y: event.clientY });
      console.log("🏠 Home - Set marker position:", event.clientX, event.clientY);
    } else {
      // Fallback to center if no event provided
      setMarkerPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      console.log("🏠 Home - Set fallback position");
    }
    
    // Enable POIs and directions when an apartment is selected
    setShowPOIs(true);
    setShowDirections(true);
  };

  const handleInstitutionClick = (institution: Institution) => {
    // You can add institution-specific functionality here
    console.log('Institution clicked:', institution.name);
  };

  // Show error state if both queries fail
  if (apartmentsError && institutionsError) {
    console.error("❌ Both queries failed:", { apartmentsError, institutionsError });
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-xl font-semibold mb-2">Unable to load data</h2>
          <p className="text-muted-foreground mb-4">
            There was an error loading the apartments. Please check your connection and try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (apartmentsLoading || institutionsLoading) {
    console.log("⏳ Loading state");
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading apartments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Floating Header */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4 pointer-events-none">
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border rounded-lg shadow-lg pointer-events-auto">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-bold text-foreground">Campus Swipe</h1>
              {authLoading ? (
                <span className="text-sm text-muted-foreground">Loading...</span>
              ) : user ? (
                <span className="text-sm text-muted-foreground">Welcome, {user.email}</span>
              ) : (
                <a href="/login" className="text-sm text-primary hover:underline">Sign in</a>
              )}
            </div>
            
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search apartments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <Button
                variant={showOverlay ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOverlay(!showOverlay)}
                className="flex-1"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {showOverlay ? "Hide Panel" : "Show Panel"}
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Map */}
      <div className="relative h-screen w-full">
        <Map
          apartments={showApartments ? filteredApartments : []}
          institutions={institutions}
          selectedApartment={selectedApartment}
          selectedUniversity={selectedUniversity}
          showPOIs={showPOIs}
          showDirections={showDirections}
          enabledPOITypes={enabledPOITypes}
          height="100vh"
          className="w-full h-full"
          onMarkerClick={handleApartmentClick}
          onInstitutionClick={handleInstitutionClick}
          onPOIClick={(poi) => console.log('📍 POI clicked:', poi)}
          onDirectionsUpdate={setDirections}
        />
        
        {/* Backdrop Overlay */}
        {showOverlay && (
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setShowOverlay(false)}
          />
        )}
        
        {/* Floating Overlay from Left */}
        <div className={`absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-background/95 backdrop-blur border-r border-border shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          showOverlay ? 'translate-x-0' : '-translate-x-full'
        }`}>
            {/* Overlay Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">Apartments</h3>
                <Badge variant="secondary">{filteredApartments.length}</Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOverlay(false)}
                className="hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Search in Overlay */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search apartments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Overlay Content */}
            <div className="overflow-y-auto h-[calc(100vh-140px)]">
              {/* Map Controls */}
              <div className="p-4 border-b border-border">
                <MapControls
                  institutions={institutions}
                  selectedApartment={selectedApartment}
                  selectedUniversity={selectedUniversity}
                  onUniversitySelect={setSelectedUniversity}
                  showPOIs={showPOIs}
                  onTogglePOIs={setShowPOIs}
                  showApartments={showApartments}
                  onToggleApartments={setShowApartments}
                  enabledPOITypes={enabledPOITypes}
                  onTogglePOIType={(type, enabled) => {
                    if (enabled) {
                      setEnabledPOITypes(prev => [...prev, type]);
                    } else {
                      setEnabledPOITypes(prev => prev.filter(t => t !== type));
                    }
                  }}
                  directions={directions}
                />
              </div>

              {/* Apartments List */}
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-3">Available Apartments ({filteredApartments.length})</h3>
                {filteredApartments.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">
                      {searchTerm ? 'No apartments found matching your search.' : 'No apartments available at the moment.'}
                    </p>
                    {apartmentsError && (
                      <p className="text-sm text-destructive mt-2">
                        Error loading apartments. Please try again later.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredApartments.map((apartment) => (
                      <Card 
                        key={apartment.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm"
                        onClick={() => navigate(`/apartment/${apartment.id}`)}
                      >
                        <CardContent className="p-3">
                          <div className="flex gap-3">
                            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                              {apartment.image_urls && apartment.image_urls.length > 0 ? (
                                <img
                                  src={apartment.image_urls[0]}
                                  alt={apartment.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <MapPin className="w-4 h-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <h4 className="font-medium text-foreground truncate text-sm">
                                  {apartment.title}
                                </h4>
                                <Badge variant="secondary" className="ml-2 flex-shrink-0 text-xs">
                                  {apartment.room_type}
                                </Badge>
                              </div>
                              
                              <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
                                {apartment.address}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-primary">
                                  ₪{apartment.price.toLocaleString()}/mo
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {apartment.room_type}
                                </span>
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
          </div>
        
        {/* Floating Action Button for Mobile */}
                  <Button
            variant="default"
            size="lg"
            onClick={() => setShowOverlay(!showOverlay)}
            className="fixed bottom-6 left-6 z-30 shadow-lg md:hidden bg-background/95 backdrop-blur"
          >
            <MapPin className="w-5 h-5 mr-2" />
            {showOverlay ? "Hide" : "Listings"}
          </Button>

          {/* Test overlay positioning */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("🧪 Test button clicked");
              if (apartments.length > 0) {
                setSelectedApartment(apartments[0]);
                setShowMarkerOverlay(true);
                setMarkerPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
                console.log("🧪 Test overlay triggered");
              } else {
                console.log("🧪 No apartments available for test");
              }
            }}
            className="fixed bottom-6 right-6 z-30 shadow-lg md:hidden bg-background/95 backdrop-blur"
          >
            Test Overlay
          </Button>

          {/* Toggle Apartments */}
          <Button
            variant={showApartments ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setShowApartments(!showApartments);
              console.log("🏠 Toggle apartments:", !showApartments);
            }}
            className="fixed bottom-20 right-6 z-30 shadow-lg md:hidden bg-background/95 backdrop-blur"
          >
            {showApartments ? "Hide Apartments" : "Show Apartments"}
          </Button>

          {/* Toggle POIs */}
          <Button
            variant={showPOIs ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setShowPOIs(!showPOIs);
              console.log("📍 Toggle POIs:", !showPOIs);
            }}
            className="fixed bottom-32 right-6 z-30 shadow-lg md:hidden bg-background/95 backdrop-blur"
          >
            {showPOIs ? "Hide POIs" : "Show POIs"}
          </Button>

          {/* Test POI functionality */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("🧪 Test POI button clicked");
              if (apartments.length > 0) {
                setSelectedApartment(apartments[0]);
                setShowPOIs(true);
                setShowDirections(true);
                console.log("🧪 Test POI triggered");
              } else {
                console.log("🧪 No apartments available for POI test");
              }
            }}
            className="fixed bottom-44 right-6 z-30 shadow-lg md:hidden bg-background/95 backdrop-blur"
          >
            Test POI
          </Button>

        {/* Map Marker Overlay */}
        <MapMarkerOverlay
          apartment={selectedApartment}
          isVisible={showMarkerOverlay}
          markerPosition={markerPosition}
          onClose={() => {
            setShowMarkerOverlay(false);
            setSelectedApartment(null);
            setMarkerPosition(null);
          }}
        />
      </div>
    </div>
  );
};

export default Home;