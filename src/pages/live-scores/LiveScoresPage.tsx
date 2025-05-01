
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import CricTimesEmbed from '@/components/CricTimesEmbed';

const LiveScoresPage = () => {
  return (
    <div className="min-h-screen bg-cricket-dark">
      <Helmet>
        <title>Live Scores | CricketExpress</title>
      </Helmet>
      
      <Navbar />
      
      <div className="container mx-auto py-6 px-4 mt-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            IPL 2025 Live Scores
          </h1>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Live Cricket Scores</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <CricTimesEmbed height="560px" />
          </div>
        </div>
        
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">About Live Scores</h2>
          <p className="mb-4">
            Stay updated with real-time cricket scores from around the world. Our live score 
            service provides updates for all international and major domestic cricket matches,
            with special focus on IPL 2025 matches.
          </p>
          <p>
            Live scores are powered by CricTimes to ensure you always have access to the most 
            accurate and up-to-date cricket scores.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveScoresPage;
