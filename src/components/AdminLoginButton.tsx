
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const AdminLoginButton = () => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1 text-gray-600 hover:text-cricket-accent transition-colors"
      onClick={() => {
        alert("Admin functionality has been removed");
      }}
      aria-label="Admin functionality removed"
    >
      <LogIn className="h-4 w-4" />
      <span className="hidden md:inline">Admin</span>
    </Button>
  );
};

export default AdminLoginButton;
