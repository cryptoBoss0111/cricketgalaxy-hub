
import { MutableRefObject } from "react";
import { refreshSession } from "@/integrations/supabase/client";

type UseAdminRefreshSessionProps = {
  setIsAdmin: (value: boolean) => void;
  initialCheckDone: MutableRefObject<boolean>;
  checkInProgress: MutableRefObject<boolean>;
};

export const useAdminRefreshSession = ({
  setIsAdmin,
  initialCheckDone,
  checkInProgress
}: UseAdminRefreshSessionProps) => {
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
      return false;
    }
    
    try {
      checkInProgress.current = true;
      console.log("Verifying admin status...");
      
      const storedAdminToken = localStorage.getItem('adminToken');
      if (storedAdminToken === 'authenticated') {
        console.log("Found admin token in localStorage, checking if still valid...");
      }
      
      const { isAdmin: adminStatus } = await import("@/utils/admin/verification").then(
        module => module.checkAdminStatus()
      );
      
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
      checkInProgress.current = false;
    }
  };

  return { refreshAdminSession };
};
