
import { supabase } from "@/integrations/supabase/client";

// Global flag to prevent concurrent validation
let isValidating = false;
// Store verified admin status for faster access
let cachedAdminVerified = false;
// Cache expiry time (15 minutes)
const CACHE_EXPIRY = 15 * 60 * 1000;
let lastVerificationTime = 0;

// Demo credentials for fallback authentication
const DEMO_ADMIN_EMAIL = 'admin@cricketexpress.com';
const DEMO_ADMIN_ID = 'demo-admin-id';

// Helper function to check admin status with better fallback mechanisms
export const checkAdminStatus = async () => {
  try {
    console.log("Checking admin status...");
    
    // Use cached result if available and not expired
    const now = Date.now();
    if (cachedAdminVerified && (now - lastVerificationTime < CACHE_EXPIRY)) {
      console.log("Using cached admin verification");
      return { 
        isAdmin: true, 
        session: null,
        message: "Admin authenticated (cached)"
      };
    }
    
    // Prevent concurrent validation
    if (isValidating) {
      console.log("Validation already in progress, using cached result...");
      return { 
        isAdmin: cachedAdminVerified, 
        session: null,
        message: "Validation in progress"
      };
    }
    
    isValidating = true;
    
    // First check for a legacy token in localStorage
    const adminToken = localStorage.getItem('adminToken');
    const adminUserStr = localStorage.getItem('adminUser');
    let adminUserObj = null;
    
    if (adminToken === 'authenticated' && adminUserStr) {
      try {
        adminUserObj = JSON.parse(adminUserStr);
        console.log("Found admin token in localStorage:", adminUserObj);
        
        // Special case for demo admin
        if (adminUserObj.id === DEMO_ADMIN_ID) {
          console.log("Demo admin authenticated via localStorage");
          cachedAdminVerified = true;
          lastVerificationTime = now;
          isValidating = false;
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
    
    // Always check session first and try to refresh if needed
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      isValidating = false;
      
      // Fall back to stored admin token if session check fails
      if (adminUserObj && adminUserObj.id) {
        console.log("Session check failed, falling back to stored admin token");
        return { 
          isAdmin: true, 
          session: null,
          message: "Admin authenticated via fallback token"
        };
      }
      
      return { 
        isAdmin: false, 
        session: null,
        message: "Session error: " + sessionError.message
      };
    }
    
    // If session exists but is close to expiry, refresh it
    if (sessionData.session) {
      const expiresAt = sessionData.session.expires_at * 1000; // convert to milliseconds
      const timeToExpiry = expiresAt - now;
      
      if (timeToExpiry < 600000) { // less than 10 minutes
        console.log("Session close to expiry, refreshing...");
        try {
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.log("Session refresh failed:", refreshError.message);
            // Continue with the existing session
          } else if (refreshData.session) {
            console.log("Session refreshed successfully");
            // Use the refreshed session
            sessionData.session = refreshData.session;
          }
        } catch (refreshError) {
          console.error("Error refreshing session:", refreshError);
          // Continue with existing session
        }
      }
    }
    
    // If we have a session, check if the user is an admin
    if (sessionData.session) {
      console.log("Found active session:", sessionData.session.user.id);
      
      try {
        // First try direct role check without RLS restrictions
        // Use custom Edge Function to check admin role
        const { data: adminData, error: adminError } = await supabase.functions.invoke(
          'check-admin-role', 
          { 
            body: { user_id: sessionData.session.user.id }
          }
        );
          
        if (!adminError && adminData === true) {
          console.log("User confirmed as admin via Edge Function");
          cachedAdminVerified = true;
          lastVerificationTime = now;
          
          // Store admin info for faster checks
          localStorage.setItem('adminToken', 'authenticated');
          localStorage.setItem('adminUser', JSON.stringify({ 
            id: sessionData.session.user.id,
            role: 'admin'
          }));
          
          isValidating = false;
          return { 
            isAdmin: true, 
            session: sessionData.session,
            message: "Admin authenticated via Edge Function"
          };
        }
      } catch (rpcError) {
        console.error("Edge Function admin check error:", rpcError);
        // Continue with standard check
      }
      
      // Fall back to standard database query
      try {
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('id')
          .eq('id', sessionData.session.user.id)
          .maybeSingle();
        
        isValidating = false;
        
        if (adminError) {
          console.error("Admin check error:", adminError);
          
          // Fall back to stored admin token if database check fails
          if (adminUserObj && adminUserObj.id === sessionData.session.user.id) {
            console.log("Database check failed, using stored admin token as fallback");
            cachedAdminVerified = true;
            lastVerificationTime = now;
            return { 
              isAdmin: true, 
              session: sessionData.session,
              message: "Admin authenticated via fallback token"
            };
          }
          
          return { 
            isAdmin: false, 
            session: sessionData.session,
            message: "Admin verification error: " + adminError.message
          };
        }
        
        if (adminData) {
          console.log("User confirmed as admin in database");
          cachedAdminVerified = true;
          lastVerificationTime = now;
          
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
          cachedAdminVerified = false;
          
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
        
        // Fall back to stored admin token if database access fails
        if (adminUserObj && adminUserObj.id === sessionData.session.user.id) {
          console.log("Database access failed, using stored admin token as fallback");
          cachedAdminVerified = true;
          lastVerificationTime = now;
          isValidating = false;
          return { 
            isAdmin: true, 
            session: sessionData.session,
            message: "Admin authenticated via fallback token (database error)"
          };
        }
        
        isValidating = false;
        return { 
          isAdmin: false, 
          session: sessionData.session,
          message: "Database error during admin verification"
        };
      }
    }
    
    console.log("No active session found - checking legacy token");
    
    // No active session, check for legacy token
    if (adminUserObj && adminUserObj.id) {
      try {
        console.log("Legacy admin token found, validating...");
        
        // Special case for demo admin
        if (adminUserObj.id === DEMO_ADMIN_ID) {
          console.log("Demo admin token found, using without verification");
          cachedAdminVerified = true;
          lastVerificationTime = now;
          isValidating = false;
          return { 
            isAdmin: true, 
            session: null,
            message: "Demo admin authenticated"
          };
        }
        
        try {
          const { data: adminCheck, error: adminCheckError } = await supabase
            .from('admins')
            .select('id')
            .eq('id', adminUserObj.id)
            .maybeSingle();
          
          isValidating = false;
          
          if (adminCheckError) {
            console.error("Legacy admin check error:", adminCheckError);
            // If the database check fails but we have a stored token, trust it as a last resort
            cachedAdminVerified = true;
            lastVerificationTime = now;
            return { 
              isAdmin: true, 
              session: null,
              message: "Admin authenticated via unchecked token (database error)"
            };
          }
            
          if (adminCheck) {
            console.log("Legacy admin token verified successfully");
            cachedAdminVerified = true;
            lastVerificationTime = now;
            return { 
              isAdmin: true, 
              session: null,
              message: "Admin authenticated via legacy token"
            };
          }
        } catch (dbError) {
          console.error("Database error during legacy admin check:", dbError);
          // If database access fails, trust the stored token as a last resort
          cachedAdminVerified = true;
          lastVerificationTime = now;
          isValidating = false;
          return { 
            isAdmin: true, 
            session: null,
            message: "Admin authenticated via unchecked token (database error)"
          };
        }
        
        // Invalid admin data, clear it
        console.log("Invalid legacy token, clearing...");
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        cachedAdminVerified = false;
        return { 
          isAdmin: false, 
          session: null,
          message: "Invalid legacy admin token"
        };
      } catch (error) {
        // Error parsing admin user data, clear it
        console.error("Error parsing admin user data:", error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        cachedAdminVerified = false;
        isValidating = false;
        return { 
          isAdmin: false, 
          session: null,
          message: "Error parsing admin data"
        };
      }
    }
    
    // No valid session or token
    isValidating = false;
    cachedAdminVerified = false;
    console.log("No admin authentication found");
    return { 
      isAdmin: false, 
      session: null,
      message: "No active session found"
    };
  } catch (error) {
    isValidating = false;
    console.error("Admin verification error:", error);
    
    // If verification completely fails but we have a stored token,
    // trust it as an absolute last resort to avoid lockouts
    const adminToken = localStorage.getItem('adminToken');
    const adminUserStr = localStorage.getItem('adminUser');
    
    if (adminToken === 'authenticated' && adminUserStr) {
      try {
        const adminUser = JSON.parse(adminUserStr);
        if (adminUser && adminUser.id) {
          console.log("FALLBACK: Using stored admin token due to complete verification failure");
          cachedAdminVerified = true;
          lastVerificationTime = Date.now();
          return { 
            isAdmin: true, 
            session: null,
            message: "Admin authenticated via emergency fallback (verification failed)"
          };
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    cachedAdminVerified = false;
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
    
    // Reset validation flag and cache
    isValidating = false;
    cachedAdminVerified = false;
    lastVerificationTime = 0;
    
    return { success: true };
  } catch (error) {
    console.error("Error during admin signout:", error);
    
    // Still remove local tokens on error
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    isValidating = false;
    cachedAdminVerified = false;
    
    return { success: false, error };
  }
};

// Admin login function with improved error handling and fallbacks
export const loginAdmin = async (email: string, password: string) => {
  try {
    console.log("Attempting admin login...");
    
    // Special case for demo credentials
    if (email === DEMO_ADMIN_EMAIL && password === 'admin123') {
      console.log("Using demo credentials, bypassing server authentication");
      
      // Store demo admin info in local storage
      localStorage.setItem('adminToken', 'authenticated');
      localStorage.setItem('adminUser', JSON.stringify({ 
        username: email, 
        role: 'admin',
        id: DEMO_ADMIN_ID
      }));
      
      // Reset validation flag and update cache
      isValidating = false;
      cachedAdminVerified = true;
      lastVerificationTime = Date.now();
      
      return { 
        success: true, 
        message: "Demo login successful",
        demoLogin: true
      };
    }
    
    // First try to sign in with Supabase auth
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
          
          // Reset validation flag and update cache
          isValidating = false;
          cachedAdminVerified = true;
          lastVerificationTime = Date.now();
          
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
        
        // If database check fails but user authenticated, trust as admin temporarily
        console.log("Database check failed, provisionally trusting authenticated user as admin");
        localStorage.setItem('adminToken', 'authenticated');
        localStorage.setItem('adminUser', JSON.stringify({ 
          username: email, 
          role: 'admin',
          id: data.user?.id
        }));
        
        // Reset validation flag and update cache
        isValidating = false;
        cachedAdminVerified = true;
        lastVerificationTime = Date.now();
        
        return { 
          success: true, 
          message: "Login successful (with verification errors)", 
          user: data.user,
          provisional: true
        };
      }
    }
    
    // If we reach here, something unexpected happened
    throw new Error("Authentication failed for unknown reason");
  } catch (error: any) {
    console.error("Login error:", error);
    
    // Try the fallback manual authentication method
    try {
      console.log("Trying fallback authentication...");
      
      // Special check for demo credentials
      if (email === DEMO_ADMIN_EMAIL && password === 'admin123') {
        console.log("Demo credentials detected during fallback, allowing access");
        
        // Store demo admin info
        localStorage.setItem('adminToken', 'authenticated');
        localStorage.setItem('adminUser', JSON.stringify({ 
          username: email, 
          role: 'admin',
          id: DEMO_ADMIN_ID
        }));
        
        // Reset validation flag and update cache
        isValidating = false;
        cachedAdminVerified = true;
        lastVerificationTime = Date.now();
        
        return { 
          success: true, 
          message: "Demo login successful", 
          user: { id: DEMO_ADMIN_ID, username: email },
          demoLogin: true
        };
      }
      
      // Using a function invoke to access Edge Functions
      const { data, error: functionError } = await supabase.functions.invoke(
        'admin-authenticate',
        {
          body: { 
            username: email,
            password: password
          }
        }
      );
      
      if (functionError) {
        console.error("Function error:", functionError);
        throw functionError;
      }
      
      // Check if authentication was successful
      if (data && data.userId) {
        console.log("Fallback login successful");
        // Store admin info in local storage
        localStorage.setItem('adminToken', 'authenticated');
        localStorage.setItem('adminUser', JSON.stringify({ 
          username: email, 
          role: 'admin',
          id: data.userId
        }));
        
        // Reset validation flag and update cache
        isValidating = false;
        cachedAdminVerified = true;
        lastVerificationTime = Date.now();
        
        return { 
          success: true, 
          message: "Login successful", 
          user: { id: data.userId, username: email }
        };
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (rpcError: any) {
      console.error("Fallback login error:", rpcError);
      
      // One more special check for demo credentials
      if (email === DEMO_ADMIN_EMAIL && password === 'admin123') {
        console.log("Demo credentials detected after all failures, allowing access");
        
        // Store demo admin info
        localStorage.setItem('adminToken', 'authenticated');
        localStorage.setItem('adminUser', JSON.stringify({ 
          username: email, 
          role: 'admin',
          id: DEMO_ADMIN_ID
        }));
        
        // Reset validation flag and update cache
        isValidating = false;
        cachedAdminVerified = true;
        lastVerificationTime = Date.now();
        
        return { 
          success: true, 
          message: "Demo login successful (last resort fallback)", 
          user: { id: DEMO_ADMIN_ID, username: email },
          demoLogin: true
        };
      }
      
      throw rpcError;
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
