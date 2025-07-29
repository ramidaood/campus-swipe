import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { apartmentsApi, institutionsApi } from '@/services/api';
import Map from '@/components/Map';
import MapControls from '@/components/MapControls';
import type { Apartment, Institution } from '@/services/api';

const EnhancedMapTest = () => {
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<Institution | null>(null);
  const [showPOIs, setShowPOIs] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [directions, setDirections] = useState<{
    duration: string;
    distance: string;
    steps: google.maps.DirectionsStep[];
  } | null>(null);

  // Fetch data
  const { data: apartments = [], error: apartmentsError } = useQuery({
    queryKey: ['apartments'],
    queryFn: apartmentsApi.getAll
  });

  const { data: institutions = [], error: institutionsError } = useQuery({
    queryKey: ['institutions'],
    queryFn: institutionsApi.getAll
  });

  const handleApartmentClick = (apartment: Apartment) => {
    console.log('🏠 Apartment clicked:', apartment.title);
    setSelectedApartment(apartment);
    setShowPOIs(true);
    setShowDirections(true);
  };

  const handleInstitutionClick = (institution: Institution) => {
    console.log('🏫 Institution clicked:', institution.name);
    setSelectedUniversity(institution);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Map Section */}
        <div className="flex-1 relative">
          <Map
            apartments={apartments}
            institutions={institutions}
            selectedApartment={selectedApartment}
            selectedUniversity={selectedUniversity}
            showPOIs={showPOIs}
            showDirections={showDirections}
            height="100vh"
            className="w-full h-full"
            onMarkerClick={handleApartmentClick}
            onInstitutionClick={handleInstitutionClick}
            onDirectionsUpdate={setDirections}
          />
        </div>

        {/* Controls Panel */}
        <div className="w-80 bg-background border-l border-border overflow-y-auto">
          <div className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🧪 Enhanced Map Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Test Features:</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✅ Full-screen interactive map</li>
                    <li>✅ Clean map styling (no POI clutter)</li>
                    <li>✅ Advanced marker elements</li>
                    <li>✅ Nearby POI search</li>
                    <li>✅ Transit directions</li>
                    <li>✅ POI type filtering</li>
                    <li>✅ University selection</li>
                    <li>✅ Real-time directions updates</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Instructions:</h3>
                  <ol className="text-sm space-y-1 text-muted-foreground">
                    <li>1. Click on an apartment marker (🏠)</li>
                    <li>2. Toggle "Show nearby places" to see POIs</li>
                    <li>3. Select a university from dropdown</li>
                    <li>4. View transit directions and travel time</li>
                    <li>5. Filter POI types with checkboxes</li>
                  </ol>
                </div>

                {selectedApartment && (
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Selected Apartment:</h4>
                    <p className="text-sm">{selectedApartment.title}</p>
                    <p className="text-xs text-muted-foreground">{selectedApartment.address}</p>
                  </div>
                )}

                {directions && (
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Directions:</h4>
                    <div className="space-y-1 text-sm">
                      <p>⏱️ Duration: {directions.duration}</p>
                      <p>📏 Distance: {directions.distance}</p>
                      <p>🚌 Mode: Public Transit</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Map Controls */}
            <MapControls
              institutions={institutions}
              selectedApartment={selectedApartment}
              selectedUniversity={selectedUniversity}
              onUniversitySelect={setSelectedUniversity}
              showPOIs={showPOIs}
              onTogglePOIs={setShowPOIs}
              directions={directions}
            />

            {/* Data Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Data Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Apartments</span>
                  <Badge variant={apartmentsError ? "destructive" : "default"}>
                    {apartments.length} loaded
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Institutions</span>
                  <Badge variant={institutionsError ? "destructive" : "default"}>
                    {institutions.length} loaded
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">POIs Enabled</span>
                  <Badge variant={showPOIs ? "default" : "secondary"}>
                    {showPOIs ? "ON" : "OFF"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Directions</span>
                  <Badge variant={showDirections ? "default" : "secondary"}>
                    {showDirections ? "ON" : "OFF"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMapTest; 