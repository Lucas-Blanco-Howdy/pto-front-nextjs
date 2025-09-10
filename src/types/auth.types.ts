export interface User {
    email: string;
    name: string;
    picture: string;
    googleId: string;
}

export interface AuthResponse {
    success: boolean;
    user?: User;
    error?: string;
}
