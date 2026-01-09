import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import paapeliLogo from "@/assets/paapeli-logo.svg";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    // Since auth is now handled by APISIX, redirect to home
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <img src={paapeliLogo} alt="Paapeli Logo" className="h-12 w-auto mx-auto mb-4" />
        <p>{language === 'en' ? 'Redirecting...' : language === 'ar' ? 'جاري التوجيه...' : 'در حال انتقال...'}</p>
      </div>
    </div>
  );
};

export default AuthCallback;
