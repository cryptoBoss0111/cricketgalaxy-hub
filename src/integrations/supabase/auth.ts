
import { supabase } from './client-core';

// Check if current user is an admin
export const isAdminUser = async (): Promise<boolean> => {
  try {
    // First check if we have a session
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      console.log("No active session found");
      return false;
    }
    
    // If token is close to expiry, refresh it
    const expiresAt = sessionData.session.expires_at * 1000; // convert to milliseconds
    const now = Date.now();
    const timeToExpiry = expiresAt - now;
    
    if (timeToExpiry < 300000) { // less than 5 minutes
      console.log("Token close to expiry, refreshing session...");
      await refreshSession();
    }
    
    console.log("Found active session, checking if user is admin");
    
    // Get current user ID
    const currentUserId = sessionData.session.user.id;
    if (!currentUserId) {
      console.log("No user ID in session");
      return false;
    }
    
    console.log("Checking if user ID is admin:", currentUserId);
    
    // Query the admins table directly
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('id')
      .eq('id', currentUserId)
      .maybeSingle();
      
    if (adminError) {
      console.error("Admin query error:", adminError.message);
      return false;
    }
    
    if (adminData) {
      console.log("User confirmed as admin in database");
      // Store admin info for faster checks
      localStorage.setItem('adminToken', 'authenticated');
      localStorage.setItem('adminUser', JSON.stringify({ 
        id: currentUserId,
        role: 'admin'
      }));
      return true;
    } else {
      console.log("User is not an admin");
      // Clear any stale admin tokens
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return false;
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Force refresh the session before each major operation
export const refreshSession = async (): Promise<boolean> => {
  try {
    console.log("Attempting to refresh session token...");
    
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      console.log("No active session to refresh");
      return false;
    }
    
    // Only try to refresh if we have a session
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error("Failed to refresh session:", error.message);
      return false;
    }
    
    if (data.session) {
      console.log("Session refreshed successfully");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error refreshing session:", error);
    return false;
  }
};
