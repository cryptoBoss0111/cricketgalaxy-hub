
import { Routes, Route } from "react-router-dom";
import { AppProviders } from "./routes/AppProviders";
import { AdminRoutes } from "./routes/AdminRoutes";
import { PublicRoutes } from "./routes/PublicRoutes";

const App = () => (
  <AppProviders>
    <Routes>
      {/* Use the components as fragments containing routes */}
      <PublicRoutes />
      <AdminRoutes />
    </Routes>
  </AppProviders>
);

export default App;
