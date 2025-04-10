
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const RCBvsDCArticle = () => {
  return (
    <>
      <Helmet>
        <title>RCB vs DC Match Preview - IPL 2025 | CricketExpress</title>
        <meta 
          name="description" 
          content="Royal Challengers Bengaluru vs. Delhi Capitals – RCB's Bengaluru Bash Tonight! Get the latest match preview, team news, and key player battles." 
        />
      </Helmet>

      <Navbar />
      
      <main className="pt-8 pb-16 bg-gray-50 dark:bg-cricket-dark min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className="mb-4 text-cricket-accent hover:text-cricket-accent/80"
            >
              <Link to="/ipl-2025">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to IPL 2025
              </Link>
            </Button>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="bg-cricket-accent text-white text-sm px-3 py-1 rounded-full">
                  IPL 2025
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Clock className="inline-block h-3 w-3 mr-1" />
                  7 min read
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold font-heading leading-tight dark:text-white">
                Royal Challengers Bengaluru vs. Delhi Capitals – RCB's Bengaluru Bash Tonight!
              </h1>
              
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                <span className="flex items-center">
                  <User className="inline-block h-3.5 w-3.5 mr-1" />
                  CricketExpress Team
                </span>
                <span className="flex items-center">
                  <Calendar className="inline-block h-3.5 w-3.5 mr-1" />
                  April 10, 2025
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-cricket-dark/80 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-md">
                <div className="aspect-video relative">
                  <img 
                    src="/lovable-uploads/8ec5d63f-24a2-4a4d-a9f6-6cf819b80504.png"
                    alt="Phil Salt hitting a six for RCB with the Chinnaswamy crowd in the background"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white font-medium">
                      Phil Salt in action for RCB with Chinnaswamy's red crowd going berserk
                    </p>
                  </div>
                </div>
                
                <div className="p-6 prose dark:prose-invert max-w-none">
                  <p className="font-medium text-lg">
                    What's good, bro? Today, April 10, 2025, IPL 2025's top story is Match 24—Royal Challengers Bengaluru (RCB) vs. Delhi Capitals (DC) at M Chinnaswamy Stadium, kicking off at 7:30 PM IST. RCB's riding high after smashing MI, and DC's fresh off a Starc-led win. This is gonna be a banger—let's break it down!
                  </p>
                  
                  <h2>The Hype – Chinnaswamy Lights Up</h2>
                  <h3>7:30 PM IST: Bengaluru's Ready to Roar!</h3>
                  <p>
                    Chinnaswamy's gonna be a red-and-black jungle tonight—RCB fans hyped after their 12-run W over MI on April 7. DC's rolling in with swagger, having crushed SRH by 7 wickets on March 30 (per ESPNcricinfo). Toss is key—X posts from @StarSportsIndia say dew's gonna hit, so bowling first's the move. RCB's Rajat Patidar and DC's Rishabh Pant are locking horns—captain vibes on max!
                  </p>
                  
                  <h2>RCB's Plan – Salt & Kohli Reload</h2>
                  <h3>Batting Fire Incoming!</h3>
                  <p>
                    RCB's 4-1 after five games—third on the points table (per Sportstar). Phil Salt's 288 runs (strike rate 225) make him the Orange Cap king—dude's smashing it like a beast. Virat Kohli's 164 runs keep him steady, and Jitesh Sharma's finishing (40* vs. MI) is clutch. Bowling? Krunal Pandya's 8 wickets (Purple Cap contender) and Josh Hazlewood's pace (5 wickets) got MI shook. X's buzzing: "RCB's finally clicking!"
                  </p>
                  
                  <h2>DC's Fight – Starc & Pant Strike Back</h2>
                  <h3>Vizag Heroes in Town!</h3>
                  <p>
                    DC's 3-2, sitting fifth—Mitchell Starc's 3/22 vs. SRH (March 30) proved his ₹24.75 crore tag. Pant's 44* in that chase was ice, and Jake Fraser-McGurk's 38 off 22 brings the heat. Axar Patel's spin (6 wickets) and Mukesh Kumar's pace (5 wickets) round out a tight unit. X fans are like, "Starc vs. Salt—war's on!"
                  </p>
                  
                  <h2>Key Clashes – Who's Snapping?</h2>
                  <h3>Epic Face-Offs, Bro!</h3>
                  <ul>
                    <li><strong>Phil Salt vs. Mitchell Starc:</strong> Salt's powerplay chaos meets Starc's deadly yorkers—first over's gonna be nuts!</li>
                    <li><strong>Virat Kohli vs. Axar Patel:</strong> Kohli's 3 fifties this season, but Axar's got him out twice in IPL history—spin trap?</li>
                    <li><strong>Rishabh Pant vs. Krunal Pandya:</strong> Pant's aggression vs. Krunal's 8 wickets—middle overs showdown!</li>
                  </ul>
                  
                  <h2>Catch the Action</h2>
                  <h3>Live Tonight, Bro!</h3>
                  <p>
                    Tune in at 7:30 PM IST—Star Sports and JioCinema got the live hookup. Highlights drop on IPLT20.com, and #RCBvsDC on X will be wild. Prediction? RCB's home edge might just pip DC—tight call, tho!
                  </p>
                  
                  <h2>Wrap-Up</h2>
                  <p>
                    RCB vs. DC tonight, April 10, 2025, is a top-story clash—Salt and Kohli vs. Starc and Pant. Who's taking it? Drop your pick, bro!
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-cricket-dark/80 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-md p-6">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Match Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Match</p>
                    <p className="font-medium dark:text-white">IPL 2025, Match 24</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Teams</p>
                    <p className="font-medium dark:text-white">Royal Challengers Bengaluru vs Delhi Capitals</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Venue</p>
                    <p className="font-medium dark:text-white">M Chinnaswamy Stadium, Bengaluru</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                    <p className="font-medium dark:text-white">April 10, 2025, 7:30 PM IST</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Broadcast</p>
                    <p className="font-medium dark:text-white">Star Sports Network & JioCinema</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-cricket-dark/80 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-md p-6">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Key Players to Watch</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                      RCB
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">Phil Salt</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">288 runs, SR: 225</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                      RCB
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">Virat Kohli</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">164 runs, 3 fifties</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      DC
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">Mitchell Starc</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">3/22 vs SRH</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      DC
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">Rishabh Pant</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">44* vs SRH</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default RCBvsDCArticle;
