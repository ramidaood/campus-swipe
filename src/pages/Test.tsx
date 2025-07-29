import { useState } from "react";

const Test = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Test Page</h1>
        <p className="text-muted-foreground mb-6">
          If you can see this, the basic app structure is working.
        </p>
        
        <div className="space-y-4">
          <div className="p-4 bg-card rounded-lg border">
            <p className="font-medium">Counter: {count}</p>
            <button 
              onClick={() => setCount(count + 1)}
              className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Increment
            </button>
          </div>
          
          <div className="p-4 bg-card rounded-lg border">
            <p className="font-medium">Environment Check:</p>
            <div className="text-left text-sm space-y-1 mt-2">
              <p className="text-muted-foreground">
                Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? "✅ Set" : "❌ Not set"}
              </p>
              <p className="text-muted-foreground">
                Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Not set"}
              </p>
              <p className="text-muted-foreground">
                Google Maps API: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? "✅ Set" : "❌ Not set"}
              </p>
              <p className="text-muted-foreground">
                App Name: {import.meta.env.VITE_APP_NAME || "❌ Not set"}
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-card rounded-lg border">
            <p className="font-medium">Browser Info:</p>
            <p className="text-sm text-muted-foreground text-left">
              User Agent: {navigator.userAgent.substring(0, 50)}...
            </p>
          </div>

          <div className="p-4 bg-card rounded-lg border">
            <p className="font-medium">Next Steps:</p>
            <div className="text-left text-sm space-y-1 mt-2">
              <p className="text-muted-foreground">1. Create .env file with API keys</p>
              <p className="text-muted-foreground">2. Restart the dev server</p>
              <p className="text-muted-foreground">3. Test the main app at /</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test; 