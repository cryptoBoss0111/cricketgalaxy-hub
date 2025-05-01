
import { Routes, Route, Navigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminDashboard from "@/admin/Dashboard";
import ArticlesList from "@/admin/ArticlesList";
import ArticleForm from "@/admin/ArticleForm";
import Analytics from "@/admin/Analytics";
import NavigationManager from "@/admin/NavigationManager";
import TopStoriesManager from "@/admin/TopStoriesManager";
import FanPollManager from "@/admin/FanPollManager";
import HeroSliderManager from "@/admin/HeroSliderManager";
import FantasyPicksManager from "@/admin/FantasyPicksManager";
import MatchesManager from "@/admin/MatchesManager";
import PlayerProfilesManager from "@/admin/PlayerProfilesManager";
import MediaLibraryManager from "@/admin/MediaLibraryManager";
import SettingsManager from "@/admin/SettingsManager";
import FreeWarContestManager from "@/admin/FreeWarContestManager";
import AdminLogin from "@/admin/AdminLogin";

// Protected route component for admin routes
export const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isChecking } = useAdminAuth();

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

// AdminRoutes component
export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
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
      <Route path="/admin/fan-polls" element={
        <AdminProtectedRoute>
          <FanPollManager />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/hero-slider" element={
        <AdminProtectedRoute>
          <HeroSliderManager />
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
      <Route path="/admin/player-profiles" element={
        <AdminProtectedRoute>
          <PlayerProfilesManager />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/media-library" element={
        <AdminProtectedRoute>
          <MediaLibraryManager />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <AdminProtectedRoute>
          <SettingsManager />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/free-war-contest" element={
        <AdminProtectedRoute>
          <FreeWarContestManager />
        </AdminProtectedRoute>
      } />
    </Routes>
  );
};
