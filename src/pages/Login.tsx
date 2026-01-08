import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getCognitoErrorMessage } from "@/utils/cognitoErrorMessages";
import paapeliLogo from "@/assets/paapeli-logo.svg";

const Login = () => {
  const { language, isRTL } = useLanguage();
  const { signIn, signUp, confirmSignUp, resendConfirmationCode, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Timer for resend code
  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!formData.email || !formData.password) {
          toast({
            title: language === 'en' ? 'Error' : language === 'ar' ? 'خطأ' : 'خطا',
            description: language === 'en' ? 'All fields are required' : language === 'ar' ? 'جميع الحقول مطلوبة' : 'همه فیلدها الزامی هستند',
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        // Client-side password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
          toast({
            title: language === 'en' ? 'Invalid Password' : language === 'ar' ? 'كلمة مرور غير صالحة' : 'رمز عبور نامعتبر',
            description: language === 'en' 
              ? 'Password must be at least 8 characters with upper/lowercase letters, a number, and a special character.'
              : language === 'ar'
              ? 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل مع أحرف كبيرة/صغيرة ورقم وحرف خاص.'
              : 'رمز عبور باید حداقل ۸ کاراکتر با حروف بزرگ/کوچک، یک عدد و یک کاراکتر خاص داشته باشد.',
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        await signUp(formData.email, formData.password);
        toast({
          title: language === 'en' ? 'Success!' : language === 'ar' ? 'نجح!' : 'موفق!',
          description: language === 'en'
            ? 'Account created. Please check your email for verification code.'
            : language === 'ar'
            ? 'تم إنشاء الحساب. يرجى التحقق من بريدك الإلكتروني لرمز التحقق.'
            : 'حساب ایجاد شد. لطفاً ایمیل خود را برای کد تأیید بررسی کنید.',
        });
        setNeedsVerification(true);
        setResendTimer(30);
        setFormData({ ...formData, password: '' });
      } else {
        if (!formData.email || !formData.password) {
          toast({
            title: language === 'en' ? 'Error' : language === 'ar' ? 'خطأ' : 'خطا',
            description: language === 'en' ? 'Email and password are required' : language === 'ar' ? 'البريد الإلكتروني وكلمة المرور مطلوبان' : 'ایمیل و رمز عبور الزامی هستند',
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        await signIn(formData.email, formData.password);
        toast({
          title: language === 'en' ? 'Welcome back!' : language === 'ar' ? 'مرحبا بعودتك!' : 'خوش آمدید!',
          description: language === 'en' ? 'Successfully signed in.' : language === 'ar' ? 'تم تسجيل الدخول بنجاح.' : 'با موفقیت وارد شدید.',
        });
        navigate('/');
      }
    } catch (error: unknown) {
      console.error('Authentication error:', error);
      console.error('Error details:', { code: (error as { code?: string })?.code, name: (error as { name?: string })?.name, message: (error as { message?: string })?.message });
      const errorMessage = getCognitoErrorMessage(error, language as 'en' | 'ar' | 'fa');
      toast({
        title: language === 'en' ? 'Error' : language === 'ar' ? 'خطأ' : 'خطا',
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await confirmSignUp(formData.email, verificationCode);
      toast({
        title: language === 'en' ? 'Verified!' : language === 'ar' ? 'تم التحقق!' : 'تأیید شد!',
        description: language === 'en'
          ? 'Your account has been verified. You can now sign in.'
          : language === 'ar'
          ? 'تم التحقق من حسابك. يمكنك الآن تسجيل الدخول.'
          : 'حساب شما تأیید شد. اکنون می‌توانید وارد شوید.',
      });
      setNeedsVerification(false);
      setVerificationCode('');
      setFormData({ email: '', password: '' });
      setIsSignUp(false);
    } catch (error: unknown) {
      toast({
        title: language === 'en' ? 'Error' : language === 'ar' ? 'خطأ' : 'خطا',
        description: getCognitoErrorMessage(error, language as 'en' | 'ar' | 'fa'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    try {
      await resendConfirmationCode(formData.email);
      setResendTimer(30);
      toast({
        title: language === 'en' ? 'Code sent' : language === 'ar' ? 'تم إرسال الرمز' : 'کد ارسال شد',
        description: language === 'en' 
          ? 'Please check your email for the verification code.'
          : language === 'ar'
          ? 'يرجى التحقق من بريدك الإلكتروني للحصول على رمز التحقق.'
          : 'لطفاً ایمیل خود را برای کد تأیید بررسی کنید.',
      });
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: language === 'en' ? 'Error' : language === 'ar' ? 'خطأ' : 'خطا',
        description: getCognitoErrorMessage(error, language as 'en' | 'ar' | 'fa'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      toast({
        title: language === 'en' ? 'Error' : language === 'ar' ? 'خطأ' : 'خطا',
        description: getCognitoErrorMessage(error, language as 'en' | 'ar' | 'fa'),
        variant: "destructive",
      });
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
                {isSignUp 
                  ? (language === 'en' ? 'Sign up with a new account' : language === 'ar' ? 'التسجيل بحساب جديد' : 'ثبت‌نام با حساب جدید')
                  : (language === 'en' ? 'Sign in to your account' : language === 'ar' ? 'تسجيل الدخول إلى حسابك' : 'ورود به حساب کاربری')}
              </h1>
            </div>

            {needsVerification ? (
              <form onSubmit={handleVerification} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    {language === 'en' 
                      ? 'Please check your email for the verification code.'
                      : language === 'ar'
                      ? 'يرجى التحقق من بريدك الإلكتروني للحصول على رمز التحقق.'
                      : 'لطفاً ایمیل خود را برای کد تأیید بررسی کنید.'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="code" className="text-gray-700 font-normal">
                    {language === 'en' ? 'Verification Code' : language === 'ar' ? 'رمز التحقق' : 'کد تأیید'}
                  </Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder={language === 'en' ? 'Enter 6-digit code' : language === 'ar' ? 'أدخل الرمز المكون من 6 أرقام' : 'کد ۶ رقمی را وارد کنید'}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="mt-1 bg-white border-gray-300"
                    disabled={isLoading}
                    maxLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#4a90e2] hover:bg-[#357abd] text-white font-normal"
                  disabled={isLoading || verificationCode.length !== 6}
                >
                  {isLoading 
                    ? (language === 'en' ? 'Verifying...' : language === 'ar' ? 'جاري التحقق...' : 'در حال تأیید...')
                    : (language === 'en' ? 'Verify Email' : language === 'ar' ? 'التحقق من البريد الإلكتروني' : 'تأیید ایمیل')}
                </Button>

                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendTimer > 0 || isLoading}
                    className="text-sm text-[#4a90e2] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendTimer > 0 
                      ? (language === 'en' 
                          ? `Resend code (${resendTimer}s)` 
                          : language === 'ar' 
                          ? `إعادة إرسال الرمز (${resendTimer}ث)` 
                          : `ارسال مجدد کد (${resendTimer}ث)`)
                      : (language === 'en' ? 'Resend code' : language === 'ar' ? 'إعادة إرسال الرمز' : 'ارسال مجدد کد')
                    }
                  </button>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setNeedsVerification(false);
                        setVerificationCode('');
                        setFormData({ email: '', password: '' });
                      }}
                      className="text-sm text-[#4a90e2] hover:underline"
                      disabled={isLoading}
                    >
                      {language === 'en' ? 'Back to sign up' : language === 'ar' ? 'العودة إلى التسجيل' : 'بازگشت به ثبت‌نام'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
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
                <Input
                  id="password"
                  type="password"
                  placeholder={language === 'en' ? 'Password' : language === 'ar' ? 'كلمة المرور' : 'رمز عبور'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 bg-white border-gray-300"
                  disabled={isLoading}
                />
                {isSignUp && (
                  <p className="text-xs text-gray-500 mt-1">
                    {language === 'en' 
                      ? 'Must be at least 8 characters with upper/lowercase letters, a number, and a special character.'
                      : language === 'ar'
                      ? 'يجب أن تتكون من 8 أحرف على الأقل مع أحرف كبيرة/صغيرة ورقم وحرف خاص.'
                      : 'حداقل ۸ کاراکتر با حروف بزرگ/کوچک، یک عدد و یک کاراکتر خاص.'}
                  </p>
                )}
              </div>

              {!isSignUp && (
                <div className="text-right">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-[#4a90e2] hover:underline"
                  >
                    {language === 'en' ? 'Forgot password?' : language === 'ar' ? 'هل نسيت كلمة المرور؟' : 'رمز عبور را فراموش کرده‌اید؟'}
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#4a90e2] hover:bg-[#357abd] text-white font-normal"
                disabled={isLoading}
              >
                {isLoading 
                  ? (language === 'en' ? 'Please wait...' : language === 'ar' ? 'يرجى الانتظار...' : 'لطفاً صبر کنید...')
                  : isSignUp 
                    ? (language === 'en' ? 'Sign up' : language === 'ar' ? 'التسجيل' : 'ثبت‌نام')
                    : (language === 'en' ? 'Sign in' : language === 'ar' ? 'تسجيل الدخول' : 'ورود')}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    {language === 'en' ? 'Or' : language === 'ar' ? 'أو' : 'یا'}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-300 text-gray-700 font-normal"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {language === 'en' ? 'Continue with Google' : language === 'ar' ? 'المتابعة مع Google' : 'ادامه با Google'}
              </Button>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  {isSignUp 
                    ? (language === 'en' ? 'Already have an account? ' : language === 'ar' ? 'هل لديك حساب بالفعل؟ ' : 'از قبل حساب دارید؟ ')
                    : (language === 'en' ? "Don't have an account? " : language === 'ar' ? 'ليس لديك حساب؟ ' : 'حساب ندارید؟ ')}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-[#4a90e2] hover:underline font-normal"
                    disabled={isLoading}
                  >
                    {isSignUp 
                      ? (language === 'en' ? 'Sign in' : language === 'ar' ? 'تسجيل الدخول' : 'ورود')
                      : (language === 'en' ? 'Sign up' : language === 'ar' ? 'التسجيل' : 'ثبت‌نام')}
                  </button>
                </p>
              </div>
            </form>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Login;
