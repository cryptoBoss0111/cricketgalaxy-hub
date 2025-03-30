
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const MIvsKKRArticle = () => {
  return (
    <>
      <Helmet>
        <title>Tomorrow's IPL Double-Header: Mumbai Indians vs. Kolkata Knight Riders – Full Hype Breakdown! | CricketExpress</title>
        <meta 
          name="description" 
          content="Get hyped for Mumbai Indians vs. Kolkata Knight Riders clash at Wankhede Stadium. Complete preview of this epic IPL 2025 showdown between the five-time champions and the defending champions." 
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
              src="/lovable-uploads/412c16d3-2e56-4ea0-b086-deed0e90d189.png" 
              alt="Mumbai Indians vs Kolkata Knight Riders" 
              className="w-full h-full object-cover" 
            />
          </div>
          
          <div className="p-6 md:p-8">
            <div className="flex items-center mb-4">
              <span className="bg-cricket-accent text-white text-xs font-bold px-3 py-1 rounded">MATCH PREVIEW</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-4">March 30, 2025</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              Tomorrow's IPL Double-Header: Mumbai Indians vs. Kolkata Knight Riders – Full Hype Breakdown!
            </h1>
            
            <div className="text-lg md:text-xl font-medium mb-8 text-gray-700 dark:text-gray-300">
              Yo, cricket fam! It's March 30, 2025, 11:01 PM IST, and tomorrow—Monday, March 31, 2025—is about to hit us with an IPL 2025 banger! The schedule's locked in, and we've got Mumbai Indians (MI) vs. Kolkata Knight Riders (KKR) lighting up the Wankhede Stadium in Mumbai at 7:30 PM IST. No double-header confusion here—just one epic night match confirmed by ESPNcricinfo and IPLT20.com for Match 12 of the season.
            </div>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2>The Stage – Wankhede Turns Up</h2>
              <h3>7:30 PM IST: Mumbai's House of Chaos!</h3>
              <p>
                Wankhede Stadium's about to explode tomorrow night—March 31, 2025, 7:30 PM IST. MI's home turf is a batting paradise, with short boundaries and a lightning-fast outfield. Last time these two met here (IPL 2024), MI chased down 169 with 8 wickets in hand—Rohit Sharma and Ishan Kishan went nuts. But KKR's coming off their third title win last season, and they're not here to play nice. The crowd? Expect 33,000 screaming fans, blue flags waving, and some serious "Korbo Lorbo Jeetbo" chants clashing with MI's "Duniya Hila Denge" energy. X posts from @IPL are already hyping it: "Wankhede's ready to rumble—MI vs. KKR, who's got this?" Game on!
              </p>
              
              <h2>MI's Game Plan – Home Kings Strike Back</h2>
              <h3>Rohit & Hardik Ready to Flex!</h3>
              <p>
                MI's had a shaky start to IPL 2025—dropped their opener to CSK on March 23 and got smoked by Gujarat Titans on March 29 (per Cricbuzz updates). Tomorrow's do-or-die at home. Rohit Sharma's leading the charge—word on X says he's "fired up after two losses," and his Wankhede record (avg. 35+) is clutch. Hardik Pandya's back as captain, bowling cutters and smashing sixes—his all-rounder vibes could flip this. Suryakumar Yadav's the X-factor—dude's been quiet so far, but Wankhede's his playground (think that 103* vs. GT in 2023). Bowling? Jasprit Bumrah's locked in—already snagged 4 wickets this season—and Akash Madhwal's pace could rattle KKR's top order. MI's hungry, fam!
              </p>
              
              <h2>KKR's Swagger – Champs on a Roll</h2>
              <h3>Narine & Russell Bring the Heat!</h3>
              <p>
                KKR's strutting into Mumbai like they own the IPL—kicked off with a win over RCB on March 22 at Eden Gardens (per ESPNcricinfo) and haven't slowed down. Sunil Narine's the spin god—his 4-fer in the opener shut down RCB, and he's got MI's number (8 wickets in 15 games). Andre Russell? Bro's a one-man wrecking crew—smashed 64* off 25 balls last week and bowled clutch overs. Ajinkya Rahane's captaining this squad (Shreyas Iyer's at PBKS now), keeping it chill but lethal. Rinku Singh's the finisher—X fans are buzzing about his "ice-cold clutch gene." And don't sleep on Harshit Rana—young gun's bowling rockets at 145 kph. KKR's vibin' high!
              </p>
              
              <h2>Key Battles – Who's Gonna Snap?</h2>
              <h3>These Matchups Are Straight Fire!</h3>
              <p>
                Rohit Sharma vs. Sunil Narine: Rohit's smashed 400+ runs off Narine, but the spinner's got him out 5 times. Powerplay vibes—edge of your seat stuff!
              </p>
              <p>
                Andre Russell vs. Jasprit Bumrah: Russ loves pace (think that 49* off MI in 2022), but Bumrah's yorkers are nasty—2 wickets in their last meet. Who blinks?
              </p>
              <p>
                Suryakumar Yadav vs. Varun Chakravarthy: SKY's spin-killer (avg. 50+ vs. mystery spin), but Varun's got that googly locked—caught him out in 2024. Wankhede fireworks incoming!
              </p>
              <p>
                X's buzzing with takes: "If Bumrah gets Russell early, MI's got this!" vs. "Narine's spinning webs—MI's toast!" What's your call?
              </p>
              
              <h2>Pitch & Weather – Runs or Wickets?</h2>
              <h3>Wankhede's Gonna Deliver!</h3>
              <p>
                Wankhede's pitch is a belter—flat, true, and made for chasing. Last game here (MI vs. GT, March 29), GT posted 189, and MI fell short at 171—batting second's the move (teams chasing win 60% here). Weather's clear—28°C, no rain, dew might kick in late, so bowlers better front-load their damage. Toss winner's probs bowling first—X post from @CricTracker says, "Dew at Wankhede's a game-changer after 9 PM." Runs gonna flow, fam!
              </p>
              
              <h2>How to Catch the Action</h2>
              <h3>Live Vibes, No Excuses!</h3>
              <p>
                Tune in at 7:30 PM IST—Star Sports is your TV hookup (Star Sports 1, 1 HD, 1 Hindi, etc.), and JioCinema's streaming it live (free for some plans—check @JioCinema on X). Highlights hit IPLT20.com post-game, and X's gonna be wild with clips—search #MIvsKKR. Global crew? Willow TV (US), Sky Sports (UK), or Kayo Sports (Australia) got you. Don't sleep—Wankhede's about to pop off!
              </p>
              
              <h2>Final Hype</h2>
              <p>
                Tomorrow, March 31, 2025, MI vs. KKR at 7:30 PM IST is THE match to watch. MI's fighting to save their season, KKR's flexing champ status—Wankhede's gonna be a warzone. Who's your pick? Drop it below, and let's vibe through this IPL thriller together!
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

export default MIvsKKRArticle;
