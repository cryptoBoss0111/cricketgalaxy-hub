
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AdminProtectedRoute } from "@/routes/AdminRoutes";
import { PublicRoutes } from "@/routes/PublicRoutes";
import NotFound from "@/pages/NotFound";
import AdminLogin from "@/admin/AdminLogin";
import AdminDashboard from "@/admin/Dashboard";
import ArticlesList from "@/admin/ArticlesList";
import ArticleForm from "@/admin/ArticleForm";
import TopStoriesManager from "@/admin/TopStoriesManager";
import HeroSliderManager from "@/admin/HeroSliderManager";
import FanPollManager from "@/admin/FanPollManager";
import FantasyPicksManager from "@/admin/FantasyPicksManager";
import NavigationManager from "@/admin/NavigationManager";
import MediaLibraryManager from "@/admin/MediaLibraryManager";
import MatchesManager from "@/admin/MatchesManager";
import PlayerProfilesManager from "@/admin/PlayerProfilesManager";
import SettingsManager from "@/admin/SettingsManager";
import Analytics from "@/admin/Analytics";
import FreeWarContestManager from "@/admin/FreeWarContestManager";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/*" element={<PublicRoutes />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/articles" 
          element={
            <AdminProtectedRoute>
              <ArticlesList />
            </AdminProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/articles/new" 
          element={
            <AdminProtectedRoute>
              <ArticleForm />
            </AdminProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/articles/edit/:id" 
          element={
            <AdminProtectedRoute>
              <ArticleForm />
            </AdminProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/top-stories" 
          element={
            <AdminProtectedRoute>
              <TopStoriesManager />
            </AdminProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/hero-slider" 
          element={
            <AdminProtectedRoute>
              <HeroSliderManager />
            </AdminProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/fan-polls" 
          element={
            <AdminProtectedRoute>
              <FanPollManager />
            </AdminProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/fantasy-picks" 
          element={
            <AdminProtectedRoute>
              <FantasyPicksManager />
            </AdminProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/free-war-contest" 
          element={
            <AdminProtectedRoute>
              <FreeWarContestManager />
            </AdminProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/navigation" 
          element={
            <AdminProtectedRoute>
              <NavigationManager />
            </AdminProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/media" 
          element={
            <AdminProtectedRoute>
              <MediaLibraryManager />
            </AdminProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/matches" 
          element={
            <AdminProtectedRoute>
              <MatchesManager />
            </AdminProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/players" 
          element={
            <AdminProtectedRoute>
              <PlayerProfilesManager />
            </AdminProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/settings" 
          element={
            <AdminProtectedRoute>
              <SettingsManager />
            </AdminProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/analytics" 
          element={
            <AdminProtectedRoute>
              <Analytics />
            </AdminProtectedRoute>
          } 
        />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
