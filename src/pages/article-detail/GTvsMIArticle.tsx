
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { mockNewsArticles } from '../cricket-news/data/mockNewsArticles';

const GTvsMIArticle = () => {
  // Get the article data from mock data
  const article = mockNewsArticles.find(article => article.id === 'gt-vs-mi');
  
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
              <h2 className="text-xl md:text-2xl font-bold mb-4">The Vibes – Ahmedabad Goes Wild</h2>
              <p className="font-bold">7:30 PM IST: Stadium on Fire!</p>
              <p>Narendra Modi Stadium was a sea of blue and orange—over 100,000 fans screaming their lungs out. GT won the toss and chose to bat, banking on that flat Ahmedabad deck where 200+ is the vibe. MI, 0-2 after losses to CSK and GT earlier, were starving for a W. Hardik Pandya's boys rolled in with fire in their eyes—X posts from @MIPaltan were all "Duniya Hila Denge tonight!" Game on!</p>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">GT's Batting Blast – Gill & Co. Set It Off</h2>
              <p className="font-bold">189/6 in 20 – Runs Galore!</p>
              <p>Shubman Gill walked out like a king—captain vibes on max—and smashed 67 off 41, piercing gaps like a laser. Sai Sudharsan backed him up with a silky 45, and Rashid Khan's late 22* off 10 (two sixes!) pushed GT to 189/6. MI's Jasprit Bumrah was a beast—3/28, including Gill's scalp—but Vignesh Puthur got smoked for 40 in 3 overs. X fans were hyped: "Gill's on a mission!" GT set a mountain—could MI climb it?</p>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">MI's Chase – Rohit & SKY Turn Up</h2>
              <p className="font-bold">190/6 in 19.4 – Clutch City!</p>
              <p>MI's chase was a rollercoaster—Rohit Sharma dropped 52 off 32 to shut up the "form slump" haters, and Suryakumar Yadav went full SKY-mode with 77* off 44—sixes flying into the stands. GT's Jofra Archer (2/35) got Ishan Kishan early, but MI's middle order held it down. Last over, 6 needed—Hardik smacks a four off Mohit Sharma, and SKY seals it with a boundary. 190/6 in 19.4—MI's first W! X exploded: "SKY's unreal!"</p>
              
              <div className="my-8 rounded-lg overflow-hidden">
                <img 
                  src={article.imageUrl}
                  alt="MI's comeback king SKY owns GT—IPL 2025 gold!"
                  className="w-full h-auto" 
                />
                <p className="text-center text-sm text-gray-500 mt-2">
                  MI's comeback king SKY owns GT—IPL 2025 gold! Say the word for this pic!
                </p>
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">MVPs – Who Owned Ahmedabad?</h2>
              <p className="font-bold">SKY & Bumrah Steal It!</p>
              <p>Suryakumar Yadav's unbeaten 77 was pure class—Player of the Match vibes. Bumrah's 3-fer kept MI in it, while Gill's 67 was GT's heartbeat. X was all "MI's back, baby!"—this win flipped their season script.</p>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">Relive the Heat</h2>
              <p className="font-bold">Catch It Again!</p>
              <p>Missed it? Star Sports and JioCinema got the replay—highlights on IPLT20.com show SKY's sixes and Bumrah's yorkers. Search #GTvsMI on X for the wild fan takes!</p>
              
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">Wrap-Up</h2>
              <p>MI's 4-wicket thriller over GT on March 29, 2025, was a top story for the ages—Rohit and SKY turning despair into hype. GT's home L stings, but Gill's form is a vibe. Who's your MVP? Drop it below!</p>
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
                .filter(a => a.id !== 'gt-vs-mi' && a.category === 'IPL 2025')
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

export default GTvsMIArticle;
