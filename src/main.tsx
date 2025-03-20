import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Home } from './pages/Home.tsx'
import { Index } from './pages/Index.tsx'
import CricketNews from './pages/CricketNews.tsx'
import Auth from './pages/Auth.tsx'
import NotFound from './pages/NotFound.tsx'
import AdminDashboard from './admin/AdminDashboard.tsx'
import AdminLogin from './admin/AdminLogin.tsx'
import ArticleDetail from './components/ArticleDetail.tsx'
import PlayerProfiles from './pages/PlayerProfiles.tsx'
import UpcomingMatches from './pages/UpcomingMatches.tsx'
import FantasyPicks from './pages/FantasyPicks.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
