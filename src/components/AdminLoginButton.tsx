
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, LockKeyhole, LogOut } from "lucide-react";
import { useState, useRef } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useToast } from "@/hooks/use-toast";

const AdminLoginButton = () => {
  const navigate = useNavigate();
  const { isAdmin, isChecking, signOut } = useAdminAuth();
  const buttonClicked = useRef(false);
  const { toast } = useToast();
  
  const handleAdminAction = () => {
    if (buttonClicked.current) return; // Prevent double clicks
    
    buttonClicked.current = true;
    setTimeout(() => { buttonClicked.current = false; }, 1000); // Reset after 1 second
    
    if (isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/admin/login");
    }
  };
  
  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (buttonClicked.current) return; // Prevent double clicks
    
    buttonClicked.current = true;
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: "An error occurred while logging out",
        variant: "destructive",
      });
    }
    setTimeout(() => { buttonClicked.current = false; }, 1000); // Reset after 1 second
  };

  return (
    <div className="relative group">
      <Button 
        variant={isAdmin ? "default" : "outline"} 
        size="sm" 
        className={`flex items-center gap-1 ${isAdmin ? 'bg-cricket-accent hover:bg-cricket-accent/90' : 'text-gray-600 hover:text-cricket-accent'} transition-colors`}
        onClick={handleAdminAction}
        aria-label={isAdmin ? "Admin Dashboard" : "Admin Login"}
        disabled={isChecking}
      >
        {isChecking ? (
          <span className="flex items-center">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-t-transparent mr-1"></span>
            <span className="hidden md:inline">Checking...</span>
          </span>
        ) : isAdmin ? (
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
      
      {isAdmin && (
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
