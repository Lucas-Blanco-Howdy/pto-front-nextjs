import GoogleLoginButton from '@/components/GoogleLoginButton';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in to continue
          </p>
        </div>
        <div className="flex justify-center">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}


