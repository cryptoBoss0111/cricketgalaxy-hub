
import { useState, useEffect, useRef, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AdminAuthContext, AdminAuthContextType } from "../AdminAuthContext";
import { checkAdminStatus } from "@/utils/admin/verification";
import { signOutAdmin } from "@/utils/admin/authentication";
import { refreshSession } from "@/integrations/supabase/client";
import { useAdminRefreshSession } from "./useAdminRefreshSession";
import { useAdminVerification } from "./useAdminVerification";
import { useAdminSignOut } from "./useAdminSignOut";

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const initialCheckDone = useRef(false);
  const checkInProgress = useRef(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Custom hooks for admin functionality
  const { refreshAdminSession } = useAdminRefreshSession({
    setIsAdmin,
    initialCheckDone,
    checkInProgress
  });
  
  const { verifyAdmin } = useAdminVerification({
    setIsAdmin,
    setIsChecking,
    initialCheckDone,
    checkInProgress,
    isAdmin
  });
  
  const { signOut } = useAdminSignOut({
    setIsAdmin,
    setIsChecking,
    navigate,
    toast
  });

  // Handle navigation effect
  useEffect(() => {
    const handleNavigation = () => {
      if (window.location.pathname === '/admin/login') {
        console.log("On login page - not clearing authentication state");
      }
    };

    handleNavigation();
    window.addEventListener('popstate', handleNavigation);
    
    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  // Initial authentication check
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      if (!isMounted || checkInProgress.current) return;
      
      console.log("Performing initial admin check");
      await verifyAdmin();
    };
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminToken' || e.key === 'adminUser') {
        console.log("Admin token changed in another tab, rechecking");
        verifyAdmin();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    checkAuth();
    
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [verifyAdmin]);

  // Periodic check
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isChecking && initialCheckDone.current && !checkInProgress.current) {
        console.log("Performing periodic admin check");
        verifyAdmin();
      }
    }, 3 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isChecking, verifyAdmin]);

  return (
    <AdminAuthContext.Provider value={{ 
      isAdmin, 
      isChecking, 
      signOut, 
      verifyAdmin, 
      refreshAdminSession 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
