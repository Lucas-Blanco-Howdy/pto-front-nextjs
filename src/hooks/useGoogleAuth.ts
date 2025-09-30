'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import { authService } from '../services/authService';

export const useGoogleAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            setLoading(true);
            setError(null);
            
            try {
                const data = await authService.authenticateWithGoogle(response.access_token);
                
                if (data.user) {
                    authService.saveUser(data.user);
                    router.push('/');
                }
            } catch (error) {
                // console.error('Error:', error);
                setError('Failed to sign in. Please try again.');
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            setError('Failed to connect with Google');
        },
    });

    return {
        login: handleGoogleLogin,
        loading,
        error
    };
};
