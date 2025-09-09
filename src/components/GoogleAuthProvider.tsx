'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode } from 'react';

interface GoogleAuthProviderProps {
  children: ReactNode;
}

export default function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "128089193559-3obhm576nvug273etae946tn62i73cid.apps.googleusercontent.com";

  if (!googleClientId) {
    console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured');
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}