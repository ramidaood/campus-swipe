import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AuthTest = () => {
  const { user, session, loading, signIn, signOut } = useAuth();

  const handleTestSignIn = async () => {
    try {
      // This will fail but we can see the error handling
      await signIn('test@example.com', 'password');
    } catch (error) {
      console.log('Expected sign in error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">🔐 Auth Test</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Loading:</span>
              <Badge variant={loading ? "default" : "secondary"}>
                {loading ? "Yes" : "No"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>User:</span>
              <Badge variant={user ? "default" : "secondary"}>
                {user ? user.email : "Not logged in"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Session:</span>
              <Badge variant={session ? "default" : "secondary"}>
                {session ? "Active" : "None"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={handleTestSignIn} variant="outline">
                Test Sign In (will fail)
              </Button>
              {user && (
                <Button onClick={signOut} variant="destructive">
                  Sign Out
                </Button>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>• The app should load without AuthSessionMissingError</p>
              <p>• Authentication state should be properly managed</p>
              <p>• Test sign in will fail (expected) but shouldn't crash the app</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. Check that the app loads without authentication errors</p>
            <p>2. Verify that the auth status shows correctly in the header</p>
            <p>3. Test the login page at <code>/login</code></p>
            <p>4. Check that Google Maps quota errors are handled gracefully</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthTest; 