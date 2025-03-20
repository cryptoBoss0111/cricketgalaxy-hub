
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChatbotProvider } from "@/contexts/ChatbotContext";
import { useState, useEffect, useRef } from "react";
import { checkAdminStatus } from "@/utils/adminAuth";
import Home from "./pages/Home";
import CricketNews from "./pages/CricketNews";
import NotFound from "./pages/NotFound";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/Dashboard";
import ArticleForm from "./admin/ArticleForm";
import ArticlesList from "./admin/ArticlesList";

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
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const verificationDone = useRef(false);
  
  useEffect(() => {
    let isMounted = true;
    
    const verifyAdmin = async () => {
      if (!isMounted || verificationDone.current) return;
      
      try {
        setIsChecking(true);
        // Use the improved checkAdminStatus with caching
        const { isAdmin } = await checkAdminStatus();
        
        if (isMounted) {
          setIsAdmin(isAdmin);
          verificationDone.current = true;
        }
      } catch (error) {
        console.error("Admin verification error:", error);
        if (isMounted) {
          setIsAdmin(false);
          verificationDone.current = true;
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };
    
    // Only verify if not already done
    if (!verificationDone.current) {
      verifyAdmin();
    }
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  if (isChecking) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-cricket-accent border-t-transparent rounded-full"></div>
        <span className="ml-3">Verifying admin access...</span>
      </div>
    );
  }
  
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ChatbotProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
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
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ChatbotProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
