
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { ChatbotProvider } from '@/contexts/ChatbotContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

// Create a new query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="dark" storageKey="cricket-express-theme">
            <AdminAuthProvider>
              <ChatbotProvider>
                {children}
                <Toaster />
                <SonnerToaster />
              </ChatbotProvider>
            </AdminAuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
};

export default AppProviders;
