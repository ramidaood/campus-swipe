import { useQuery } from "@tanstack/react-query";
import { apartmentsApi } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";

const MinimalTest = () => {
  // Only fetch apartments, no maps
  const { 
    data: apartments = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['apartments'],
    queryFn: apartmentsApi.getAll,
    retry: 2,
  });

  console.log("🔍 MinimalTest - Query status:", { isLoading, error, apartmentsCount: apartments.length });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading apartments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
          <p className="text-muted-foreground mb-4">
            {error.message || "Unknown error occurred"}
          </p>
          <pre className="text-xs bg-muted p-3 rounded overflow-auto text-left">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Minimal Test</h1>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">Success!</h2>
              <p className="text-muted-foreground">
                The app is working. Found {apartments.length} apartments.
              </p>
            </CardContent>
          </Card>

          {apartments.map((apartment) => (
            <Card key={apartment.id}>
              <CardContent className="p-4">
                <h3 className="font-semibold">{apartment.title}</h3>
                <p className="text-muted-foreground text-sm">{apartment.address}</p>
                <p className="font-bold text-primary">₪{apartment.price.toLocaleString()}/mo</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinimalTest; 