
import { MutableRefObject } from "react";
import { checkAdminStatus } from "@/utils/admin/verification";

type UseAdminVerificationProps = {
  setIsAdmin: (value: boolean) => void;
  setIsChecking: (value: boolean) => void;
  initialCheckDone: MutableRefObject<boolean>;
  checkInProgress: MutableRefObject<boolean>;
  isAdmin: boolean;
};

export const useAdminVerification = ({
  setIsAdmin,
  setIsChecking,
  initialCheckDone,
  checkInProgress,
  isAdmin
}: UseAdminVerificationProps) => {
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

  return { verifyAdmin };
};
