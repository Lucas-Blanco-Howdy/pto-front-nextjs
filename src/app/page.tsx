'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SalesforceForm from '@/components/SalesforceForm';
import Image from 'next/image';

interface User {
  email: string;
  name: string;
  picture: string;
  googleId: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/login');
      } else {
        setUser(JSON.parse(storedUser));
        setLoading(false);
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/30">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-stone-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Image 
              src="/howdy-logo.svg" 
              alt="Howdy" 
              width={120}
              height={45}
              className="h-10 w-auto"
            />
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                {user?.picture && (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full ring-2 ring-amber-200"
                  />
                )}
                <span className="text-sm font-medium text-stone-700">
                  Hey, {user?.name?.split(' ')[0]}! 👋
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-stone-600 hover:text-stone-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-stone-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <SalesforceForm />
      </main>
    </div>
  );
}
