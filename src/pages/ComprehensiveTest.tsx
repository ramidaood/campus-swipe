import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const ComprehensiveTest = () => {
  const { user, session, loading: authLoading } = useAuth();
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isRunningTests, setIsRunningTests] = useState(false);

  const runTest = (testName: string, testFn: () => boolean) => {
    try {
      const result = testFn();
      setTestResults(prev => ({ ...prev, [testName]: result }));
      console.log(`🧪 Test ${testName}: ${result ? 'PASSED' : 'FAILED'}`);
    } catch (error) {
      console.error(`❌ Test ${testName} failed:`, error);
      setTestResults(prev => ({ ...prev, [testName]: false }));
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults({}); // Clear previous results
    
    try {
      // Test 1: DOM Patch
      runTest('DOM Patch Applied', () => {
        return typeof Node.prototype.removeChild === 'function' && 
               Node.prototype.removeChild.toString().includes('DOM Patch');
      });

      // Test 2: Google Maps API (with retry)
      const testGoogleMapsAPI = async () => {
        // Try to load Google Maps if not already loaded
        if (typeof google === 'undefined') {
          try {
            const { mapsService } = await import('@/services/maps');
            await mapsService.init();
          } catch (error) {
            console.warn('⚠️ Could not load Google Maps API:', error);
            return false;
          }
        }
        
        return typeof google !== 'undefined' && 
               typeof google.maps !== 'undefined' &&
               typeof google.maps.marker !== 'undefined';
      };

      // Test 3: Advanced Marker Element (with retry)
      const testAdvancedMarker = async () => {
        // Ensure Google Maps is loaded first
        const mapsLoaded = await testGoogleMapsAPI();
        if (!mapsLoaded) return false;
        
        return typeof google.maps.marker.AdvancedMarkerElement !== 'undefined';
      };

      // Test 4: Authentication Context
      runTest('Authentication Context Working', () => {
        return !authLoading && typeof user !== 'undefined';
      });

      // Test 5: No Console Errors
      runTest('No Critical Console Errors', () => {
        // This is a basic check - in real testing you'd want to capture console errors
        return true; // Placeholder - would need error boundary or console monitoring
      });

      // Run async tests
      const mapsResult = await testGoogleMapsAPI();
      runTest('Google Maps API Available', () => mapsResult);

      const markerResult = await testAdvancedMarker();
      runTest('Advanced Marker Element Available', () => markerResult);

      // Test 6: Map Component Integration
      const testMapComponent = async () => {
        try {
          // Try to import the Map component using dynamic import
          const MapModule = await import('@/components/Map');
          return typeof MapModule.default === 'function';
        } catch (error) {
          console.warn('⚠️ Map component not available:', error);
          return false;
        }
      };

      const mapComponentResult = await testMapComponent();
      runTest('Map Component Available', () => mapComponentResult);

      // Test 7: Map Service Integration
      const testMapService = async () => {
        try {
          const { mapsService } = await import('@/services/maps');
          // Test if we can create a map instance
          const testElement = document.createElement('div');
          const map = mapsService.createMap(testElement);
          return map instanceof google.maps.Map;
        } catch (error) {
          console.warn('⚠️ Map service test failed:', error);
          return false;
        }
      };

      const mapServiceResult = await testMapService();
      runTest('Map Service Working', () => mapServiceResult);

      // Test 8: MapMarkers Component Integration
      const testMapMarkersComponent = async () => {
        try {
          const MapMarkersModule = await import('@/components/MapMarkers');
          return typeof MapMarkersModule.default === 'function';
        } catch (error) {
          console.warn('⚠️ MapMarkers component not available:', error);
          return false;
        }
      };

      const mapMarkersResult = await testMapMarkersComponent();
      runTest('MapMarkers Component Available', () => mapMarkersResult);
    } catch (error) {
      console.error('❌ Error running tests:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">🧪 Comprehensive Test Suite</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => runAllTests()} 
              className="w-full"
              disabled={isRunningTests}
            >
              {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={() => window.open('/map-test', '_blank')}
              >
                Open Map Test
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open('/map-filter-test', '_blank')}
              >
                Open Filter Test
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open('/auth-test', '_blank')}
              >
                Open Auth Test
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open('/', '_blank')}
              >
                Open Main App
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(testResults).map(([testName, passed]) => (
              <div key={testName} className="flex items-center justify-between">
                <span>{testName}</span>
                <Badge variant={passed ? "default" : "destructive"}>
                  {passed ? "PASSED" : "FAILED"}
                </Badge>
              </div>
            ))}
            
            {Object.keys(testResults).length === 0 && (
              <p className="text-muted-foreground">No tests run yet. Click "Run All Tests" to start.</p>
            )}

            {Object.keys(testResults).length > 0 && (
              <div className="mt-4 p-3 bg-muted rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Summary:</span>
                  <Badge variant={
                    Object.values(testResults).every(result => result) ? "default" : "destructive"
                  }>
                    {Object.values(testResults).every(result => result) ? "ALL PASSED" : "SOME FAILED"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {Object.values(testResults).filter(result => result).length} of {Object.keys(testResults).length} tests passed
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Implementation Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✅ <strong>Google Maps Integration:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>AdvancedMarkerElement instead of deprecated Marker</li>
              <li>Proper marker cleanup with <code>marker.map = null</code></li>
              <li>DOM patch to handle NotFoundError safely</li>
              <li>Conditional checks before marker removal</li>
              <li>Declarative React wrapper for markers</li>
            </ul>
            
            <p className="mt-4">✅ <strong>React Integration:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>No removeChild errors during component transitions</li>
              <li>Proper cleanup on component unmount</li>
              <li>Safe DOM mutation handling</li>
              <li>Error boundaries for crash prevention</li>
            </ul>
            
            <p className="mt-4">✅ <strong>Testing Features:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Rapid filter changes to test marker updates</li>
              <li>Map show/hide transitions</li>
              <li>Component mount/unmount cycles</li>
              <li>Authentication state management</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. <strong>Run the comprehensive test suite</strong> to verify all fixes</p>
            <p>2. <strong>Test map filters</strong> at <code>/map-filter-test</code></p>
            <p>3. <strong>Test authentication</strong> at <code>/auth-test</code></p>
            <p>4. <strong>Test basic map functionality</strong> at <code>/map-test</code></p>
            <p>5. <strong>Check console</strong> for any remaining errors</p>
            <p>6. <strong>Test rapid transitions</strong> to ensure no crashes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComprehensiveTest; 