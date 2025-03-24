
import { Navigate } from "react-router-dom";
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

// Keep the AdminRoutes export for backwards compatibility
export const AdminRoutes = () => null;
