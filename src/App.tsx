
import { Suspense, lazy } from 'react';
import { AppProviders } from './routes/AppProviders';
import PublicRoutes from './routes/PublicRoutes';
import AdminRoutes from './routes/AdminRoutes';

import './App.css';

const App = () => {
  return (
    <AppProviders>
      <Suspense fallback={<div>Loading...</div>}>
        <PublicRoutes />
        <AdminRoutes />
      </Suspense>
    </AppProviders>
  );
};

export default App;
