
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";

export default function UserProfile() {
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-1 rounded-full">
          <User className="h-5 w-5" />
        </div>
        <span className="text-sm font-medium hidden md:inline-block">
          {user.email}
        </span>
      </div>
      <Button variant="ghost" size="sm" onClick={signOut} className="h-8 w-8 p-0">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
