
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChatbotProvider } from "@/contexts/ChatbotContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ChatbotProvider>
          <BrowserRouter>
            <AdminAuthProvider>
              <Toaster />
              <Sonner />
              {children}
            </AdminAuthProvider>
          </BrowserRouter>
        </ChatbotProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
