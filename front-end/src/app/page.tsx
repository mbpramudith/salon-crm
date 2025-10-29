// front-end/src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../lib/auth';

export default function Home() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Use setTimeout to avoid hydration issues
    const timer = setTimeout(() => {
      setIsRedirecting(true);
      if (isAuthenticated()) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">
        {isRedirecting ? 'Redirecting...' : 'Loading...'}
      </div>
    </div>
  );
}