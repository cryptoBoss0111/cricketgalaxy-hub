
import { supabase } from "@/integrations/supabase/client";

// Global flag to prevent concurrent validation
let isValidating = false;
// Store verified admin status for faster access
let cachedAdminVerified = false;
// Cache expiry time (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;
let lastVerificationTime = 0;

// Helper function to check admin status
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
      console.log("Validation already in progress, skipping...");
      return { 
        isAdmin: cachedAdminVerified, 
        session: null,
        message: "Validation in progress"
      };
    }
    
    isValidating = true;
    
    // Check for an active session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      isValidating = false;
      return { 
        isAdmin: false, 
        session: null,
        message: "Session error: " + sessionError.message
      };
    }
    
    // If we have a session, check if the user is an admin
    if (sessionData.session) {
      console.log("Found active session:", sessionData.session.user.id);
      
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('id')
        .eq('id', sessionData.session.user.id)
        .maybeSingle();
      
      isValidating = false;
      
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
        cachedAdminVerified = true;
        lastVerificationTime = now;
        return { 
          isAdmin: true, 
          session: sessionData.session,
          message: "Admin authenticated"
        };
      } else {
        console.log("User is not an admin");
        cachedAdminVerified = false;
        return { 
          isAdmin: false, 
          session: sessionData.session,
          message: "User is not an admin"
        };
      }
    }
    
    console.log("No active session found - checking for legacy token");
    
    // No active session, check for legacy token
    const adminToken = localStorage.getItem('adminToken');
    const adminUserStr = localStorage.getItem('adminUser');
    
    if (adminToken === 'authenticated' && adminUserStr) {
      try {
        console.log("Legacy admin token found, validating...");
        const adminUser = JSON.parse(adminUserStr);
        
        if (adminUser && adminUser.id) {
          const { data: adminCheck, error: adminCheckError } = await supabase
            .from('admins')
            .select('id')
            .eq('id', adminUser.id)
            .maybeSingle();
          
          isValidating = false;
          
          if (adminCheckError) {
            console.error("Legacy admin check error:", adminCheckError);
            // Clear invalid tokens
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            cachedAdminVerified = false;
            return { 
              isAdmin: false, 
              session: null,
              message: "Legacy admin verification error"
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
        }
        
        // Invalid admin data, clear it
        console.log("Invalid legacy token, clearing...");
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        cachedAdminVerified = false;
      } catch (error) {
        // Error parsing admin user data, clear it
        console.error("Error parsing admin user data:", error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        cachedAdminVerified = false;
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
    cachedAdminVerified = false;
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
    return { success: false, error };
  }
};

// Admin login function
export const loginAdmin = async (email: string, password: string) => {
  try {
    console.log("Attempting admin login...");
    
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
    }
    
    // If we reach here, something unexpected happened
    throw new Error("Authentication failed for unknown reason");
  } catch (error: any) {
    console.error("Login error:", error);
    
    // Try the RPC method as fallback if it's an auth error
    if (error.message && (
        error.message.includes("Invalid login credentials") ||
        error.message.includes("Invalid email or password")
    )) {
      try {
        console.log("Trying fallback RPC authentication...");
        const { data: rpcData, error: functionError } = await supabase.rpc(
          'authenticate_admin',
          {
            admin_username: email,
            admin_password: password
          }
        );
        
        if (functionError) {
          console.error("RPC error:", functionError);
          throw functionError;
        }
        
        // Check if authentication was successful
        if (rpcData) {
          console.log("RPC login successful");
          // Store admin info in local storage
          localStorage.setItem('adminToken', 'authenticated');
          localStorage.setItem('adminUser', JSON.stringify({ 
            username: email, 
            role: 'admin',
            id: rpcData
          }));
          
          // Reset validation flag and update cache
          isValidating = false;
          cachedAdminVerified = true;
          lastVerificationTime = Date.now();
          
          return { 
            success: true, 
            message: "Login successful", 
            user: { id: rpcData, username: email }
          };
        } else {
          throw new Error('Invalid username or password');
        }
      } catch (rpcError: any) {
        console.error("RPC login error:", rpcError);
        throw rpcError;
      }
    }
    
    throw error;
  }
};
