
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const DCvsSRHArticle = () => {
  return (
    <>
      <Helmet>
        <title>Today's IPL Banger: Delhi Capitals vs. Sunrisers Hyderabad – DC Owned the Night! | CricketExpress</title>
        <meta 
          name="description" 
          content="Full match report of Delhi Capitals vs Sunrisers Hyderabad IPL 2025 game. DC dominated with a 7-wicket win as Mitchell Starc tore through SRH's batting lineup." 
        />
      </Helmet>

      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-6">
          <Link to="/ipl-2025" className="text-cricket-accent hover:text-cricket-secondary font-medium inline-flex items-center">
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to IPL 2025
          </Link>
        </div>

        <article className="bg-white dark:bg-cricket-dark/80 shadow-lg rounded-lg overflow-hidden">
          <div className="aspect-w-16 aspect-h-9 relative h-96">
            <img 
              src="/lovable-uploads/19133248-8247-4e8c-8615-f3c5b00d9287.png" 
              alt="Delhi Capitals vs Sunrisers Hyderabad" 
              className="w-full h-full object-cover" 
            />
          </div>
          
          <div className="p-6 md:p-8">
            <div className="flex items-center mb-4">
              <span className="bg-cricket-accent text-white text-xs font-bold px-3 py-1 rounded">MATCH REVIEW</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-4">March 30, 2025</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              Today's IPL Banger: Delhi Capitals vs. Sunrisers Hyderabad – DC Owned the Night!
            </h1>
            
            <div className="text-lg md:text-xl font-medium mb-8 text-gray-700 dark:text-gray-300">
              Yo, cricket fam! It's March 30, 2025, and the IPL 2025 just dropped a straight-up banger in Visakhapatnam. Delhi Capitals (DC) rolled up against Sunrisers Hyderabad (SRH) and turned the pitch into their playground. This wasn't just a match—it was a full-on massacre, with DC flexing hard and SRH scrambling to keep up. Buckle up, 'cause we're breaking down all the moments, clutch plays, and wild vibes from this epic showdown. Let's go!
            </div>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2>The Toss & The Stage – Visakhapatnam Lit Up</h2>
              <h3>Game On at 7:30 PM IST!</h3>
              <p>
                The ACA-VDCA Stadium was buzzing like a beehive tonight, with fans decked out in orange and blue, ready to lose their minds. SRH skipper Pat Cummins won the toss and said, "We're batting first, fam—let's set a target!" Big call under the floodlights, with the dew factor lurking like a sneaky villain. DC's captain Rishabh Pant just smirked, knowing his bowling squad was about to bring the heat. The stage was set, the crowd was hyped, and at 7:30 PM IST, it was game on!
              </p>
              
              <h2>SRH's Nightmare Start – Starc Unleashed</h2>
              <h3>37/4 in 5 Overs? Oof!</h3>
              <p>
                SRH's batting lineup walked out like they owned the place, but Mitchell Starc had other plans. First ball of the match, and BOOM—Travis Head's stumps were toast. That's the sixth time Starc's sent Head packing in top-tier cricket—talk about a personal beef! Abhishek Sharma tried to hang tough, but Starc's pace was demonic, snagging him for a duck. By the 5th over, SRH was 37/4—Heinrich Klaasen and Aiden Markram gone too, thanks to Mukesh Kumar joining the party. X was blowing up with fans like, "Starc's a cheat code!" and "SRH's donezo!" Absolute chaos.
              </p>
              
              <h2>SRH's Fightback – Zeeshan Ansari Shines</h2>
              <h3>Debut Kid Steals Some Spotlight!</h3>
              <p>
                Just when it looked like SRH was toast, debutant Zeeshan Ansari stepped up like a boss. This young spinner didn't flinch—bowling tight lines and snagging a wicket later in DC's chase. Pat Cummins chipped in with a gritty 30-odd, and Nitish Reddy smashed a couple of sixes to give SRH some hope. They clawed their way to 142/8 in 20 overs—not massive, but at least it was a target. Fans on X were hyping Ansari, with one dude posting, "New kid's got ice in his veins!" Still, DC smelled blood—this was theirs to take.
              </p>
              
              <h2>DC's Chase – Pant & Co. Stayed Chill</h2>
              <h3>7-Wicket Dub Sealed by 9:30 PM!</h3>
              <p>
                Chasing 143? Pfft, DC laughed at that. Openers Jake Fraser-McGurk and David Warner set the tone—Fraser-McGurk smashed a quick 25, including a monster six that had the crowd roaring. Warner played anchor, but it was Rishabh Pant who stole the show. Dude walked in at No. 3, all swagger, and dropped a silky 44 off 28 balls—fours, sixes, and that trademark grin. SRH threw everything at 'em—Umran Malik's pace, Cummins' cutters, Ansari's spin—but DC wasn't fazed. They wrapped it up with 7 wickets in hand and overs to spare, cruising home by 9:30 PM IST. Total domination.
              </p>
              
              <h2>Standout Stars – Who Owned It?</h2>
              <h3>Starc & Pant, Take a Bow!</h3>
              <p>
                Mitchell Starc was the MVP, no cap—3 wickets for peanuts, tearing SRH apart like it was personal. Pant was the chase king, cool as ice and hitting like a truck. Shoutout to Zeeshan Ansari, though—SRH's debut hero kept it respectable. X fans were all over it: "Starc's worth every crore!" and "Pant's back, baby!" These dudes turned the game into their highlight reel.
              </p>
              
              <h2>How to Relive the Hype</h2>
              <h3>Catch the Action Again!</h3>
              <p>
                Missed the live vibes? Star Sports had the broadcast locked down, and JioCinema streamed it free for some lucky subscribers—replays are still up there. Highlights are popping on IPLT20.com, with Starc's wickets and Pant's sixes on loop. X is wild with clips too—search #DCvsSRH for the fan takes. Don't sleep on this one!
              </p>
            </div>
            
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  By <span className="font-semibold">CricketExpress Team</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Published: March 30, 2025
                </div>
              </div>
            </div>
          </div>
        </article>
        
        <div className="mt-10 mb-6">
          <Link to="/ipl-2025" className="text-cricket-accent hover:text-cricket-secondary font-medium inline-flex items-center">
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to IPL 2025
          </Link>
        </div>
      </div>
    </>
  );
};

export default DCvsSRHArticle;
