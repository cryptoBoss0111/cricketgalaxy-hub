
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";

const AdminLoginButton = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate("/admin/login");
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="flex items-center gap-1 text-gray-600 hover:text-cricket-accent transition-colors"
      onClick={handleAdminLogin}
      aria-label="Admin Login"
    >
      <LockKeyhole className="h-4 w-4" />
      <span className="hidden md:inline">Admin</span>
    </Button>
  );
};

export default AdminLoginButton;
