
import { Toaster } from "@/components/ui/toaster"
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Index from './pages/Index'
import CricketNews from './pages/CricketNews'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound'
import { AuthProvider } from './contexts/AuthContext';

// Only import admin components that exist in the read-only files
import AdminLogin from './admin/AdminLogin'

function App() {
  const router = createBrowserRouter([
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
    }
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
