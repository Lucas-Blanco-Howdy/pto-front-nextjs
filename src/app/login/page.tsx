import GoogleLoginButton from '@/components/GoogleLoginButton';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECD0B5]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image 
              src="/howdy-logo.svg" 
              alt="Howdy" 
              width={120}
              height={45}
              className="h-12 w-auto"
            />
          </div>
          <p className="mt-2 text-gray-600 text-lg">
            Sign in to manage your time off
          </p>
        </div>
        <div className="flex justify-center">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}


