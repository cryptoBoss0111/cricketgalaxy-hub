
import { Routes, Route } from "react-router-dom";
import { AppProviders } from "./routes/AppProviders";
import Home from "./pages/Home";
import CricketNews from "./pages/cricket-news";
import ArticleDetail from "./pages/ArticleDetail";
import NotFound from "./pages/NotFound";

const App = () => (
  <AppProviders>
    <Routes>
      {/* Public Routes */}
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

      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AppProviders>
);

export default App;
