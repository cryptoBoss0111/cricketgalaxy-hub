
import { NavigateFunction } from "react-router-dom";
import { signOutAdmin } from "@/utils/admin/authentication";

type UseAdminSignOutProps = {
  setIsAdmin: (value: boolean) => void;
  setIsChecking: (value: boolean) => void;
  navigate: NavigateFunction;
  toast: any; // Using any here for brevity, but ideally would have a proper toast type
};

export const useAdminSignOut = ({
  setIsAdmin,
  setIsChecking,
  navigate,
  toast
}: UseAdminSignOutProps) => {
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

  return { signOut };
};
