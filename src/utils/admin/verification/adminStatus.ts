
import { supabase } from "@/integrations/supabase/client";
import { 
  getCacheStatus, 
  setValidationStatus, 
  setCacheVerified, 
  resetCache 
} from './cache';
import {
  getStoredAdminData,
  setAdminData,
  clearAdminData
} from './storage';

// Main function to check admin status
export const checkAdminStatus = async () => {
  try {
    console.log("Checking admin status...");
    
    // Use cached result if available and not expired
    const { isValidating, isCacheValid, now } = getCacheStatus();
    
    if (isCacheValid) {
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
        isAdmin: getCacheStatus().cachedAdminVerified, 
        session: null,
        message: "Validation in progress"
      };
    }
    
    setValidationStatus(true);
    
    // First check for a legacy token in localStorage
    const { adminToken, adminUserObj } = getStoredAdminData();
    
    // Always check session first and try to refresh if needed
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      setValidationStatus(false);
      
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
          setCacheVerified(true);
          
          // Store admin info for faster checks
          setAdminData(sessionData.session.user.id);
          
          setValidationStatus(false);
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
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('id')
        .eq('id', sessionData.session.user.id)
        .maybeSingle();
      
      setValidationStatus(false);
      
      if (adminError) {
        console.error("Admin check error:", adminError);
        
        // Fall back to stored admin token if database check fails
        if (adminUserObj && adminUserObj.id === sessionData.session.user.id) {
          console.log("Database check failed, using stored admin token as fallback");
          setCacheVerified(true);
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
        setCacheVerified(true);
        
        // Store admin info for faster checks
        setAdminData(sessionData.session.user.id);
        
        return { 
          isAdmin: true, 
          session: sessionData.session,
          message: "Admin authenticated"
        };
      } else {
        console.log("User is not an admin");
        setCacheVerified(false);
        
        // Clear any stale admin tokens
        clearAdminData();
        
        return { 
          isAdmin: false, 
          session: sessionData.session,
          message: "User is not an admin"
        };
      }
    }
    
    console.log("No active session found - checking legacy token");
    
    // No active session, check for legacy token
    if (adminUserObj && adminUserObj.id) {
      try {
        console.log("Legacy admin token found, validating...");
        
        const { data: adminCheck, error: adminCheckError } = await supabase
          .from('admins')
          .select('id')
          .eq('id', adminUserObj.id)
          .maybeSingle();
        
        setValidationStatus(false);
        
        if (adminCheckError) {
          console.error("Legacy admin check error:", adminCheckError);
          // If the database check fails but we have a stored token, trust it as a last resort
          setCacheVerified(true);
          return { 
            isAdmin: true, 
            session: null,
            message: "Admin authenticated via unchecked token (database error)"
          };
        }
          
        if (adminCheck) {
          console.log("Legacy admin token verified successfully");
          setCacheVerified(true);
          return { 
            isAdmin: true, 
            session: null,
            message: "Admin authenticated via legacy token"
          };
        }
        
        // Invalid admin data, clear it
        console.log("Invalid legacy token, clearing...");
        clearAdminData();
        return { 
          isAdmin: false, 
          session: null,
          message: "Invalid legacy admin token"
        };
      } catch (error) {
        // Error parsing admin user data, clear it
        console.error("Error parsing admin user data:", error);
        clearAdminData();
        setValidationStatus(false);
        return { 
          isAdmin: false, 
          session: null,
          message: "Error parsing admin data"
        };
      }
    }
    
    // No valid session or token
    setValidationStatus(false);
    setCacheVerified(false);
    console.log("No admin authentication found");
    return { 
      isAdmin: false, 
      session: null,
      message: "No active session found"
    };
  } catch (error) {
    setValidationStatus(false);
    console.error("Admin verification error:", error);
    
    // If verification completely fails but we have a stored token,
    // trust it as an absolute last resort to avoid lockouts
    const { adminToken, adminUserObj } = getStoredAdminData();
    
    if (adminToken === 'authenticated' && adminUserObj && adminUserObj.id) {
      console.log("FALLBACK: Using stored admin token due to complete verification failure");
      setCacheVerified(true);
      return { 
        isAdmin: true, 
        session: null,
        message: "Admin authenticated via emergency fallback (verification failed)"
      };
    }
    
    setCacheVerified(false);
    return { 
      isAdmin: false, 
      session: null,
      message: "Authentication error"
    };
  }
};

// Exposed method to reset admin verification cache
export const verifyAdmin = async (forceRefresh = false): Promise<boolean> => {
  if (forceRefresh) {
    resetCache();
  }
  
  const { isAdmin } = await checkAdminStatus();
  return isAdmin;
};
