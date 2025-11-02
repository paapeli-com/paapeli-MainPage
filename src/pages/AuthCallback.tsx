import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import paapeliLogo from "@/assets/paapeli-logo.svg";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    // Get the authorization code from URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('Authentication error:', error);
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    if (code) {
      // Here you would typically exchange the code for tokens
      // For now, we'll just redirect to the home page after a brief delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      // No code found, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center">
        <div className="flex justify-center mb-6 animate-pulse">
          <img src={paapeliLogo} alt="Paapeli Logo" className="h-20 w-auto" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">
          {t('loggingIn') || 'Logging you in...'}
        </h1>
        <p className="text-muted-foreground">
          {t('pleaseWait') || 'Please wait while we complete your authentication'}
        </p>
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
