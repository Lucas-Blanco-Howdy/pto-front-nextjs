import { AuthResponse, User } from '../types/auth.types';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'tu-secreto-super-seguro-12345-para-jwt';

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
            // Crear JWT token
            const token = jwt.sign({ email: data.user.email }, JWT_SECRET, { expiresIn: '24h' });
            
            localStorage.setItem('authenticated_email', data.user.email);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('auth_token', token);
        }

        return data;
    },

    createAuthToken(email: string): string {
        return jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
    },

    saveUser(user: User): void {
        const token = this.createAuthToken(user.email);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('authenticated_email', user.email);
        localStorage.setItem('auth_token', token);
    },

    getAuthenticatedEmail(): string | null {
        const email = localStorage.getItem('authenticated_email');
        return email;
    },

    getAuthToken(): string | null {
        return localStorage.getItem('auth_token');
    },

    getUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    logout(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('authenticated_email');
        localStorage.removeItem('auth_token');
    }
};
