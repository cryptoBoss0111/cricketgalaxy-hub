import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster"
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Index from './pages/Index'
import CricketNews from './pages/CricketNews'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import AdminDashboard from './admin/Dashboard'
import AdminLogin from './admin/AdminLogin'
import Articles from './admin/ArticlesList'
import EditArticle from './admin/ArticleForm'
import PlayerProfiles from './admin/PlayerProfilesManager'
import EditPlayerProfile from './admin/PlayerProfilesManager'
import UpcomingMatches from './admin/MatchesManager'
import EditMatch from './admin/MatchesManager'
import FantasyPicks from './admin/FantasyPicksManager'
import EditFantasyPick from './admin/FantasyPicksManager'
import Navigation from './admin/NavigationManager'
import Media from './admin/MediaLibraryManager'
import TopStories from './admin/TopStoriesManager'
import Analytics from './admin/Analytics'

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
      <RouterProvider router={createBrowserRouter([
        {
          path: "/",
          element: <Index />,
          errorElement: <NotFound />
        },
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/news/:category?",
          element: <CricketNews />,
        },
        {
          path: "/auth",
          element: <Auth />,
        },
        {
          path: "/admin/login",
          element: <AdminLogin />,
        },
        {
          path: "/admin/dashboard",
          element: <AdminDashboard />,
        },
        {
          path: "/admin/articles",
          element: <Articles />,
        },
        {
          path: "/admin/articles/edit/:id?",
          element: <EditArticle />,
        },
        {
          path: "/admin/player-profiles",
          element: <PlayerProfiles />,
        },
        {
          path: "/admin/player-profiles/edit/:id?",
          element: <EditPlayerProfile />,
        },
        {
          path: "/admin/upcoming-matches",
          element: <UpcomingMatches />,
        },
        {
          path: "/admin/upcoming-matches/edit/:id?",
          element: <EditMatch />,
        },
        {
          path: "/admin/fantasy-picks",
          element: <FantasyPicks />,
        },
        {
          path: "/admin/fantasy-picks/edit/:id?",
          element: <EditFantasyPick />,
        },
        {
          path: "/admin/navigation",
          element: <Navigation />,
        },
        {
          path: "/admin/media",
          element: <Media />,
        },
        {
          path: "/admin/top-stories",
          element: <TopStories />,
        },
        {
          path: "/admin/analytics",
          element: <Analytics />,
        }
      ])} />
      <Toaster />
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
