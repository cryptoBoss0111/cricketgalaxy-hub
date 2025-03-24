
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AppProviders } from './routes/AppProviders.tsx'
import { ThemeProvider } from './components/ThemeProvider.tsx'
import { FreeWarProvider } from './components/free-war/FreeWarProvider.tsx'

createRoot(document.getElementById("root")!).render(
  <AppProviders>
    <ThemeProvider defaultTheme="light" storageKey="cricket-express-theme">
      <FreeWarProvider>
        <App />
      </FreeWarProvider>
    </ThemeProvider>
  </AppProviders>
);
