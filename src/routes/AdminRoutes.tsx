import { Navigate } from "react-router-dom";

// Protected route component for admin routes
export const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return <Navigate to="/" replace />;
};

// Keep the AdminRoutes export for backwards compatibility
export const AdminRoutes = () => null;
