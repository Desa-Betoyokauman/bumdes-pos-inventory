'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../api/auth.service';
import type { LoginRequest } from '../types';

export function useLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(data);
      
      if (response.success && response.data) {
        // Save token and user to localStorage
        authService.saveAuth(response.data.token, response.data.user);
        
        // Redirect to dashboard
        router.push('/dashboard');
        return true;
      }
      
      return false;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Login gagal. Silakan coba lagi.';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}