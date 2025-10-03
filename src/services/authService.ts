import { AuthResponse, User } from '../types/auth.types';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'tu-secreto-super-seguro-12345-para-jwt';
const BLOCKED_EMAILS = ['marianapulgarin@howdy.com', 'katie@howdy.com', 'jackie@howdy.com', 'lucianovarini@howdy.com', 'lucasblanco@howdy.com']; 

export const authService = {
    async authenticateWithGoogle(accessToken: string): Promise<AuthResponse> {
        try {
            
            const googleResponse = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`);
            
            if (!googleResponse.ok) {
                throw new Error('Invalid Google token');
            }
            
            const userInfo = await googleResponse.json();
            
            if (BLOCKED_EMAILS.includes(userInfo.email) || !userInfo.email.endsWith('@howdy.com')) {
                throw new Error('Only Howdy employees can access this system');
            }

            
            const user = {
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
                googleId: userInfo.id
            };
            
            localStorage.setItem('authenticated_email', user.email);
            localStorage.setItem('user', JSON.stringify(user));
            
            document.cookie = `authenticated_email=${user.email}; path=/; secure; samesite=strict`;

            return { success: true, user };
            
        } catch (error) {
            // console.error('Google auth error:', error);
            throw new Error('Authentication failed');
        }
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
