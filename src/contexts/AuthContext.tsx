import React, { createContext, useContext, useState, useEffect } from 'react';
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserSession, CognitoUserAttribute } from 'amazon-cognito-identity-js';

const REGION = 'me-central-1';
const USER_POOL_ID = 'me-central-1_WCBtB2Rc0';
const CLIENT_ID = '37dl99jmgg21jve8e6n7pfd1da';
const COGNITO_DOMAIN = 'paapeli-dev-auth.auth.me-central-1.amazoncognito.com';

const userPool = new CognitoUserPool({
  UserPoolId: USER_POOL_ID,
  ClientId: CLIENT_ID,
});

interface AuthContextType {
  user: CognitoUser | null;
  session: CognitoUserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  resendConfirmationCode: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  confirmPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: (stayOnPage?: boolean) => boolean;
  getCurrentSession: () => Promise<CognitoUserSession | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [session, setSession] = useState<CognitoUserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentSession = async (): Promise<CognitoUserSession | null> => {
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) return null;

    return new Promise((resolve) => {
      cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
        if (err || !session) {
          resolve(null);
          return;
        }
        resolve(session);
      });
    });
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const cognitoUser = userPool.getCurrentUser();
        if (cognitoUser) {
          const currentSession = await getCurrentSession();
          if (currentSession && currentSession.isValid()) {
            setUser(cognitoUser);
            setSession(currentSession);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    // Demo login bypass - for testing when Cognito is unavailable
    if (email === 'demo' && password === 'demo') {
      // Create a mock user object for demo purposes
      const mockUser = {
        getUsername: () => 'demo',
        getSession: (callback: any) => callback(null, null),
        signOut: () => {},
      } as unknown as CognitoUser;
      
      setUser(mockUser);
      // Create a minimal mock session
      setSession({
        isValid: () => true,
        getIdToken: () => ({ getJwtToken: () => 'demo-token' }),
        getAccessToken: () => ({ getJwtToken: () => 'demo-access-token' }),
        getRefreshToken: () => ({ getToken: () => 'demo-refresh-token' }),
      } as unknown as CognitoUserSession);
      
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          setUser(cognitoUser);
          setSession(session);
          resolve();
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Use email as username and set email attribute
      const attributeList = [
        new CognitoUserAttribute({
          Name: 'email',
          Value: email,
        }),
      ];

      userPool.signUp(
        email, // username (using email)
        password,
        attributeList,
        null, // validation data should be null, not []
        (err: unknown, result) => {
          if (err) {
            console.error('Cognito signUp error:', err);
            console.error('Error code:', (err as { code?: string })?.code || 'no code');
            console.error('Error message:', (err as { message?: string })?.message || 'no message');
            console.error('Error name:', (err as { name?: string })?.name || 'no name');
            reject(err);
            return;
          }
          console.log('SignUp successful:', result);
          resolve();
        }
      );
    });
  };

  const confirmSignUp = async (email: string, code: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  };

  const resendConfirmationCode = async (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.resendConfirmationCode((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  };

  const forgotPassword = async (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.forgotPassword({
        onSuccess: () => {
          resolve();
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };

  const confirmPassword = async (email: string, code: string, newPassword: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.confirmPassword(code, newPassword, {
        onSuccess: () => {
          resolve();
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };

  const signInWithGoogle = async (): Promise<void> => {
    // Determine the correct redirect URI based on current domain
    const hostname = window.location.hostname;
    let redirectUri = `${window.location.origin}/auth/callback`;
    
    // If on panel domain, use panel callback
    if (hostname === 'panel.paapeli.com' || hostname.includes('panel-')) {
      redirectUri = `${window.location.origin}/auth/callback`;
    }
    
    const googleAuthUrl = `https://${COGNITO_DOMAIN}/oauth2/authorize?identity_provider=Google&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=CODE&client_id=${CLIENT_ID}&scope=email openid profile`;
    
    window.location.href = googleAuthUrl;
    return Promise.resolve();
  };

  const signOut = (stayOnPage = false) => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    setUser(null);
    setSession(null);
    return stayOnPage;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user && !!session,
        isLoading,
        signIn,
        signUp,
        confirmSignUp,
        resendConfirmationCode,
        forgotPassword,
        confirmPassword,
        signInWithGoogle,
        signOut,
        getCurrentSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};  
