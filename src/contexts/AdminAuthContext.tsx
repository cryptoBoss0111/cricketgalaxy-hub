
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { checkAdminStatus, signOutAdmin } from "@/utils/adminAuth";
import { refreshSession } from "@/integrations/supabase/client";

type AdminAuthContextType = {
  isAdmin: boolean;
  isChecking: boolean;
  signOut: () => Promise<void>;
  verifyAdmin: () => Promise<boolean>;
  refreshAdminSession: () => Promise<boolean>;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const initialCheckDone = useRef(false);
  const checkInProgress = useRef(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const refreshAdminSession = async (): Promise<boolean> => {
    try {
      console.log("Explicitly refreshing admin session...");
      const refreshed = await refreshSession();
      
      if (refreshed) {
        console.log("Session refreshed successfully");
        await verifyAdmin();
        return true;
      } else {
        console.log("Session refresh failed, checking admin status directly");
        const adminStatus = await verifyAdmin();
        return adminStatus;
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
      try {
        const adminStatus = await verifyAdmin();
        return adminStatus;
      } catch (verifyError) {
        console.error("Error verifying admin after refresh failure:", verifyError);
        return false;
      }
    }
  };

  const verifyAdmin = async (): Promise<boolean> => {
    if (checkInProgress.current) {
      console.log("Admin verification already in progress, skipping...");
      return isAdmin;
    }
    
    try {
      checkInProgress.current = true;
      setIsChecking(true);
      console.log("Verifying admin status...");
      
      const storedAdminToken = localStorage.getItem('adminToken');
      if (storedAdminToken === 'authenticated') {
        console.log("Found admin token in localStorage, checking if still valid...");
      }
      
      const { isAdmin: adminStatus } = await checkAdminStatus();
      console.log("Admin verification result:", adminStatus);
      
      setIsAdmin(adminStatus);
      initialCheckDone.current = true;
      
      if (!adminStatus && storedAdminToken === 'authenticated') {
        console.log("Admin token invalid, clearing from localStorage");
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
      
      return adminStatus;
    } catch (error) {
      console.error("Admin verification error:", error);
      
      const storedAdminToken = localStorage.getItem('adminToken');
      const storedAdminUser = localStorage.getItem('adminUser');
      
      if (storedAdminToken === 'authenticated' && storedAdminUser) {
        console.log("Using stored admin credentials as fallback due to verification error");
        setIsAdmin(true);
        initialCheckDone.current = true;
        return true;
      }
      
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setIsAdmin(false);
      initialCheckDone.current = true;
      return false;
    } finally {
      setIsChecking(false);
      checkInProgress.current = false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setIsChecking(true);
      const { success } = await signOutAdmin();
      
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setIsAdmin(false);
      
      if (success) {
        navigate("/", { replace: true });
        
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out",
        });
      } else {
        navigate("/", { replace: true });
        toast({
          title: "Logged Out",
          description: "You have been logged out (local only)",
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setIsAdmin(false);
      
      navigate("/", { replace: true });
      toast({
        title: "Logged Out",
        description: "Logged out with errors, session cleared",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

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
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isChecking && initialCheckDone.current && !checkInProgress.current) {
        console.log("Performing periodic admin check");
        verifyAdmin();
      }
    }, 3 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isChecking]);

  return (
    <AdminAuthContext.Provider value={{ isAdmin, isChecking, signOut, verifyAdmin, refreshAdminSession }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  
  return context;
};
