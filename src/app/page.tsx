'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SalesforceForm from '@/components/SalesforceForm';

// Define user type
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
    // Only run on client
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              PTO REQUEST SYSTEM
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Hello, {user?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Sign out
            </button>
          </div>
        </div>
        
        <SalesforceForm />
      </div>
    </div>
  );
}
