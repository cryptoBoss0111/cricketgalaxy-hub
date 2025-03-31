
import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginAdmin } from "@/utils/adminAuth";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

// Demo credentials for local fallback authentication
const DEMO_CREDENTIALS = {
  email: 'admin@cricketexpress.com'
};

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, isChecking, verifyAdmin } = useAdminAuth();
  
  // Check if already logged in
  useEffect(() => {
    if (isAdmin && !isChecking) {
      console.log("Already logged in, redirecting to dashboard");
      navigate('/admin/dashboard');
    }
  }, [isAdmin, isChecking, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Try using the loginAdmin function with only email
      const result = await loginAdmin(email, 'admin123'); // Using a default password
      
      if (result.success) {
        toast({
          title: "Login successful",
          description: result.demoLogin ? 
            "Welcome to the admin dashboard (demo login)" : 
            "Welcome to the admin dashboard",
          duration: 3000,
        });
        
        // Verify admin status after login
        await verifyAdmin();
        
        // Add a small delay to ensure the login process is complete
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 300);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      let errorMessage = 'An error occurred during login. Please try again.';
      
      if (err.message) {
        if (err.message.includes("Failed to send a request to the Edge Function")) {
          errorMessage = "Server connection error. If using demo credentials, they will still work.";
        } else if (err.message.includes("Invalid login credentials") || 
            err.message.includes("Invalid email or password") ||
            err.message.includes("Invalid username or password")) {
          errorMessage = "Invalid email";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      
      toast({
        title: "Login error",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 border border-gray-100 flex justify-center items-center">
          <div className="animate-spin h-8 w-8 border-4 border-cricket-accent border-t-transparent rounded-full"></div>
          <span className="ml-3">Checking authentication...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="mb-8">
        <Link to="/" className="inline-block">
          <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-cricket-accent to-cricket-secondary bg-clip-text text-transparent">
            CricketExpress
          </h1>
        </Link>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 border border-gray-100 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-heading font-bold">Admin Login</h2>
          <p className="text-gray-500 mt-1">Enter your email to access the admin panel</p>
          <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded-md text-sm">
            <p><strong>Demo Credentials:</strong></p>
            <p>Email: {DEMO_CREDENTIALS.email}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-cricket-accent hover:bg-cricket-accent/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-t-transparent"></span>
                Logging in...
              </span>
            ) : "Login"}
          </Button>
          
          <div className="text-center text-sm text-gray-500">
            <Link to="/" className="text-cricket-accent hover:underline">
              Return to Website
            </Link>
          </div>
        </form>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} CricketExpress. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AdminLogin;
