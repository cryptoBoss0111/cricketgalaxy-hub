
import { Routes, Route } from "react-router-dom";
import { AppProviders } from "./routes/AppProviders";
import { AdminRoutes } from "./routes/AdminRoutes";
import { PublicRoutes } from "./routes/PublicRoutes";

const App = () => (
  <AppProviders>
    <Routes>
      <Route>
        <PublicRoutes />
      </Route>
      <Route>
        <AdminRoutes />
      </Route>
    </Routes>
  </AppProviders>
);

export default App;
