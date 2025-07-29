import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Swipe from "./pages/Swipe";
import Favorites from "./pages/Favorites";
import ApartmentDetail from "./pages/ApartmentDetail";
import AddListing from "./pages/AddListing";
import Test from "./pages/Test";
import MinimalTest from "./pages/MinimalTest";
import Login from "./pages/Login";
import AuthTest from "./pages/AuthTest";
import MapTest from "./pages/MapTest";
import MapFilterTest from "./components/MapFilterTest";
import ComprehensiveTest from "./pages/ComprehensiveTest";
import EnhancedMapTest from "./pages/EnhancedMapTest";
import NotFound from "./pages/NotFound";
import BottomNavigation from "./components/BottomNavigation";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/swipe" element={<Swipe />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/apartment/:id" element={<ApartmentDetail />} />
              <Route path="/add" element={<AddListing />} />
              <Route path="/test" element={<Test />} />
              <Route path="/minimal" element={<MinimalTest />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth-test" element={<AuthTest />} />
              <Route path="/map-test" element={<MapTest />} />
              <Route path="/map-filter-test" element={<MapFilterTest />} />
              <Route path="/comprehensive-test" element={<ComprehensiveTest />} />
              <Route path="/enhanced-map-test" element={<EnhancedMapTest />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNavigation />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
