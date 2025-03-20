
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

// Simple admin authentication check function
export const checkAdminStatus = async () => {
  try {
    // Check for an active session
    const { data: sessionData } = await supabase.auth.getSession();
    
    // If we have a session, check if the user is an admin
    if (sessionData.session) {
      const { data: adminData } = await supabase
        .from('admins')
        .select('id')
        .eq('id', sessionData.session.user.id)
        .maybeSingle();
      
      return { 
        isAdmin: !!adminData, 
        session: sessionData.session,
        message: adminData ? "Admin authenticated" : "User is not an admin"
      };
    }
    
    // No active session, check for legacy token
    const adminToken = localStorage.getItem('adminToken');
    const adminUserStr = localStorage.getItem('adminUser');
    
    if (adminToken === 'authenticated' && adminUserStr) {
      try {
        const adminUser = JSON.parse(adminUserStr);
        
        if (adminUser.id) {
          const { data: adminCheck } = await supabase
            .from('admins')
            .select('id')
            .eq('id', adminUser.id)
            .maybeSingle();
            
          if (adminCheck) {
            return { 
              isAdmin: true, 
              session: null,
              message: "Admin authenticated via legacy token"
            };
          }
        }
        
        // Invalid admin data, clear it
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      } catch (error) {
        // Error parsing admin user data, clear it
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    
    // No valid session or token
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

// Hook for admin route protection
export const useAdminAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    
    const verifyAdmin = async () => {
      setIsChecking(true);
      
      try {
        const { isAdmin, message } = await checkAdminStatus();
        
        if (isMounted) {
          setIsAdmin(isAdmin);
          
          if (!isAdmin) {
            toast({
              title: "Authentication Required",
              description: message,
              variant: "destructive",
            });
            
            navigate('/admin/login');
          }
        }
      } catch (error) {
        console.error("Admin verification error:", error);
        
        if (isMounted) {
          setIsAdmin(false);
          toast({
            title: "Authentication Error",
            description: "Please try logging in again",
            variant: "destructive",
          });
          
          navigate('/admin/login');
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };
    
    verifyAdmin();
    
    return () => {
      isMounted = false;
    };
  }, [navigate, toast]);
  
  return { isChecking, isAdmin };
};

// Helper function to sign out admin
export const signOutAdmin = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};
