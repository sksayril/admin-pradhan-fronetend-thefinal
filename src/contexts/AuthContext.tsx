import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services';
import { Admin, LoginRequest, SignupRequest, ApiError } from '../services/types';

interface AuthContextType {
  // State
  user: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (adminData: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<Admin>) => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Admin | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is authenticated
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
            
            // Validate token by fetching fresh profile
            try {
              const profileResponse = await authService.getProfile();
              setUser(profileResponse.user);
            } catch (error) {
              // Token is invalid, clear auth state
              console.warn('Token validation failed:', error);
              await logout();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth logout events
    const handleAuthLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login(credentials);
      setUser(response.admin);
      setIsAuthenticated(true);
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (adminData: SignupRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.signup(adminData);
      setUser(response.admin);
      setIsAuthenticated(true);
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      setError(null);
    }
  };

  const updateProfile = async (profileData: Partial<Admin>): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || 'Profile update failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const refreshUser = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const profileResponse = await authService.getProfile();
      setUser(profileResponse.user);
    } catch (error) {
      console.error('Refresh user error:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
