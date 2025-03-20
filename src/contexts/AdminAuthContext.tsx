
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
  const checkInProgress = useRef(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const verifyAdmin = async (): Promise<boolean> => {
    // Prevent multiple simultaneous verifications
    if (checkInProgress.current) {
      console.log("Admin verification already in progress, skipping...");
      return isAdmin;
    }
    
    try {
      checkInProgress.current = true;
      setIsChecking(true);
      console.log("Verifying admin status...");
      
      // Check if we have an adminToken in localStorage first
      const storedAdminToken = localStorage.getItem('adminToken');
      if (storedAdminToken === 'authenticated') {
        console.log("Found admin token in localStorage, checking if still valid...");
      }
      
      // Always verify with the server
      const { isAdmin: adminStatus } = await checkAdminStatus();
      console.log("Admin verification result:", adminStatus);
      
      // Update state based on server response
      setIsAdmin(adminStatus);
      initialCheckDone.current = true;
      
      // If admin status is false but we had a token, clear it
      if (!adminStatus && storedAdminToken === 'authenticated') {
        console.log("Admin token invalid, clearing from localStorage");
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
      
      return adminStatus;
    } catch (error) {
      console.error("Admin verification error:", error);
      // Clear tokens on verification error to be safe
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
      
      // Always clear local storage items
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
        // Even if server signout fails, we've cleared local tokens
        navigate("/", { replace: true });
        toast({
          title: "Logged Out",
          description: "You have been logged out (local only)",
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Clear tokens even if there's an error
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

  // Clear auth state when visiting login page
  useEffect(() => {
    const handleNavigation = () => {
      if (window.location.pathname === '/admin/login') {
        console.log("On login page - not clearing authentication state");
        // Don't clear localStorage here, as it may interfere with login
      }
    };

    // Check on mount
    handleNavigation();

    // Listen for route changes
    window.addEventListener('popstate', handleNavigation);
    
    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  // Check admin status on mount and whenever localStorage changes
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      if (!isMounted || checkInProgress.current) return;
      
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
    
    // Initial check
    checkAuth();
    
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Recheck admin status periodically - but reduce the frequency to avoid too many checks
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isChecking && initialCheckDone.current && !checkInProgress.current) {
        console.log("Performing periodic admin check");
        verifyAdmin();
      }
    }, 15 * 60 * 1000); // Check every 15 minutes
    
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
