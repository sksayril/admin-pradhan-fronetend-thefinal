import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './config';
import { 
  LoginRequest, 
  SignupRequest, 
  AuthResponse, 
  ProfileResponse, 
  Admin,
  ApiResponse 
} from './types';
import { tokenUtils, dataUtils } from './utils';

class AuthService {
  // Admin Login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const sanitizedCredentials = dataUtils.sanitizeInput(credentials);
      
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        sanitizedCredentials
      );

      if (response.success && response.data) {
        // Save token and user data
        tokenUtils.saveToken(response.data.token);
        localStorage.setItem('admin_user_data', JSON.stringify(response.data.admin));
        
        return response.data;
      }

      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Admin Signup
  async signup(adminData: SignupRequest): Promise<AuthResponse> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(adminData);
      
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.SIGNUP,
        sanitizedData
      );

      if (response.success && response.data) {
        // Save token and user data
        tokenUtils.saveToken(response.data.token);
        localStorage.setItem('admin_user_data', JSON.stringify(response.data.admin));
        
        return response.data;
      }

      throw new Error(response.message || 'Signup failed');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  // Get Admin Profile
  async getProfile(): Promise<ProfileResponse> {
    try {
      const response = await apiClient.get<ProfileResponse>(
        API_ENDPOINTS.AUTH.PROFILE
      );

      if (response.success && response.data) {
        // Update stored user data
        localStorage.setItem('admin_user_data', JSON.stringify(response.data.user));
        
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch profile');
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Update Admin Profile
  async updateProfile(profileData: Partial<Admin>): Promise<Admin> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(profileData);
      
      const response = await apiClient.put<{ admin: Admin }>(
        API_ENDPOINTS.AUTH.PROFILE,
        sanitizedData
      );

      if (response.success && response.data) {
        // Update stored user data
        localStorage.setItem('admin_user_data', JSON.stringify(response.data.admin));
        
        return response.data.admin;
      }

      throw new Error(response.message || 'Profile update failed');
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Refresh Token
  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REFRESH
      );

      if (response.success && response.data) {
        // Update token
        tokenUtils.saveToken(response.data.token);
        
        return response.data;
      }

      throw new Error(response.message || 'Token refresh failed');
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Always clear local data
      tokenUtils.removeToken();
      localStorage.removeItem('admin_user_data');
    }
  }

  // Check Authentication Status
  isAuthenticated(): boolean {
    return tokenUtils.isAuthenticated();
  }

  // Get Current User Data
  getCurrentUser(): Admin | null {
    try {
      const userData = localStorage.getItem('admin_user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Get Current Token
  getCurrentToken(): string | null {
    return tokenUtils.getToken();
  }

  // Validate Token
  async validateToken(): Promise<boolean> {
    try {
      if (!this.isAuthenticated()) {
        return false;
      }

      await this.getProfile();
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  // Change Password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const sanitizedData = dataUtils.sanitizeInput({
        currentPassword,
        newPassword,
      });
      
      const response = await apiClient.put(
        `${API_ENDPOINTS.AUTH.PROFILE}/password`,
        sanitizedData
      );

      if (!response.success) {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Reset Password Request
  async requestPasswordReset(email: string): Promise<void> {
    try {
      const sanitizedEmail = dataUtils.sanitizeInput(email);
      
      const response = await apiClient.post(
        `${API_ENDPOINTS.AUTH.PROFILE}/reset-password`,
        { email: sanitizedEmail }
      );

      if (!response.success) {
        throw new Error(response.message || 'Password reset request failed');
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  // Verify Email
  async verifyEmail(token: string): Promise<void> {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.AUTH.PROFILE}/verify-email`,
        { token }
      );

      if (!response.success) {
        throw new Error(response.message || 'Email verification failed');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const authService = new AuthService();
export default authService;
