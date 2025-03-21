
import { Route } from "react-router-dom";
import Home from "@/pages/Home";
import CricketNews from "@/pages/cricket-news";
import ArticleDetail from "@/pages/ArticleDetail";
import AdminLogin from "@/admin/AdminLogin";
import NotFound from "@/pages/NotFound";

export const PublicRoutes = () => {
  return (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/cricket-news" element={<CricketNews />} />
      <Route path="/match-previews" element={<CricketNews />} />
      <Route path="/match-reviews" element={<CricketNews />} />
      <Route path="/fantasy-tips" element={<CricketNews />} />
      <Route path="/player-profiles" element={<CricketNews />} />
      <Route path="/ipl-2025" element={<CricketNews />} />
      <Route path="/womens-cricket" element={<CricketNews />} />
      <Route path="/world-cup" element={<CricketNews />} />
      <Route path="/article/:id" element={<ArticleDetail />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="*" element={<NotFound />} />
    </>
  );
};
