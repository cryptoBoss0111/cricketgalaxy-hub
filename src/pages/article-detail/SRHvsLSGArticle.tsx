
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { mockNewsArticles } from '../cricket-news/data/mockNewsArticles';

const SRHvsLSGArticle = () => {
  // For this article we'll create a custom object since it's not in the mockNewsArticles yet
  const article = {
    id: 'srh-vs-lsg',
    title: "Sunrisers Hyderabad vs. Lucknow Super Giants – Hyderabad's Powerplay Party!",
    excerpt: "Yo, squad! On March 27, 2025, IPL 2025 dropped a top story banger—Sunrisers Hyderabad (SRH) vs. Lucknow Super Giants (LSG) at Rajiv Gandhi International Stadium, Match 7. SRH's batting fireworks lit up Hyderabad, and LSG fought hard.",
    imageUrl: "/lovable-uploads/95f7655d-a0d9-48a3-a64c-a8f362d04b31.png",
    category: "IPL 2025",
    author: "CricketExpress Team",
    date: "March 27, 2025",
    timeToRead: "5 min read"
  };

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
              <h2 className="text-xl md:text-2xl font-bold mb-4">The Scene – Hyderabad Hype</h2>
              <p className="font-bold">7:30 PM IST: Orange Army Roars!</p>
              <p>Rajiv Gandhi Stadium was an orange wave—SRH fans hyping their squad. SRH won the toss, chose to bat—Pat Cummins betting on their powerplay kings. X was popping: "SRH's about to explode!"—let's roll!</p>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">SRH's Blast – Head & Abhishek Go Nuts</h2>
              <p className="font-bold">198/5 in 20 – Run Riot!</p>
              <p>Travis Head was a demon—82 off 46, smashing 6 sixes. Abhishek Sharma dropped 55 off 31—together, they put 120 on in 10 overs! Heinrich Klaasen's 28* off 12 sealed 198/5. LSG's Ravi Bishnoi (2/39) got Head, but Mohsin Khan got torched for 50 in 4. X was wild: "Head-Abhishek duo's unfair!" LSG's challenge was set!</p>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">LSG's Fight – Pooran Pushes Hard</h2>
              <p className="font-bold">184/7 in 20 – Close Call!</p>
              <p>LSG's chase had hope—KL Rahul's 38 was steady, but Nicholas Pooran's 66 off 40 almost flipped it. SRH's Bhuvneshwar Kumar (3/28) snagged Rahul, and Pat Cummins (2/34) shut it down—184/7, SRH win by 14 runs! X fans were like, "Pooran's a beast, but SRH's too strong!"</p>
              
              <div className="my-8 rounded-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/95f7655d-a0d9-48a3-a64c-a8f362d04b31.png"
                  alt="Head launching a six, Hyderabad's orange crowd erupting under lights"
                  className="w-full h-auto" 
                />
                <p className="text-center text-sm text-gray-500 mt-2">
                  SRH's powerplay owns LSG—IPL 2025 heat! Want this? Say it!
                </p>
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">Top Stars</h2>
              <p className="font-bold">Head & Bhuvneshwar Ball Out!</p>
              <p>Travis Head's 82 was insane—Player of the Match. Bhuvneshwar's 3-fer was clutch, and Pooran's 66 was fire. X vibes: "SRH's powerplay kings!"</p>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">Relive the Party</h2>
              <p className="font-bold">Catch It!</p>
              <p>Star Sports and JioCinema got the replay—highlights on IPLT20.com show Head's sixes and Bhuvneshwar's swing. #SRHvsLSG on X for the hype!</p>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">Final Word</h2>
              <p>SRH's 14-run W over LSG on March 27, 2025, was a top-story flex—Head and Abhishek setting records, Bhuvneshwar sealing it. LSG's got fight, but SRH's a beast. Who's your hero? Drop it!</p>
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
                .filter(a => a.category === 'IPL 2025')
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

export default SRHvsLSGArticle;
