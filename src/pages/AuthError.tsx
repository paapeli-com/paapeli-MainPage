import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import paapeliLogo from "@/assets/paapeli-logo.png";
import { AlertCircle, ArrowLeft } from "lucide-react";

const AuthError = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [errorDetails, setErrorDetails] = useState<{
    error: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    if (error) {
      let description = errorDescription || '';
      
      // Handle common OAuth errors
      switch (error) {
        case 'redirect_mismatch':
          description = 'The redirect URL is not configured correctly. Please contact support.';
          break;
        case 'access_denied':
          description = 'Access was denied. Please try again.';
          break;
        case 'invalid_request':
          description = 'Invalid authentication request.';
          break;
        default:
          description = description || 'An error occurred during authentication.';
      }

      setErrorDetails({
        error,
        description,
      });
    }
  }, []);

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Logo */}
          <img 
            src={paapeliLogo} 
            alt="Paapeli Logo" 
            className="h-16 w-auto"
          />

          {/* Error Icon */}
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Authentication Error
            </h1>
            <p className="text-muted-foreground">
              {errorDetails?.description || 'An error occurred during authentication.'}
            </p>
            {errorDetails?.error && (
              <p className="text-sm text-muted-foreground/70">
                Error code: {errorDetails.error}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col w-full gap-3">
            <Button
              onClick={() => navigate('/login')}
              className="w-full"
              size="lg"
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              Back to Login
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Go to Home
            </Button>
          </div>

          {/* Support Info */}
          <div className="pt-4 border-t border-border w-full">
            <p className="text-sm text-muted-foreground">
              Need help?{' '}
              <a 
                href="mailto:support@paapeli.com"
                className="text-primary hover:underline font-medium"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuthError;
