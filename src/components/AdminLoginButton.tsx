
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, LockKeyhole, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { checkAdminStatus, signOutAdmin } from "@/utils/adminAuth";

const AdminLoginButton = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();
  const initialCheckDone = useRef(false);
  
  // Check admin status on component mount, but only once
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      if (!isMounted) return;
      
      try {
        setIsChecking(true);
        const { isAdmin } = await checkAdminStatus();
        
        if (isMounted) {
          setIsLoggedIn(isAdmin);
          initialCheckDone.current = true;
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        if (isMounted) {
          setIsLoggedIn(false);
          initialCheckDone.current = true;
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };
    
    // Only do the initial check if not already done
    if (!initialCheckDone.current) {
      checkAuth();
    }
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAdminAction = () => {
    if (isLoggedIn) {
      navigate("/admin/dashboard");
    } else {
      navigate("/admin/login");
    }
  };
  
  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsChecking(true);
    
    try {
      const { success } = await signOutAdmin();
      
      if (success) {
        setIsLoggedIn(false);
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

  return (
    <div className="relative group">
      <Button 
        variant={isLoggedIn ? "default" : "outline"} 
        size="sm" 
        className={`flex items-center gap-1 ${isLoggedIn ? 'bg-cricket-accent hover:bg-cricket-accent/90' : 'text-gray-600 hover:text-cricket-accent'} transition-colors`}
        onClick={handleAdminAction}
        aria-label={isLoggedIn ? "Admin Dashboard" : "Admin Login"}
        disabled={isChecking}
      >
        {isChecking ? (
          <span className="flex items-center">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-t-transparent mr-1"></span>
            <span className="hidden md:inline">Checking...</span>
          </span>
        ) : isLoggedIn ? (
          <>
            <LockKeyhole className="h-4 w-4" />
            <span className="hidden md:inline">Dashboard</span>
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            <span className="hidden md:inline">Admin Login</span>
          </>
        )}
      </Button>
      
      {isLoggedIn && (
        <div className="absolute right-0 z-50 mt-1 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full flex items-center justify-center"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-1" />
            Log Out
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminLoginButton;
