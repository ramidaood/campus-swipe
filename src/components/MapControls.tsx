import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Bus, Clock, Route } from 'lucide-react';
import { POI_TYPES, type POIType } from '@/services/maps';
import type { Institution } from '@/services/api';

interface MapControlsProps {
  institutions: Institution[];
  selectedApartment: any | null;
  selectedUniversity: Institution | null;
  onUniversitySelect: (university: Institution | null) => void;
  showPOIs: boolean;
  onTogglePOIs: (show: boolean) => void;
  showApartments: boolean;
  onToggleApartments: (show: boolean) => void;
  enabledPOITypes: POIType[];
  onTogglePOIType: (type: POIType, enabled: boolean) => void;
  directions: {
    duration: string;
    distance: string;
    steps: google.maps.DirectionsStep[];
  } | null;
}

const MapControls = ({
  institutions,
  selectedApartment,
  selectedUniversity,
  onUniversitySelect,
  showPOIs,
  onTogglePOIs,
  showApartments,
  onToggleApartments,
  enabledPOITypes,
  onTogglePOIType,
  directions
}: MapControlsProps) => {

  return (
    <div className="space-y-4">
      {/* POI Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Nearby Places
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-apartments"
              checked={showApartments}
              onCheckedChange={onToggleApartments}
            />
            <Label htmlFor="show-apartments" className="text-sm">
              Show apartment markers
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-pois"
              checked={showPOIs}
              onCheckedChange={onTogglePOIs}
            />
            <Label htmlFor="show-pois" className="text-sm">
              Show nearby places
            </Label>
          </div>
          
          {showPOIs && (
            <div className="space-y-2">
              {Object.entries(POI_TYPES).map(([type, config]) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`poi-${type}`}
                    checked={enabledPOITypes.includes(type as POIType)}
                    onCheckedChange={(checked) => onTogglePOIType(type as POIType, checked as boolean)}
                  />
                  <Label htmlFor={`poi-${type}`} className="text-sm flex items-center gap-1">
                    <span style={{ color: config.color }}>{config.icon}</span>
                    {config.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Directions Controls */}
      {selectedApartment && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Route className="w-4 h-4" />
              Directions to University
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="university-select" className="text-sm">
                Select University
              </Label>
              <Select
                value={selectedUniversity?.id || ''}
                onValueChange={(value) => {
                  const university = institutions.find(inst => inst.id === value);
                  onUniversitySelect(university || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a university" />
                </SelectTrigger>
                <SelectContent>
                  {institutions.map((institution) => (
                    <SelectItem key={institution.id} value={institution.id}>
                      {institution.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedUniversity && directions && (
              <div className="space-y-2 p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Travel Time</span>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {directions.duration}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Distance</span>
                  <Badge variant="outline">{directions.distance}</Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Bus className="w-3 h-3" />
                  <span>Public transit route</span>
                </div>
              </div>
            )}

            {selectedUniversity && !directions && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Calculating route...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MapControls; 