
import { supabase, refreshSession, isAdminUser } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// A utility function to verify admin status before performing operations
export const verifyAdminAndRefresh = async () => {
  try {
    // Check if a validation is already in progress
    if (localStorage.getItem('validating_admin') === 'true') {
      return { 
        isAdmin: false, 
        message: "Authentication check already in progress", 
        userId: null 
      };
    }
    
    localStorage.setItem('validating_admin', 'true');
    
    try {
      // First refresh the session
      await refreshSession();
      
      // Then check if the user is an admin
      const isAdmin = await isAdminUser();
      if (!isAdmin) {
        return { isAdmin: false, message: "You must be logged in as an admin to access this page", userId: null };
      }

      // Get the current user ID
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user?.id;
      
      if (!userId) {
        return { isAdmin: false, message: "No user ID found in session", userId: null };
      }
      
      return { isAdmin: true, message: "Admin authenticated", userId };
    } finally {
      localStorage.removeItem('validating_admin');
    }
  } catch (error) {
    console.error("Admin verification error:", error);
    localStorage.removeItem('validating_admin');
    return { isAdmin: false, message: "Authentication error", userId: null };
  }
};

// A hook to handle admin authentication
export const useAdminAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const checkAndRedirect = async () => {
    const { isAdmin, message, userId } = await verifyAdminAndRefresh();
    
    if (!isAdmin) {
      toast({
        title: "Authentication Required",
        description: message,
        variant: "destructive",
      });
      
      // Clear any legacy tokens that might be causing issues
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      
      navigate('/admin/login');
      return null;
    }
    
    return userId;
  };
  
  return { checkAndRedirect };
};
