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

        return response.json();
    },

    saveUser(user: User): void {
        localStorage.setItem('user', JSON.stringify(user));
    },

    getUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    clearUser(): void {
        localStorage.removeItem('user');
    }
};
