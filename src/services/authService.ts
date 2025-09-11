import { AuthResponse, User } from '../types/auth.types';

export const authService = {
    async authenticateWithGoogle(accessToken: string): Promise<AuthResponse> {
        const response = await fetch('/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessToken }),
        });

        if (!response.ok) {
            throw new Error('Authentication failed');
        }

        const data = await response.json();
        
        if (data.success && data.user) {
            
            localStorage.setItem('authenticated_email', data.user.email);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    },

    saveUser(user: User): void {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('authenticated_email', user.email);
    },

    getAuthenticatedEmail(): string | null {
        const email = localStorage.getItem('authenticated_email');
        return email;
    },

    getUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    logout(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('authenticated_email');
    }
};
