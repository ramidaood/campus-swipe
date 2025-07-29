import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { apartmentsApi, institutionsApi } from "@/services/api";
import Map from "@/components/Map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Apartment, Institution } from "@/services/api";

const MapFilterTest = () => {
  const [filter, setFilter] = useState<'all' | 'apartments' | 'institutions'>('all');
  const [showMap, setShowMap] = useState(true);
  const [testCount, setTestCount] = useState(0);

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

  // Filter data based on current filter
  const filteredApartments = filter === 'all' || filter === 'apartments' ? apartments : [];
  const filteredInstitutions = filter === 'all' || filter === 'institutions' ? institutions : [];

  const handleApartmentClick = (apartment: Apartment) => {
    console.log("📍 Apartment clicked:", apartment.title);
  };

  const handleInstitutionClick = (institution: Institution) => {
    console.log("🏫 Institution clicked:", institution.name);
  };

  // Test rapid filter changes
  useEffect(() => {
    const interval = setInterval(() => {
      setTestCount(prev => prev + 1);
      if (testCount % 10 === 0) {
        setFilter(prev => {
          const filters: Array<'all' | 'apartments' | 'institutions'> = ['all', 'apartments', 'institutions'];
          const currentIndex = filters.indexOf(prev);
          return filters[(currentIndex + 1) % filters.length];
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [testCount]);

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
        <h1 className="text-3xl font-bold">🧪 Map Filter Test</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                All ({apartments.length + institutions.length})
              </Button>
              <Button 
                variant={filter === 'apartments' ? 'default' : 'outline'}
                onClick={() => setFilter('apartments')}
              >
                Apartments ({apartments.length})
              </Button>
              <Button 
                variant={filter === 'institutions' ? 'default' : 'outline'}
                onClick={() => setFilter('institutions')}
              >
                Institutions ({institutions.length})
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={showMap ? 'default' : 'outline'}
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? 'Hide' : 'Show'} Map
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <span>Test Count: {testCount}</span>
              <span>Current Filter: <Badge>{filter}</Badge></span>
              <span>Auto Change: {testCount % 10 === 0 ? 'Yes' : 'No'}</span>
            </div>
          </CardContent>
        </Card>

        {showMap && (
          <Card>
            <CardHeader>
              <CardTitle>Advanced Marker Map (Filtered)</CardTitle>
            </CardHeader>
            <CardContent>
              <Map
                apartments={filteredApartments}
                institutions={filteredInstitutions}
                height="500px"
                onMarkerClick={handleApartmentClick}
                onInstitutionClick={handleInstitutionClick}
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✅ <strong>Filter Testing:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Rapid filter changes every 10 seconds</li>
              <li>Map show/hide transitions</li>
              <li>Marker cleanup during filter changes</li>
              <li>No DOM errors during transitions</li>
              <li>Proper marker count updates</li>
            </ul>
            
            <p className="mt-4">🔍 <strong>Check Console For:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>No "removeChild" errors</li>
              <li>Marker creation/cleanup logs</li>
              <li>Filter change notifications</li>
              <li>No React crashes during transitions</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapFilterTest; 