import { supabase } from "@/integrations/supabase/client";

// Demo credentials for fallback authentication
const DEMO_ADMIN_EMAIL = 'admin@cricketexpress.com';
const DEMO_ADMIN_ID = 'demo-admin-id';

// Helper function to check admin status with better fallback mechanisms
export const checkAdminStatus = async () => {
  try {
    console.log("Checking admin status...");
    
    // First check for a demo admin token in localStorage
    const adminToken = localStorage.getItem('adminToken');
    const adminUserStr = localStorage.getItem('adminUser');
    
    if (adminToken === 'authenticated' && adminUserStr) {
      try {
        const adminUserObj = JSON.parse(adminUserStr);
        
        // Special case for demo admin
        if (adminUserObj.id === DEMO_ADMIN_ID) {
          console.log("Demo admin authenticated via localStorage");
          return { 
            isAdmin: true, 
            session: null,
            message: "Demo admin authenticated"
          };
        }
      } catch (error) {
        console.error("Error parsing admin user data:", error);
      }
    }
    
    // Check with Supabase auth
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      
      // Fall back to stored admin token if session check fails
      if (adminToken === 'authenticated' && adminUserStr) {
        try {
          const adminUserObj = JSON.parse(adminUserStr);
          if (adminUserObj.id === DEMO_ADMIN_ID) {
            return { 
              isAdmin: true, 
              session: null,
              message: "Demo admin authenticated via fallback"
            };
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
      
      return { 
        isAdmin: false, 
        session: null,
        message: "Session error: " + sessionError.message
      };
    }
    
    // If we have a session, check if the user is an admin
    if (sessionData.session) {
      console.log("Found active session:", sessionData.session.user.id);
      
      try {
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('id')
          .eq('id', sessionData.session.user.id)
          .maybeSingle();
        
        if (adminError) {
          console.error("Admin check error:", adminError);
          return { 
            isAdmin: false, 
            session: sessionData.session,
            message: "Admin verification error: " + adminError.message
          };
        }
        
        if (adminData) {
          console.log("User confirmed as admin in database");
          
          // Store admin info for faster checks
          localStorage.setItem('adminToken', 'authenticated');
          localStorage.setItem('adminUser', JSON.stringify({ 
            id: sessionData.session.user.id,
            role: 'admin'
          }));
          
          return { 
            isAdmin: true, 
            session: sessionData.session,
            message: "Admin authenticated"
          };
        } else {
          console.log("User is not an admin");
          
          // Clear any stale admin tokens
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          
          return { 
            isAdmin: false, 
            session: sessionData.session,
            message: "User is not an admin"
          };
        }
      } catch (dbError) {
        console.error("Database error during admin check:", dbError);
        return { 
          isAdmin: false, 
          session: sessionData.session,
          message: "Database error during admin verification"
        };
      }
    }
    
    // No valid session or token
    console.log("No admin authentication found");
    return { 
      isAdmin: false, 
      session: null,
      message: "No active session found"
    };
  } catch (error) {
    console.error("Admin verification error:", error);
    return { 
      isAdmin: false, 
      session: null,
      message: "Authentication error"
    };
  }
};

// Helper function to sign out admin
export const signOutAdmin = async () => {
  try {
    console.log("Signing out admin...");
    
    // Clear Supabase session
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during Supabase signout:", error);
    }
    
    // Clear legacy tokens
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    return { success: true };
  } catch (error) {
    console.error("Error during admin signout:", error);
    
    // Still remove local tokens on error
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    return { success: false, error };
  }
};

// Admin login function with improved error handling and demo support
export const loginAdmin = async (email: string, password: string) => {
  try {
    console.log("Attempting admin login...");
    
    // Special case for demo credentials
    if (email === DEMO_ADMIN_EMAIL && password === 'admin123') {
      console.log("Using demo credentials");
      
      // Store demo admin info in local storage
      localStorage.setItem('adminToken', 'authenticated');
      localStorage.setItem('adminUser', JSON.stringify({ 
        username: email, 
        role: 'admin',
        id: DEMO_ADMIN_ID
      }));
      
      return { 
        success: true, 
        message: "Demo login successful",
        demoLogin: true
      };
    }
    
    // Try to sign in with Supabase auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (authError) {
      console.error("Auth error:", authError);
      throw authError;
    }
    
    if (data?.session) {
      // Verify if this user is an admin
      try {
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('id')
          .eq('id', data.session.user.id)
          .maybeSingle();
        
        if (adminError) {
          console.error("Admin verification error:", adminError);
          throw adminError;
        }
        
        if (adminData) {
          // User is an admin
          console.log("Admin login successful");
          localStorage.setItem('adminToken', 'authenticated');
          localStorage.setItem('adminUser', JSON.stringify({ 
            username: email, 
            role: 'admin',
            id: data.user?.id
          }));
          
          return { 
            success: true, 
            message: "Login successful", 
            user: data.user 
          };
        } else {
          // User exists but is not an admin
          console.log("User exists but is not an admin");
          await supabase.auth.signOut();
          throw new Error("You don't have admin privileges");
        }
      } catch (dbError) {
        console.error("Database error during admin verification:", dbError);
        throw dbError;
      }
    }
    
    // If we reach here, something unexpected happened
    throw new Error("Authentication failed for unknown reason");
  } catch (error: any) {
    console.error("Login error:", error);
    
    // Special check for demo credentials as final fallback
    if (email === DEMO_ADMIN_EMAIL && password === 'admin123') {
      console.log("Demo credentials detected after initial failure, allowing access");
      
      // Store demo admin info
      localStorage.setItem('adminToken', 'authenticated');
      localStorage.setItem('adminUser', JSON.stringify({ 
        username: email, 
        role: 'admin',
        id: DEMO_ADMIN_ID
      }));
      
      return { 
        success: true, 
        message: "Demo login successful (fallback)", 
        demoLogin: true
      };
    }
    
    // Clear any stale tokens on error
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    throw error;
  }
};

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
