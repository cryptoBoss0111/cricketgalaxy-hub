
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginButton() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  if (user) {
    return null;
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => navigate('/auth')}
      className="flex items-center gap-1"
    >
      <LogIn className="h-4 w-4" />
      <span className="hidden md:inline">Login</span>
    </Button>
  );
}
