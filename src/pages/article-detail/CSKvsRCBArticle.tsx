
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { mockNewsArticles } from '../cricket-news/data/mockNewsArticles';

const CSKvsRCBArticle = () => {
  // Get the article data from mock data
  const article = mockNewsArticles.find(article => article.id === 'csk-vs-rcb');
  
  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex-grow">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <p className="mb-8">The article you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/cricket-news">Back to Cricket News</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-cricket-dark">
      <Navbar />
      
      {/* Hero section with image */}
      <div className="relative">
        <div className="w-full h-[40vh] md:h-[50vh] bg-cricket-dark">
          <img 
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container mx-auto">
              <span className="inline-block bg-cricket-accent text-white px-3 py-1 rounded-full text-sm mb-4">
                {article.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl text-white font-bold max-w-4xl">
                {article.title}
              </h1>
            </div>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <Link to="/cricket-news" className="inline-flex items-center text-cricket-accent hover:text-cricket-accent/80 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cricket News
          </Link>
          
          <Card className="p-6 md:p-8 shadow-lg">
            <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-6 gap-4">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {article.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {article.date}
              </div>
              {article.timeToRead && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {article.timeToRead}
                </div>
              )}
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-xl md:text-2xl font-bold mb-4">The Scene – Chepauk Roars</h2>
              <p className="font-bold">7:30 PM IST: Yellow Army Unleashed!</p>
              <p>MA Chidambaram Stadium was a yellow tsunami—CSK fans chanting "Dhoni! Dhoni!" even if the GOAT's just mentoring now. RCB won the toss, chose to field—Rajat Patidar banking on dew to chase. X was popping: "Chepauk's a fortress—RCB's toast!" Let's roll!</p>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">CSK's Innings – Gaikwad Sets the Tone</h2>
              <p className="font-bold">171/5 in 20 – Solid Gold!</p>
              <p>Ruturaj Gaikwad walked out like a boss—63 off 47, all class and timing. Rachin Ravindra chipped in with 37, and Shivam Dube's 28* off 14 (two sixes!) gave CSK 171/5. RCB's Josh Hazlewood (2/30) kept it tight, but Krunal Pandya got smoked for 42 in 3. X fans were like, "Gaikwad's the real deal!"—RCB had work to do.</p>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">RCB's Reply – Kohli Falls, Salt Rises</h2>
              <p className="font-bold">168/8 in 20 – So Close!</p>
              <p>RCB's chase started hot—Phil Salt smashed 45 off 28—but Virat Kohli's 22 ended quick, Jadeja snagging him on the spin-friendly deck. Liam Livingstone (33) kept hope alive, but Matheesha Pathirana's slingy 3/26 (including Salt) flipped it. Last over, 12 needed—Noor Ahmad holds Livingstone to a single off the last ball. 168/8—CSK win by 3 runs! X went nuts: "Chepauk magic strikes again!"</p>
              
              <div className="my-8 rounded-lg overflow-hidden">
                <img 
                  src={article.imageUrl}
                  alt="Gaikwad flicking a boundary, Chepauk's yellow sea roaring under lights"
                  className="w-full h-auto" 
                />
                <p className="text-center text-sm text-gray-500 mt-2">
                  CSK's fortress holds—IPL 2025 thriller! Want this pic? Holler!
                </p>
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">Stars of the Night</h2>
              <p className="font-bold">Gaikwad & Pathirana Shine!</p>
              <p>Ruturaj's 63 was the anchor—Player of the Match. Pathirana's 3-fer was clutch, and Salt's 45 almost stole it. X vibes: "CSK's home kings!"</p>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">Rewatch the Drama</h2>
              <p className="font-bold">Don't Miss Out!</p>
              <p>Star Sports and JioCinema got the goods—highlights on IPLT20.com show Pathirana's wickets and Gaikwad's flow. #CSKvsRCB on X for the fan frenzy!</p>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">Final Take</h2>
              <p>CSK's 3-run W over RCB on March 28, 2025, was a top-story nail-biter—Gaikwad and Pathirana shutting down Kohli's crew. RCB's streak's done, but they're still dangerous. Who's your hero? Hit me up!</p>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4">Share this article</h3>
              <div className="flex gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                  Twitter
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                  Facebook
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.5 7.5h-4.5v-3h4.5v3zm-6 1.5h4.5v3h-4.5v-3zm-6 0h4.5v3h-4.5v-3zm-6 0h4.5v3h-4.5v-3zm12 6h4.5v3h-4.5v-3zm-12 0h4.5v3h-4.5v-3zm-1.5-13.5v21h24v-21h-24zm21 18h-18v-15h18v15z"/>
                  </svg>
                  WhatsApp
                </Button>
              </div>
            </div>
          </Card>
          
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">More IPL 2025 Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {mockNewsArticles
                .filter(a => a.id !== 'csk-vs-rcb' && a.category === 'IPL 2025')
                .slice(0, 2)
                .map(related => (
                  <Link 
                    key={related.id} 
                    to={`/article/${related.id}`}
                    className="flex gap-4 p-4 bg-white dark:bg-cricket-dark/80 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                      <img 
                        src={related.imageUrl || '/placeholder.svg'} 
                        alt={related.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <span className="text-xs text-cricket-accent">{related.category}</span>
                      <h4 className="font-bold text-md leading-tight mb-1">{related.title}</h4>
                      <span className="text-xs text-gray-500">{related.date}</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CSKvsRCBArticle;
