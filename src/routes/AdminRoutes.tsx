
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
    <AdminProtectedRoute>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/articles" element={<ArticlesList />} />
        <Route path="/articles/new" element={<ArticleForm />} />
        <Route path="/articles/edit/:id" element={<ArticleForm />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/navigation" element={<NavigationManager />} />
        <Route path="/top-stories" element={<TopStoriesManager />} />
        <Route path="/fan-polls" element={<FanPollManager />} />
        <Route path="/hero-slider" element={<HeroSliderManager />} />
        <Route path="/fantasy-picks" element={<FantasyPicksManager />} />
        <Route path="/matches" element={<MatchesManager />} />
        <Route path="/player-profiles" element={<PlayerProfilesManager />} />
        <Route path="/media-library" element={<MediaLibraryManager />} />
        <Route path="/settings" element={<SettingsManager />} />
        <Route path="/free-war-contest" element={<FreeWarContestManager />} />
      </Routes>
    </AdminProtectedRoute>
  );
};
