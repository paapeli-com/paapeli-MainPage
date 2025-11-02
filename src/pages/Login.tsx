import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { LogIn, UserPlus } from "lucide-react";
import paapeliLogo from "@/assets/paapeli-logo.svg";

const Login = () => {
  const { t, isRTL } = useLanguage();

  const COGNITO_DOMAIN = "https://paapeli-dev-auth.auth.me-central-1.amazoncognito.com";
  const CLIENT_ID = "1bq97rv5ese04a9spkmlaorl4t";
  const REDIRECT_URI = "https://paapeli.com/auth/callback";
  const SCOPES = "email+openid+profile";

  const handleLogin = () => {
    const loginUrl = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=${SCOPES}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = loginUrl;
  };

  const handleSignup = () => {
    const signupUrl = `${COGNITO_DOMAIN}/signup?client_id=${CLIENT_ID}&response_type=code&scope=${SCOPES}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = signupUrl;
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      
      <section className="relative min-h-screen flex items-center justify-center pt-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <Card className="p-8 border-border shadow-xl bg-card">
              {/* Logo and Title */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <img src={paapeliLogo} alt="Paapeli Logo" className="h-16 w-auto" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {t('welcomeBack') || 'Welcome to Paapeli'}
                </h1>
                <p className="text-muted-foreground">
                  {t('loginSubtitle') || 'Access your IoT dashboard'}
                </p>
              </div>

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                size="lg"
                className="w-full mb-4 bg-primary hover:bg-primary/90 text-primary-foreground text-lg"
              >
                <LogIn className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('login') || 'Login'}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground">
                    {t('or') || 'OR'}
                  </span>
                </div>
              </div>

              {/* Sign Up Button */}
              <Button
                onClick={handleSignup}
                size="lg"
                variant="outline"
                className="w-full text-lg border-2"
              >
                <UserPlus className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('createAccount') || 'Create Account'}
              </Button>

              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground">
                  {t('secureLogin') || 'Secure authentication powered by AWS Cognito'}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
