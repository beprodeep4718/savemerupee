import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosClient from '../config/axiosClient';

interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  age?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  sendOTP: (phoneNumber: string) => Promise<{ success: boolean; message?: string }>;
  verifyOTP: (phoneNumber: string, code: string) => Promise<{ success: boolean; message?: string }>;
  fetchUserProfile: () => Promise<{ success: boolean; message?: string }>;
  updateProfile: (data: { name?: string; age?: number }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      sendOTP: async (phoneNumber: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosClient.post('/auth/send-otp', { phoneNumber });
          set({ isLoading: false });
          return { success: true, message: response.data.message };
        } catch (error: unknown) {
          const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to send OTP';
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      verifyOTP: async (phoneNumber: string, code: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosClient.post('/auth/verify-otp', { phoneNumber, code });
          const { token, user } = response.data;

          // Store token in localStorage
          localStorage.setItem('token', token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, message: 'Login successful' };
        } catch (error: unknown) {
          const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Invalid verification code';
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      fetchUserProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosClient.get('/user/profile');
          const { user } = response.data;

          set({
            user,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } catch (error: unknown) {
          const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch profile';
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      updateProfile: async (data: { name?: string; age?: number }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosClient.put('/user/profile', data);
          const { user } = response.data;

          set({
            user,
            isLoading: false,
            error: null,
          });

          return { success: true, message: 'Profile updated successfully' };
        } catch (error: unknown) {
          const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update profile';
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
          set({ token, isAuthenticated: true });
        } else {
          set({ token: null, isAuthenticated: false, user: null });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
