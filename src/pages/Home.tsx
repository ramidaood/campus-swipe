import { useState } from "react";
import { MapPin, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoApartments, demoInstitutions } from "@/data/demoData";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showMap, setShowMap] = useState(true);
  const navigate = useNavigate();

  const filteredApartments = demoApartments.filter(apartment =>
    apartment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apartment.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">Campus Swipe</h1>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search apartments or areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Toggle and Filter */}
          <div className="flex gap-2">
            <Button
              variant={showMap ? "default" : "outline"}
              size="sm"
              onClick={() => setShowMap(!showMap)}
              className="flex-1"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {showMap ? "Show List" : "Show Map"}
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {showMap ? (
          /* Map Placeholder */
          <Card className="h-80 mb-6">
            <CardContent className="p-4 h-full">
              <div className="h-full bg-muted rounded-lg flex items-center justify-center relative">
                <p className="text-muted-foreground text-center">
                  🗺️ Interactive Map View<br />
                  <span className="text-sm">Showing {filteredApartments.length} apartments</span>
                </p>
                
                {/* Map pins simulation */}
                <div className="absolute top-4 left-4">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {filteredApartments.length}
                  </div>
                </div>
                
                {/* University markers */}
                {demoInstitutions.map((institution, index) => (
                  <div
                    key={index}
                    className="absolute bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    style={{
                      top: `${20 + index * 30}%`,
                      right: `${20 + index * 20}%`
                    }}
                  >
                    🏫 {institution.name.split(' - ')[0]}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Apartments List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Available Apartments ({filteredApartments.length})
          </h2>
          
          {filteredApartments.map((apartment) => (
            <Card 
              key={apartment.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/apartment/${apartment.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={apartment.image_urls[0]}
                      alt={apartment.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground truncate">
                        {apartment.title}
                      </h3>
                      <Badge variant="secondary" className="ml-2 flex-shrink-0">
                        {apartment.room_type}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {apartment.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        📍 {apartment.address}
                      </span>
                      <span className="font-bold text-primary">
                        ₪{apartment.price.toLocaleString()}/mo
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;