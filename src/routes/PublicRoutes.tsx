
import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/home/HomePage";
import NotFound from "@/pages/NotFound";
import CricketNewsPage from "@/pages/cricket-news";
import ArticleDetail from "@/pages/ArticleDetail";
import FantasyTipsPage from "@/pages/fantasy-tips";

// PublicRoutes component that renders all public routes
export const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cricket-news" element={<CricketNewsPage />} />
      <Route path="/article/:id" element={<ArticleDetail />} />
      <Route path="/fantasy-tips" element={<FantasyTipsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
