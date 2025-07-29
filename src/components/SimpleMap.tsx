import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import type { Apartment, Institution } from '@/services/api';

interface SimpleMapProps {
  apartments?: Apartment[];
  institutions?: Institution[];
  height?: string;
  onMarkerClick?: (apartment: Apartment) => void;
  onInstitutionClick?: (institution: Institution) => void;
  className?: string;
}

export default function SimpleMap({
  apartments = [],
  institutions = [],
  height = '400px',
  onMarkerClick,
  onInstitutionClick,
  className = ''
}: SimpleMapProps) {
  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div 
          style={{ height }}
          className="relative bg-gradient-to-br from-blue-50 to-indigo-100 border rounded-lg overflow-hidden"
        >
          {/* Map background with grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }} />
          </div>

          {/* Center point (Haifa) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="text-xs text-blue-600 mt-1 text-center">Haifa</div>
          </div>

          {/* Apartment markers */}
          {apartments.map((apartment, index) => {
            // Simple positioning based on lat/lng relative to Haifa center
            const latOffset = (apartment.lat - 32.794167) * 1000;
            const lngOffset = (apartment.lng - 34.989167) * 1000;
            
            return (
              <div
                key={apartment.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `calc(50% + ${lngOffset}px)`,
                  top: `calc(50% + ${latOffset}px)`,
                }}
                onClick={() => onMarkerClick?.(apartment)}
              >
                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">₪</span>
                </div>
                <div className="text-xs text-blue-600 mt-1 text-center max-w-20 truncate">
                  {apartment.price.toLocaleString()}
                </div>
              </div>
            );
          })}

          {/* Institution markers */}
          {institutions.map((institution, index) => {
            const latOffset = (institution.lat - 32.794167) * 1000;
            const lngOffset = (institution.lng - 34.989167) * 1000;
            
            return (
              <div
                key={institution.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `calc(50% + ${lngOffset}px)`,
                  top: `calc(50% + ${latOffset}px)`,
                }}
                onClick={() => onInstitutionClick?.(institution)}
              >
                <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-xs">🏫</span>
                </div>
                <div className="text-xs text-green-600 mt-1 text-center max-w-20 truncate">
                  {institution.name.split(' ')[0]}
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-2 text-xs">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Apartments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Universities</span>
            </div>
          </div>

          {/* Info overlay */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg p-2 text-xs">
            <div className="font-medium">Simple Map View</div>
            <div className="text-muted-foreground">
              {apartments.length} apartments, {institutions.length} institutions
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 