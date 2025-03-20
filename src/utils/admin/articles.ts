
import { supabase } from "@/integrations/supabase/client";

// Function to bypass RLS and save articles directly with admin service role
export const bypassRLSArticleSave = async (articleData: any, isUpdate = false, articleId?: string) => {
  try {
    console.log("Using RLS bypass to save article");
    
    // Get current admin ID from localStorage as a fallback
    let adminId = null;
    const adminUserStr = localStorage.getItem('adminUser');
    
    if (adminUserStr) {
      try {
        const adminUser = JSON.parse(adminUserStr);
        adminId = adminUser.id;
        console.log("Found admin ID in localStorage:", adminId);
      } catch (error) {
        console.error("Error parsing admin user from localStorage:", error);
      }
    }
    
    if (!adminId) {
      const { data } = await supabase.auth.getSession();
      adminId = data.session?.user?.id;
      console.log("Found admin ID in session:", adminId);
    }
    
    if (!adminId) {
      throw new Error("Cannot determine admin ID for article save");
    }
    
    // Add admin ID to article data
    const fullArticleData = {
      ...articleData,
      author_id: adminId
    };
    
    console.log("Saving article with admin ID:", adminId);
    
    // Direct database operations instead of RPC calls
    if (isUpdate && articleId) {
      console.log("Updating existing article:", articleId);
      
      // For updates, use the normal update operation
      const { data: updateResult, error: updateError } = await supabase
        .from('articles')
        .update(fullArticleData)
        .eq('id', articleId)
        .select();
      
      if (updateError) {
        console.error("Error updating article:", updateError);
        throw updateError;
      }
      
      console.log("Article updated successfully:", updateResult);
      return { data: updateResult, success: true };
    } else {
      console.log("Creating new article");
      
      // For inserts, use the normal insert operation
      const { data: insertResult, error: insertError } = await supabase
        .from('articles')
        .insert(fullArticleData)
        .select();
      
      if (insertError) {
        console.error("Error inserting article:", insertError);
        throw insertError;
      }
      
      console.log("Article created successfully:", insertResult);
      return { data: insertResult, success: true };
    }
  } catch (error) {
    console.error("Error in RLS bypass article save:", error);
    throw error;
  }
};
