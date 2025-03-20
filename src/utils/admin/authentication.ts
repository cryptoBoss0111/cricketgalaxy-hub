
import { supabase } from "@/integrations/supabase/client";
import { verifyAdmin } from "./verification";

// Admin login function with improved error handling and fallbacks
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
    
    // Try the fallback manual authentication method
    try {
      console.log("Trying fallback authentication...");
      
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
      throw rpcError;
    }
    
    // Clear any stale tokens on error
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    throw error;
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
    
    // Reset cache in verification module
    await verifyAdmin(true);
    
    return { success: true };
  } catch (error) {
    console.error("Error during admin signout:", error);
    
    // Still remove local tokens on error
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    return { success: false, error };
  }
};
