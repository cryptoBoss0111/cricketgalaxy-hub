import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import { HomePage } from '@/pages/Home';
import IPL2025Page from '@/pages/ipl-2025';
import LiveScoresPage from '@/pages/live-scores';
import IPLTeamsPage from '@/pages/ipl-teams';
import CricketNewsPage from '@/pages/cricket-news';
import NotFound from '@/pages/NotFound';
import FantasyTipsPage from '@/pages/fantasy-tips';

// Admin Routes
import AdminRoutes from '@/routes/AdminRoutes';

// Article detail pages
import GTvsMIArticle from '@/pages/article-detail/GTvsMIArticle';
import CSKvsRCBArticle from '@/pages/article-detail/CSKvsRCBArticle';
import RRvsCSKArticle from '@/pages/article-detail/RRvsCSKArticle';
import KKRvsRCBArticle from '@/pages/article-detail/KKRvsRCBArticle';
import SRHvsLSGArticle from '@/pages/article-detail/SRHvsLSGArticle';
import DCvsSRHArticle from '@/pages/ArticleDetail/DCvsSRHArticle';
import MIvsKKRArticle from '@/pages/ArticleDetail/MIvsKKRArticle';
import RCBvsDCArticle from '@/pages/article-detail/RCBvsDCArticle';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check local storage for theme preference on initial load
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  useEffect(() => {
    // Update the data-theme attribute on the root element
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/ipl-2025" element={<IPL2025Page />} />
        <Route path="/live-scores" element={<LiveScoresPage />} />
        <Route path="/ipl-teams" element={<IPLTeamsPage />} />
        <Route path="/cricket-news" element={<CricketNewsPage />} />
        <Route path="/fantasy-tips" element={<FantasyTipsPage />} />
        
        {/* Article detail pages */}
        <Route path="/article/rcb-vs-dc" element={<RCBvsDCArticle />} />
        <Route path="/article/gt-vs-mi" element={<GTvsMIArticle />} />
        <Route path="/article/csk-vs-rcb" element={<CSKvsRCBArticle />} />
        <Route path="/article/rr-vs-csk" element={<RRvsCSKArticle />} />
        <Route path="/article/kkr-vs-rcb" element={<KKRvsRCBArticle />} />
        <Route path="/article/srh-vs-lsg" element={<SRHvsLSGArticle />} />
        <Route path="/article/dc-vs-srh" element={<DCvsSRHArticle />} />
        <Route path="/article/mi-vs-kkr" element={<MIvsKKRArticle />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
