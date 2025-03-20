
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatbotProvider } from "@/contexts/ChatbotContext";
import Home from "./pages/Home";
import CricketNews from "./pages/CricketNews";
import NotFound from "./pages/NotFound";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/Dashboard";
import ArticleForm from "./admin/ArticleForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ChatbotProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cricket-news" element={<CricketNews />} />
            <Route path="/match-previews" element={<CricketNews />} />
            <Route path="/match-reviews" element={<CricketNews />} />
            <Route path="/fantasy-tips" element={<CricketNews />} />
            <Route path="/player-profiles" element={<CricketNews />} />
            <Route path="/ipl-2025" element={<CricketNews />} />
            <Route path="/womens-cricket" element={<CricketNews />} />
            <Route path="/world-cup" element={<CricketNews />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/articles/new" element={<ArticleForm />} />
            <Route path="/admin/articles/edit/:id" element={<ArticleForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ChatbotProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
