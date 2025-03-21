
import { Routes, Route } from "react-router-dom";
import { AppProviders } from "./routes/AppProviders";
import Home from "./pages/Home";
import CricketNews from "./pages/cricket-news";
import ArticleDetail from "./pages/ArticleDetail";
import AdminLogin from "./admin/AdminLogin";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./admin/Dashboard";
import ArticlesList from "./admin/ArticlesList";
import ArticleForm from "./admin/ArticleForm";
import Analytics from "./admin/Analytics";
import NavigationManager from "./admin/NavigationManager";
import TopStoriesManager from "./admin/TopStoriesManager";
import FantasyPicksManager from "./admin/FantasyPicksManager";
import MatchesManager from "./admin/MatchesManager";
import PlayerProfilesManager from "./admin/PlayerProfilesManager";
import MediaLibraryManager from "./admin/MediaLibraryManager";
import SettingsManager from "./admin/SettingsManager";
import { AdminProtectedRoute } from "./routes/AdminRoutes";

const App = () => (
  <AppProviders>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/cricket-news" element={<CricketNews />} />
      <Route path="/match-previews" element={<CricketNews />} />
      <Route path="/match-reviews" element={<CricketNews />} />
      <Route path="/fantasy-tips" element={<CricketNews />} />
      <Route path="/player-profiles" element={<CricketNews />} />
      <Route path="/ipl-2025" element={<CricketNews />} />
      <Route path="/womens-cricket" element={<CricketNews />} />
      <Route path="/world-cup" element={<CricketNews />} />
      <Route path="/article/:id" element={<ArticleDetail />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Routes */}
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

      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AppProviders>
);

export default App;
