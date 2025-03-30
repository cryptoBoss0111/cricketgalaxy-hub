
import { supabase } from '@/integrations/supabase/client';

const addIplBlogPost = async () => {
  try {
    // First, save the article
    const { data: articleData, error: articleError } = await supabase
      .from('articles')
      .insert({
        title: "Today's IPL Banger – Delhi Capitals vs. Sunrisers Hyderabad",
        excerpt: "Visakhapatnam Vibes: DC Smashed It! Delhi Capitals rolled up against Sunrisers Hyderabad and owned the pitch with a cool 7-wicket win.",
        content: `Today's clash in Visakhapatnam was straight-up! Delhi Capitals (DC) rolled up against Sunrisers Hyderabad (SRH) and owned the pitch. Picture this: SRH batting first, and boom—Mitchell Starc comes in like a wrecking ball, sending Travis Head packing for the sixth time in top-tier cricket. SRH crumbled to 37/4 in just 5 overs—ouch! DC's bowlers were on demon mode, with Starc snagging 3 wickets in no time. SRH tried to fight back with debutant Zeeshan Ansari dropping some spin magic, but DC chased it down with a cool 7-wicket win. Rishabh Pant was out there flexing with a quickfire 40-odd, sealing the deal by 9:30 PM IST. Absolute scenes! Catch the replay on JioCinema if you slept on this one.`,
        category: "IPL 2025",
        cover_image: "/lovable-uploads/0906a92f-bb5d-4df5-a599-c222c9bf0a5b.png",
        featured_image: "/lovable-uploads/0906a92f-bb5d-4df5-a599-c222c9bf0a5b.png",
        published: true,
        published_at: new Date().toISOString(),
        tags: ["IPL", "Delhi Capitals", "Sunrisers Hyderabad", "Match Review"]
      })
      .select()
      .single();
    
    if (articleError) throw articleError;
    
    // Add to top stories
    const { error: topStoryError } = await supabase
      .from('top_stories')
      .insert({
        article_id: articleData.id,
        order_index: 1, // Will be displayed first
        featured: true,
      });
    
    if (topStoryError) {
      console.error("Error adding to top stories:", topStoryError);
    }
    
    // Add to hero slider
    const { error: heroSliderError } = await supabase
      .from('hero_slider')
      .insert({
        article_id: articleData.id,
        order_index: 1, // Will be displayed first
        is_active: true,
      });
    
    if (heroSliderError) {
      console.error("Error adding to hero slider:", heroSliderError);
    }
    
    console.log("Blog post created successfully:", articleData);
    
    return articleData;
    
  } catch (error: any) {
    console.error('Error saving blog post:', error);
    throw error;
  }
};

// This function can be exported and run manually
// or you can use it in the admin panel
export default addIplBlogPost;
