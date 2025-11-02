import React, { createContext, useContext, useState, useEffect } from 'react';
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserSession } from 'amazon-cognito-identity-js';

const REGION = 'me-central-1';
const USER_POOL_ID = 'me-central-1_RdwVKu4tt';
const CLIENT_ID = '1bq97rv5ese04a9spkmlaorl4t';

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
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
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
      userPool.signUp(
        email,
        password,
        [],
        [],
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  };

  const signInWithGoogle = async (): Promise<void> => {
    // Google OAuth flow through Cognito
    const domain = `paapeli-${REGION}.auth.${REGION}.amazoncognito.com`;
    const redirectUri = `${window.location.origin}/auth-callback`;
    const googleAuthUrl = `https://${domain}/oauth2/authorize?identity_provider=Google&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=CODE&client_id=${CLIENT_ID}&scope=email openid profile`;
    
    window.location.href = googleAuthUrl;
    return Promise.resolve();
  };

  const signOut = () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    setUser(null);
    setSession(null);
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
