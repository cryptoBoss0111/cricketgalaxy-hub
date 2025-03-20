
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
        const adminStatus = await verifyAdmin();
        return adminStatus;
      } else {
        console.log("Session refresh failed, checking admin status directly");
        const adminStatus = await verifyAdmin();
        return adminStatus;
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
      return false;
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
      
      const { isAdmin: adminStatus } = await checkAdminStatus();
      console.log("Admin verification result:", adminStatus);
      
      setIsAdmin(adminStatus);
      initialCheckDone.current = true;
      
      return adminStatus;
    } catch (error) {
      console.error("Admin verification error:", error);
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
      console.log("Server signout result:", success);
      
      setIsAdmin(false);
      
      navigate("/", { replace: true });
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
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
  }, []);

  // Periodic admin check
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isChecking && initialCheckDone.current && !checkInProgress.current) {
        console.log("Performing periodic admin check");
        verifyAdmin();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
    
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
