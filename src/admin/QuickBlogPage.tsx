
import React, { useState } from 'react';
import AdminLayout from '@/admin/AdminLayout';
import BlogUploader from '@/components/admin/BlogUploader';
import { Button } from '@/components/ui/button';

const QuickBlogPage = () => {
  const [isPrefilled, setIsPrefilled] = useState(false);
  
  // Sample prefilled data for the IPL match blog
  const iplMatchData = {
    title: "Today's IPL Banger – Delhi Capitals vs. Sunrisers Hyderabad",
    excerpt: "Visakhapatnam Vibes: DC Smashed It! Delhi Capitals rolled up against Sunrisers Hyderabad and owned the pitch with a cool 7-wicket win.",
    content: `Today's clash in Visakhapatnam was straight-up! Delhi Capitals (DC) rolled up against Sunrisers Hyderabad (SRH) and owned the pitch. Picture this: SRH batting first, and boom—Mitchell Starc comes in like a wrecking ball, sending Travis Head packing for the sixth time in top-tier cricket. SRH crumbled to 37/4 in just 5 overs—ouch! DC's bowlers were on demon mode, with Starc snagging 3 wickets in no time. SRH tried to fight back with debutant Zeeshan Ansari dropping some spin magic, but DC chased it down with a cool 7-wicket win. Rishabh Pant was out there flexing with a quickfire 40-odd, sealing the deal by 9:30 PM IST. Absolute scenes! Catch the replay on JioCinema if you slept on this one.`,
    category: "IPL 2025",
    imageUrl: "/lovable-uploads/0906a92f-bb5d-4df5-a599-c222c9bf0a5b.png",
    tags: "IPL, Delhi Capitals, Sunrisers Hyderabad, Match Review",
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-6">Quick Blog Post</h1>
        <p className="text-gray-500 mb-6">
          Use this form to quickly create and publish blog posts to various sections of the site.
        </p>
        
        <div className="mb-6 flex gap-4">
          <Button 
            onClick={() => setIsPrefilled(true)}
            variant={isPrefilled ? "default" : "outline"}
          >
            Use DC vs SRH Match Template
          </Button>
          <Button 
            onClick={() => setIsPrefilled(false)}
            variant={!isPrefilled ? "default" : "outline"}
          >
            Start Fresh
          </Button>
        </div>
        
        <BlogUploader prefilledData={isPrefilled ? iplMatchData : undefined} />
      </div>
    </AdminLayout>
  );
};

export default QuickBlogPage;
