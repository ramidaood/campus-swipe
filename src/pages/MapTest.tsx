import { useQuery } from "@tanstack/react-query";
import { apartmentsApi, institutionsApi } from "@/services/api";
import Map from "@/components/Map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Apartment, Institution } from "@/services/api";

const MapTest = () => {
  const { 
    data: apartments = [], 
    isLoading: apartmentsLoading, 
    error: apartmentsError 
  } = useQuery({
    queryKey: ['apartments'],
    queryFn: apartmentsApi.getAll,
    retry: 2,
  });

  const { 
    data: institutions = [], 
    isLoading: institutionsLoading, 
    error: institutionsError 
  } = useQuery({
    queryKey: ['institutions'],
    queryFn: institutionsApi.getAll,
    retry: 2,
  });

  const handleApartmentClick = (apartment: Apartment) => {
    console.log("📍 Apartment clicked:", apartment.title);
  };

  const handleInstitutionClick = (institution: Institution) => {
    console.log("🏫 Institution clicked:", institution.name);
  };

  if (apartmentsLoading || institutionsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">🗺️ Map Test - Advanced Markers</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Apartments:</span>
              <Badge variant={apartmentsError ? "destructive" : "default"}>
                {apartmentsError ? "Error" : `${apartments.length} loaded`}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Institutions:</span>
              <Badge variant={institutionsError ? "destructive" : "default"}>
                {institutionsError ? "Error" : `${institutions.length} loaded`}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced Marker Map</CardTitle>
          </CardHeader>
          <CardContent>
            <Map
              apartments={apartments}
              institutions={institutions}
              height="500px"
              onMarkerClick={handleApartmentClick}
              onInstitutionClick={handleInstitutionClick}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✅ <strong>Advanced Marker Implementation:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Uses <code>google.maps.marker.AdvancedMarkerElement</code></li>
              <li>Proper marker cleanup with <code>marker.map = null</code></li>
              <li>Declarative React wrapper prevents DOM mismatches</li>
              <li>Custom marker elements with emoji icons</li>
              <li>Info windows and click handlers working</li>
            </ul>
            
            <p className="mt-4">🔍 <strong>Check Console For:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>No "removeChild" errors</li>
              <li>Marker creation and cleanup logs</li>
              <li>Click event handling</li>
              <li>No deprecation warnings</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapTest; 