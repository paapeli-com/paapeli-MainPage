import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import paapeliLogo from "@/assets/paapeli-logo.svg";

const Login = () => {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use AuthContext login method
      await login(formData.email, formData.password);
      
      // Check if running on panel domain
      const isPanelDomain = window.location.hostname.includes('panel.paapeli');
      
      if (isPanelDomain) {
        // Redirect to home page (panel home)
        navigate('/home');
      } else {
        // Redirect to panel domain home page
        window.location.href = 'http://panel.paapeli.local/home';
      }
    } catch (error: unknown) {
      console.error('Authentication error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      
      toast({
        title: language === 'en' ? 'Error' : language === 'ar' ? 'خطأ' : 'خطا',
        description: language === 'en' 
          ? errorMessage 
          : language === 'ar' 
            ? 'فشل المصادقة' 
            : 'احراز هویت شکست خورد',
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
                <Link to="/">
                  <img src={paapeliLogo} alt="Paapeli Logo" className="h-12 w-auto hover:opacity-80 transition-opacity cursor-pointer" />
                </Link>
              </div>
              <h1 className="text-2xl font-normal text-gray-800 mb-2">
                {language === 'en' ? 'Sign in to your account' : language === 'ar' ? 'تسجيل الدخول إلى حسابك' : 'ورود به حساب کاربری'}
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-700 font-normal">
                  {language === 'en' ? 'Email' : language === 'ar' ? 'البريد الإلكتروني' : 'ایمیل'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={language === 'en' ? 'name@host.com' : language === 'ar' ? 'الاسم@المضيف.com' : 'نام@هاست.com'}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 bg-white border-gray-300"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 font-normal">
                  {language === 'en' ? 'Password' : language === 'ar' ? 'كلمة المرور' : 'رمز عبور'}
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={language === 'en' ? 'Password' : language === 'ar' ? 'كلمة المرور' : 'رمز عبور'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-white border-gray-300 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#4a90e2] hover:bg-[#357abd] text-white font-normal"
                disabled={isLoading}
              >
                {isLoading 
                  ? (language === 'en' ? 'Please wait...' : language === 'ar' ? 'يرجى الانتظار...' : 'لطفاً صبر کنید...')
                  : (language === 'en' ? 'Sign in' : language === 'ar' ? 'تسجيل الدخول' : 'ورود')}
              </Button>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'Development mode: Use admin@dev.local / password' : language === 'ar' ? 'وضع التطوير: استخدم admin@dev.local / password' : 'حالت توسعه: از admin@dev.local / password استفاده کنید'}
                </p>
              </div>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Login;
