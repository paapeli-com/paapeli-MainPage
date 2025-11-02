import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import paapeliLogo from "@/assets/paapeli-logo.svg";

const Login = () => {
  const { t, isRTL } = useLanguage();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!formData.username || !formData.email || !formData.password) {
          toast({
            title: "Error",
            description: "All fields are required",
            variant: "destructive",
          });
          return;
        }
        
        if (formData.password.length < 8) {
          toast({
            title: "Error",
            description: "Password must be at least 8 characters",
            variant: "destructive",
          });
          return;
        }

        await signUp(formData.email, formData.password, formData.username);
        toast({
          title: "Success!",
          description: "Account created. Please check your email to verify your account.",
        });
        setIsSignUp(false);
        setFormData({ username: '', email: '', password: '' });
      } else {
        if (!formData.email || !formData.password) {
          toast({
            title: "Error",
            description: "Email and password are required",
            variant: "destructive",
          });
          return;
        }

        await signIn(formData.email, formData.password);
        toast({
          title: "Welcome back!",
          description: "Successfully signed in.",
        });
        navigate('/');
      }
    } catch (error: any) {
      const errorMessage = error.message || "Authentication failed";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="w-full max-w-md">
          <Card className="p-8 bg-white shadow-lg border-0">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <img src={paapeliLogo} alt="Paapeli Logo" className="h-12 w-auto" />
              </div>
              <h1 className="text-2xl font-normal text-gray-800 mb-2">
                {isSignUp ? 'Sign up with a new account' : 'Sign in to your account'}
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <Label htmlFor="username" className="text-gray-700 font-normal">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="mt-1 bg-white border-gray-300"
                    disabled={isLoading}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email" className="text-gray-700 font-normal">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@host.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 bg-white border-gray-300"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 font-normal">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 bg-white border-gray-300"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#4a90e2] hover:bg-[#357abd] text-white font-normal"
                disabled={isLoading}
              >
                {isLoading ? 'Please wait...' : (isSignUp ? 'Sign up' : 'Sign in')}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[#4a90e2] hover:underline font-normal"
                  disabled={isLoading}
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>

            {!isSignUp && (
              <div className="text-center mt-4">
                <Link to="/forgot-password" className="text-sm text-[#4a90e2] hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Login;
