import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import paapeliLogo from "@/assets/paapeli-logo.svg";
import { toast } from "sonner";

const REGION = 'me-central-1';
const USER_POOL_ID = 'me-central-1_WCBtB2Rc0';
const CLIENT_ID = '37dl99jmgg21jve8e6n7pfd1da';
const COGNITO_DOMAIN = 'paapeli-dev-auth.auth.me-central-1.amazoncognito.com';

const userPool = new CognitoUserPool({
  UserPoolId: USER_POOL_ID,
  ClientId: CLIENT_ID,
});

const AuthCallback = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { getCurrentSession } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        console.error('Authentication error:', error);
        setErrorMessage('Authentication failed');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      if (!code) {
        navigate('/login');
        return;
      }

      try {
        // Exchange authorization code for tokens
        const redirectUri = `${window.location.origin}/auth/callback`;
        const tokenEndpoint = `https://${COGNITO_DOMAIN}/oauth2/token`;
        
        const response = await fetch(tokenEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            code: code,
            redirect_uri: redirectUri,
          }),
        });

        if (!response.ok) {
          throw new Error('Token exchange failed');
        }

        const tokens = await response.json();
        
        // Set the tokens in local storage for Cognito
        const idTokenKey = `CognitoIdentityServiceProvider.${CLIENT_ID}.LastAuthUser`;
        const accessTokenKey = `CognitoIdentityServiceProvider.${CLIENT_ID}.${tokens.id_token}.accessToken`;
        const idTokenStorageKey = `CognitoIdentityServiceProvider.${CLIENT_ID}.${tokens.id_token}.idToken`;
        const refreshTokenKey = `CognitoIdentityServiceProvider.${CLIENT_ID}.${tokens.id_token}.refreshToken`;
        
        localStorage.setItem(idTokenKey, tokens.id_token);
        localStorage.setItem(accessTokenKey, tokens.access_token);
        localStorage.setItem(idTokenStorageKey, tokens.id_token);
        localStorage.setItem(refreshTokenKey, tokens.refresh_token);

        toast.success('Successfully logged in!');
        
        // Redirect to home page
        setTimeout(() => {
          navigate('/');
          window.location.reload(); // Reload to ensure auth state is updated
        }, 500);
        
      } catch (err) {
        console.error('Token exchange error:', err);
        setErrorMessage('Authentication failed');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    };

    handleCallback();
  }, [navigate, t, getCurrentSession]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center">
        <div className="flex justify-center mb-6 animate-pulse">
          <img src={paapeliLogo} alt="Paapeli Logo" className="h-20 w-auto" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">
          {errorMessage || t('loggingIn') || 'Logging you in...'}
        </h1>
        <p className="text-muted-foreground">
          {errorMessage ? 'Redirecting...' : t('pleaseWait') || 'Please wait while we complete your authentication'}
        </p>
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
