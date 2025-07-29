import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Building2 } from 'lucide-react';
import type { Apartment, Institution } from '@/services/api';

interface FallbackMapProps {
  apartments: Apartment[];
  institutions: Institution[];
  height?: string;
  onMarkerClick?: (apartment: Apartment) => void;
  onInstitutionClick?: (institution: Institution) => void;
}

const FallbackMap = ({ 
  apartments, 
  institutions, 
  height = "400px",
  onMarkerClick,
  onInstitutionClick 
}: FallbackMapProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Map Temporarily Unavailable</h3>
          <p className="text-muted-foreground mb-4">
            Google Maps API quota has been exceeded. Please try again later.
          </p>
          
          {/* Show locations as a list instead */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Available Locations:</h4>
            
            {/* Apartments */}
            {apartments.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-muted-foreground mb-2">Apartments ({apartments.length})</h5>
                <div className="space-y-2">
                  {apartments.slice(0, 5).map((apartment) => (
                    <div 
                      key={apartment.id}
                      className="flex items-center gap-2 p-2 bg-muted rounded cursor-pointer hover:bg-muted/80"
                      onClick={() => onMarkerClick?.(apartment)}
                    >
                      <MapPin className="w-4 h-4 text-primary" />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{apartment.title}</p>
                        <p className="text-xs text-muted-foreground">{apartment.address}</p>
                      </div>
                      <span className="text-xs font-bold text-primary">₪{apartment.price.toLocaleString()}</span>
                    </div>
                  ))}
                  {apartments.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{apartments.length - 5} more apartments
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* Institutions */}
            {institutions.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-muted-foreground mb-2">Institutions ({institutions.length})</h5>
                <div className="space-y-2">
                  {institutions.map((institution) => (
                    <div 
                      key={institution.id}
                      className="flex items-center gap-2 p-2 bg-muted rounded cursor-pointer hover:bg-muted/80"
                      onClick={() => onInstitutionClick?.(institution)}
                    >
                      <Building2 className="w-4 h-4 text-green-600" />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{institution.name}</p>
                        <p className="text-xs text-muted-foreground">{institution.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FallbackMap; 