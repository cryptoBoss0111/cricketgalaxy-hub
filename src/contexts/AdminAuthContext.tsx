
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { checkAdminStatus, signOutAdmin } from "@/utils/adminAuth";

type AdminAuthContextType = {
  isAdmin: boolean;
  isChecking: boolean;
  signOut: () => Promise<void>;
  verifyAdmin: () => Promise<boolean>;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const initialCheckDone = useRef(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const verifyAdmin = async (): Promise<boolean> => {
    try {
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
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setIsChecking(true);
      const { success } = await signOutAdmin();
      
      if (success) {
        setIsAdmin(false);
        navigate("/");
        
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out",
        });
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Logout Error",
        description: "An error occurred while logging out",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Check admin status on mount and whenever localStorage changes
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      if (!isMounted || initialCheckDone.current) return;
      
      console.log("Performing initial admin check");
      await verifyAdmin();
    };
    
    // Listen for storage events (in case admin token is changed in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminToken' || e.key === 'adminUser') {
        console.log("Admin token changed in another tab, rechecking");
        verifyAdmin();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    if (!initialCheckDone.current) {
      checkAuth();
    }
    
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Recheck admin status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isChecking) {
        console.log("Performing periodic admin check");
        verifyAdmin();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => clearInterval(interval);
  }, [isChecking]);

  return (
    <AdminAuthContext.Provider value={{ isAdmin, isChecking, signOut, verifyAdmin }}>
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
