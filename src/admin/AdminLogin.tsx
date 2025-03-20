
import { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session || localStorage.getItem('adminToken') === 'authenticated') {
        navigate('/admin/dashboard');
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // First try Supabase authentication
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (data?.session) {
        // Supabase auth successful
        localStorage.setItem('adminToken', 'authenticated');
        localStorage.setItem('adminUser', JSON.stringify({ 
          email, 
          role: 'admin',
          id: data.user?.id
        }));
        
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
          duration: 3000,
        });
        
        navigate('/admin/dashboard');
        return;
      }
      
      // If Supabase auth fails, try the RPC method as fallback
      if (authError) {
        console.log("Trying fallback authentication method");
        
        const { data: rpcData, error: functionError } = await supabase.rpc(
          'authenticate_admin',
          {
            admin_username: email,
            admin_password: password
          }
        );
        
        if (functionError) {
          throw functionError;
        }
        
        // Check if authentication was successful
        if (rpcData) {
          // Store admin info in local storage for session management
          localStorage.setItem('adminToken', 'authenticated');
          localStorage.setItem('adminUser', JSON.stringify({ 
            username: email, 
            role: 'admin',
            id: rpcData
          }));
          
          toast({
            title: "Login successful",
            description: "Welcome to the admin dashboard",
            duration: 3000,
          });
          
          navigate('/admin/dashboard');
        } else {
          setError('Invalid username or password');
          toast({
            title: "Login failed",
            description: "Invalid username or password",
            variant: "destructive",
            duration: 3000,
          });
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
      
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="mb-8">
        <Link to="/" className="inline-block">
          <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-cricket-accent to-cricket-secondary bg-clip-text text-transparent">
            CricketExpress
          </h1>
        </Link>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-soft p-8 border border-gray-100 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-heading font-bold">Admin Login</h2>
          <p className="text-gray-500 mt-1">Enter your credentials to access the admin panel</p>
          <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded-md text-sm">
            <p><strong>Demo Credentials:</strong></p>
            <p>Email: admin@cricketexpress.com</p>
            <p>Password: admin@2589$</p>
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
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-cricket-accent hover:bg-cricket-accent/90"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
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
