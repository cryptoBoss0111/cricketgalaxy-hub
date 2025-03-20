import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster"
import { RouterProvider, createBrowserRouter, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Index } from './pages/Index'
import CricketNews from './pages/CricketNews'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound'
import { useEffect } from 'react'
import { useToast } from './hooks/use-toast'
import AdminDashboard from './admin/AdminDashboard'
import AdminLogin from './admin/AdminLogin'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import Articles from './admin/Articles'
import EditArticle from './admin/EditArticle'
import PlayerProfiles from './admin/PlayerProfiles'
import EditPlayerProfile from './admin/EditPlayerProfile'
import UpcomingMatches from './admin/UpcomingMatches'
import EditMatch from './admin/EditMatch'
import FantasyPicks from './admin/FantasyPicks'
import EditFantasyPick from './admin/EditFantasyPick'
import Navigation from './admin/Navigation'
import Media from './admin/Media'
import TopStories from './admin/TopStories'
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
