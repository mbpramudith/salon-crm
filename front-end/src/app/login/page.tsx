'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '../../lib/auth';
import LoginForm from '../../components/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Use a variable to track if component is mounted
    let isMounted = true;

    const checkAuth = () => {
      const userData = getUser();

      // Use setTimeout to defer state updates
      setTimeout(() => {
        if (!isMounted) return;

        if (userData) {
          router.push('/dashboard');
        } else {
          setIsChecking(false);
        }
      }, 0);
    };

    checkAuth();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [router]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Salon CRM
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}