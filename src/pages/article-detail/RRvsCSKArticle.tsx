
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { mockNewsArticles } from '../cricket-news/data/mockNewsArticles';

const RRvsCSKArticle = () => {
  // Get the article data from mock data
  const article = mockNewsArticles.find(article => article.id === 'rr-vs-csk');
  
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
              <h2 className="text-xl md:text-2xl font-bold mb-4">The Setup – Guwahati Glows</h2>
              <p className="font-bold">7:30 PM IST: RR's Second Home!</p>
              <p>Barsapara was rocking—RR's Guwahati faithful vs. CSK's traveling yellow army. CSK won the toss, chose to bat—Ruturaj Gaikwad betting on a big total. X was hyped: "RR's got this at home!"—game time!</p>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">CSK's Blast – Ravindra Goes Off</h2>
              <p className="font-bold">183/4 in 20 – Big Runs!</p>
              <p>Rachin Ravindra was a monster—78 off 49, smashing boundaries like it's nothing. Gaikwad added 41, and Dube's 18* off 8 pushed CSK to 183/4. RR's Jofra Archer (2/38) fought back, but Wanindu Hasaranga got lit up for 45 in 4. X was buzzing: "Ravindra's a cheat code!" RR had a chase on their hands!</p>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">RR's Fight – Parag's Hometown Heroics</h2>
              <p className="font-bold">184/6 in 19.5 – Clutch Win!</p>
              <p>RR's reply was wild—Yashasvi Jaiswal's 33 got 'em rolling, but Riyan Parag stole it—64* off 39 in his Guwahati backyard. Jos Buttler chipped in with 27, and despite Jadeja's 2/29, Parag smashed Noor Ahmad for a six to win it—184/6 in 19.5. 4-wicket W! X lost it: "Parag's a hometown king!"</p>
              
              <div className="my-8 rounded-lg overflow-hidden">
                <img 
                  src={article.imageUrl}
                  alt="Parag smashing the winning six, Guwahati crowd erupting under lights"
                  className="w-full h-auto" 
                />
                <p className="text-center text-sm text-gray-500 mt-2">
                  RR's Guwahati prince owns CSK—IPL 2025 heat! Want this? Say it!
                </p>
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">Top Dogs</h2>
              <p className="font-bold">Parag & Ravindra Ball Out!</p>
              <p>Riyan Parag's 64* was clutch—Player of the Match. Ravindra's 78 set the stage, and Archer's 2-fer kept RR in it. X vibes: "Parag's arrived!"</p>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">Catch the Replay</h2>
              <p className="font-bold">Relive It!</p>
              <p>Star Sports and JioCinema got you—highlights on IPLT20.com show Parag's sixes and Ravindra's flow. #RRvsCSK on X for the hype!</p>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">Wrap</h2>
              <p>RR's 4-wicket thriller over CSK on March 30, 2025, was a top-story gem—Parag's heroics edging Ravindra's fire. CSK's strong, but RR's home vibes hit different. Who's your star? Drop it!</p>
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
                .filter(a => a.id !== 'rr-vs-csk' && a.category === 'IPL 2025')
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

export default RRvsCSKArticle;
