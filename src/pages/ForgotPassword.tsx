import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCognitoErrorMessage } from "@/utils/cognitoErrorMessages";
import paapeliLogo from "@/assets/paapeli-logo.svg";

const ForgotPassword = () => {
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [step, setStep] = React.useState<"email" | "reset">("email");
  const [isLoading, setIsLoading] = React.useState(false);
  const { forgotPassword, confirmPassword } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setStep("reset");
      toast({
        title: language === 'en' ? 'Code sent' : language === 'ar' ? 'تم إرسال الرمز' : 'کد ارسال شد',
        description: language === 'en' 
          ? 'Please check your email for the reset code.'
          : language === 'ar'
          ? 'يرجى التحقق من بريدك الإلكتروني للحصول على رمز إعادة التعيين.'
          : 'لطفاً ایمیل خود را برای کد بازیابی بررسی کنید.',
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await confirmPassword(email, code, newPassword);
      toast({
        title: language === 'en' ? 'Success!' : language === 'ar' ? 'نجح!' : 'موفق!',
        description: language === 'en'
          ? 'Password reset successful. You can now sign in with your new password.'
          : language === 'ar'
          ? 'تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.'
          : 'بازیابی رمز عبور موفقیت‌آمیز بود. اکنون می‌توانید با رمز عبور جدید وارد شوید.',
      });
      navigate("/login");
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f5f5f5]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <img
              src={paapeliLogo}
              alt="Paapeli"
              className="h-12 mx-auto mb-6"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">
            {language === 'en' ? 'Reset Password' : language === 'ar' ? 'إعادة تعيين كلمة المرور' : 'بازیابی رمز عبور'}
          </h1>
          <p className="text-gray-600">
            {step === "email" 
              ? (language === 'en' 
                  ? 'Enter your email to receive a password reset code'
                  : language === 'ar'
                  ? 'أدخل بريدك الإلكتروني لتلقي رمز إعادة تعيين كلمة المرور'
                  : 'ایمیل خود را وارد کنید تا کد بازیابی دریافت کنید')
              : (language === 'en'
                  ? 'Enter the code and your new password'
                  : language === 'ar'
                  ? 'أدخل الرمز وكلمة المرور الجديدة'
                  : 'کد و رمز عبور جدید را وارد کنید')
            }
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg border-0">
          {step === "email" ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-normal">
                  {language === 'en' ? 'Email' : language === 'ar' ? 'البريد الإلكتروني' : 'ایمیل'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={language === 'en' ? 'name@host.com' : language === 'ar' ? 'الاسم@المضيف.com' : 'نام@هاست.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white border-gray-300"
                />
              </div>
              <Button type="submit" className="w-full bg-[#4a90e2] hover:bg-[#357abd] text-white font-normal" disabled={isLoading}>
                {isLoading 
                  ? (language === 'en' ? 'Please wait...' : language === 'ar' ? 'يرجى الانتظار...' : 'لطفاً صبر کنید...')
                  : (language === 'en' ? 'Send Reset Code' : language === 'ar' ? 'إرسال رمز إعادة التعيين' : 'ارسال کد بازیابی')
                }
              </Button>
              <div className="text-center">
                <Link to="/login" className="text-sm text-[#4a90e2] hover:underline">
                  {language === 'en' ? 'Back to login' : language === 'ar' ? 'العودة لتسجيل الدخول' : 'بازگشت به ورود'}
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-gray-700 font-normal">
                  {language === 'en' ? 'Verification Code' : language === 'ar' ? 'رمز التحقق' : 'کد تأیید'}
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder={language === 'en' ? 'Enter code' : language === 'ar' ? 'أدخل الرمز' : 'کد را وارد کنید'}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-700 font-normal">
                  {language === 'en' ? 'New Password' : language === 'ar' ? 'كلمة المرور الجديدة' : 'رمز عبور جدید'}
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder={language === 'en' ? 'Enter new password' : language === 'ar' ? 'أدخل كلمة المرور الجديدة' : 'رمز عبور جدید را وارد کنید'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white border-gray-300"
                />
                <p className="text-xs text-gray-500">
                  {language === 'en' 
                    ? 'Must be at least 8 characters with upper/lowercase letters, a number, and a special character.'
                    : language === 'ar'
                    ? 'يجب أن تتكون من 8 أحرف على الأقل مع أحرف كبيرة/صغيرة ورقم وحرف خاص.'
                    : 'حداقل ۸ کاراکتر با حروف بزرگ/کوچک، یک عدد و یک کاراکتر خاص.'}
                </p>
              </div>
              <Button type="submit" className="w-full bg-[#4a90e2] hover:bg-[#357abd] text-white font-normal" disabled={isLoading}>
                {isLoading 
                  ? (language === 'en' ? 'Please wait...' : language === 'ar' ? 'يرجى الانتظار...' : 'لطفاً صبر کنید...')
                  : (language === 'en' ? 'Reset Password' : language === 'ar' ? 'إعادة تعيين كلمة المرور' : 'بازیابی رمز عبور')
                }
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-sm text-[#4a90e2] hover:underline"
                  disabled={isLoading}
                >
                  {language === 'en' ? 'Back to email' : language === 'ar' ? 'العودة إلى البريد الإلكتروني' : 'بازگشت به ایمیل'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
