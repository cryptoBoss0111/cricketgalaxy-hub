
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-blue-900">Welcome to Cricket Express</h1>
          <p className="text-xl text-gray-700 mb-8">Your one-stop destination for cricket news, live matches, player profiles, and fantasy predictions</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-3 text-blue-800">Latest News</h2>
              <p className="text-gray-600">Stay updated with breaking cricket news from around the world.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-3 text-blue-800">Live Matches</h2>
              <p className="text-gray-600">Get real-time scores and updates for ongoing cricket matches.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-3 text-blue-800">Fantasy Picks</h2>
              <p className="text-gray-600">Expert recommendations for your fantasy cricket teams.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
