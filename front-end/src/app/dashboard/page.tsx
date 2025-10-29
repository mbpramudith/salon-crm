// front-end/src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '../../lib/auth';
import { User } from '../../types/user';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = getUser();

    if (!userData) {
      router.push('/login');
      return;
    }

    // Use setTimeout to avoid hydration issues
    const timer = setTimeout(() => {
      setUser(userData);
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Salon CRM Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8 bg-white">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Welcome to your Salon CRM!</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> <span className="capitalize">{user?.role?.toLowerCase()}</span></p>
              {user?.salon ? (
                <p><strong>Salon:</strong> {user.salon.name}</p>
              ) : (
                <p><strong>Salon:</strong> No salon assigned</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="flex space-x-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                  View Customers
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                  Create Appointment
                </button>
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">
                  Manage Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}