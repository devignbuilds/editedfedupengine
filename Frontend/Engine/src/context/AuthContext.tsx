import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import type { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string, role?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check both storages
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = true) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        if (rememberMe) {
            localStorage.setItem('user', JSON.stringify(data));
        } else {
            sessionStorage.setItem('user', JSON.stringify(data));
        }
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Server error' };
    }
  };

  const register = async (name: string, email: string, password: string, role?: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Server error' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
