// front-end/src/lib/auth.ts
import { graphqlMutation } from './api-client';
import { User, LoginResponse } from '../types/user';

interface LoginResult {
  success: boolean;
  error?: string;
  user?: User;
  token?: string;
}

// Safe localStorage access that works with SSR
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
};

export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    const data = await graphqlMutation<LoginResponse>(`
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          user {
            id
            email
            name
            role
            salonId
            salon {
              id
              name
            }
          }
          token
        }
      }
    `, {
      email,
      password
    });

    // Save token to localStorage
    if (data.login.token) {
      safeLocalStorage.setItem('token', data.login.token);
      safeLocalStorage.setItem('user', JSON.stringify(data.login.user));
    }

    return {
      success: true,
      user: data.login.user,
      token: data.login.token
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    return {
      success: false,
      error: errorMessage
    };
  }
}

export function logout(): void {
  safeLocalStorage.removeItem('token');
  safeLocalStorage.removeItem('user');
  // Use window.location instead of router to avoid hydration issues
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

export function getToken(): string | null {
  return safeLocalStorage.getItem('token');
}

export function getUser(): User | null {
  const user = safeLocalStorage.getItem('user');
  return user ? JSON.parse(user) as User : null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}