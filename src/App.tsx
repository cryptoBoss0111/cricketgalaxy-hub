import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChatbotProvider } from "@/contexts/ChatbotContext";
import { useState, useEffect } from "react";
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";
import Home from "./pages/Home";
import CricketNews from "./pages/CricketNews";
import NotFound from "./pages/NotFound";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/Dashboard";
import ArticleForm from "./admin/ArticleForm";
import ArticlesList from "./admin/ArticlesList";
import Analytics from "./admin/Analytics";
import NavigationManager from "./admin/NavigationManager";
import TopStoriesManager from "./admin/TopStoriesManager";
import FantasyPicksManager from "./admin/FantasyPicksManager";
import MatchesManager from "./admin/MatchesManager";
import PlayerProfilesManager from "./admin/PlayerProfilesManager";
import MediaLibraryManager from "./admin/MediaLibraryManager";
import SettingsManager from "./admin/SettingsManager";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route component for admin routes
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isChecking, verifyAdmin } = useAdminAuth();
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    
    // First check if adminToken exists in localStorage as a quick check
    const adminToken = localStorage.getItem('adminToken');
    
    const checkAuth = async () => {
      if (!isMounted) return;
      
      setChecking(true);
      try {
        console.log('AdminProtectedRoute: Verifying admin access');
        
        // If we already know the user is an admin from context, trust it
        if (isAdmin && !isChecking) {
          console.log('AdminProtectedRoute: User already verified as admin in context');
          setVerified(true);
          setChecking(false);
          return;
        }
        
        // Otherwise verify admin status
        const adminStatus = await verifyAdmin();
        console.log("AdminProtectedRoute: Admin verification result:", adminStatus);
        
        if (isMounted) {
          setVerified(adminStatus);
          setChecking(false);
        }
      } catch (error) {
        console.error("AdminProtectedRoute: Error verifying admin", error);
        if (isMounted) {
          setVerified(false);
          setChecking(false);
        }
      }
    };
    
    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, [verifyAdmin, isAdmin, isChecking]);
  
  if (checking || isChecking) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-cricket-accent border-t-transparent rounded-full"></div>
        <span className="ml-3">Verifying admin access...</span>
      </div>
    );
  }
  
  if (!verified && !isAdmin) {
    console.log("AdminProtectedRoute: Access denied, redirecting to login");
    return <Navigate to="/admin/login" replace />;
  }
  
  console.log("AdminProtectedRoute: Access granted");
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ChatbotProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AdminAuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/cricket-news" element={<CricketNews />} />
              <Route path="/match-previews" element={<CricketNews />} />
              <Route path="/match-reviews" element={<CricketNews />} />
              <Route path="/fantasy-tips" element={<CricketNews />} />
              <Route path="/player-profiles" element={<CricketNews />} />
              <Route path="/ipl-2025" element={<CricketNews />} />
              <Route path="/womens-cricket" element={<CricketNews />} />
              <Route path="/world-cup" element={<CricketNews />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected admin routes */}
              <Route path="/admin/dashboard" element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/articles" element={
                <AdminProtectedRoute>
                  <ArticlesList />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/articles/new" element={
                <AdminProtectedRoute>
                  <ArticleForm />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/articles/edit/:id" element={
                <AdminProtectedRoute>
                  <ArticleForm />
                </AdminProtectedRoute>
              } />
              
              {/* Admin routes for content management */}
              <Route path="/admin/analytics" element={
                <AdminProtectedRoute>
                  <Analytics />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/navigation" element={
                <AdminProtectedRoute>
                  <NavigationManager />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/top-stories" element={
                <AdminProtectedRoute>
                  <TopStoriesManager />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/fantasy-picks" element={
                <AdminProtectedRoute>
                  <FantasyPicksManager />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/matches" element={
                <AdminProtectedRoute>
                  <MatchesManager />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/players" element={
                <AdminProtectedRoute>
                  <PlayerProfilesManager />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/media" element={
                <AdminProtectedRoute>
                  <MediaLibraryManager />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <AdminProtectedRoute>
                  <SettingsManager />
                </AdminProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AdminAuthProvider>
        </BrowserRouter>
      </ChatbotProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
