
import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/home/HomePage";
import NotFound from "@/pages/NotFound";
import CricketNewsPage from "@/pages/cricket-news";
import ArticleDetail from "@/pages/ArticleDetail";
import FantasyTipsPage from "@/pages/fantasy-tips";
import IPL2025Page from "@/pages/ipl-2025";

// PublicRoutes component that renders all public routes
export const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cricket-news" element={<CricketNewsPage />} />
      <Route path="/article/:id" element={<ArticleDetail />} />
      <Route path="/fantasy-tips" element={<FantasyTipsPage />} />
      <Route path="/ipl-2025" element={<IPL2025Page />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
