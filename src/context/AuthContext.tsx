import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLogin: boolean;
  username: string | null;
  accessToken: string | null;
  role: string | null;
  otpRequired: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [otpRequired, setOtpRequired] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const storedUsername = localStorage.getItem('adminUsername');
    const storedRole = localStorage.getItem('adminRole');
    const storedIsLogin = localStorage.getItem('adminIsLogin') === 'true';

    if (token && storedIsLogin) {
      // User has completed full login process
      setAccessToken(token);
      setIsAuthenticated(true);
      setIsLogin(true);
      setUsername(storedUsername);
      setRole(storedRole);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('https://backendconf.roboticsaisummit.com/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        setUsername(username);
        setRole(data.role); // Set the role from API response
        localStorage.setItem('adminRole', data.role); // Store role in localStorage
        setOtpRequired(true);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    if (!username) return false;
    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('otp', otp);

      const response = await fetch(`https://backendconf.roboticsaisummit.com/api/emails/verify-otp?${params.toString()}`, {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUsername', username);
        localStorage.setItem('adminIsLogin', 'true');
        setAccessToken(token);
        setIsAuthenticated(true);
        setIsLogin(true);
        setOtpRequired(false);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminIsLogin');
    setIsAuthenticated(false);
    setIsLogin(false);
    setUsername(null);
    setAccessToken(null);
    setRole(null);
    setOtpRequired(false);
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await fetch('https://backendconf.roboticsaisummit.com/api/admin/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ username: username || 'admin@arc.com', oldPassword, newPassword }),
      });
      return response.ok;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLogin, username, accessToken, role, otpRequired, login, verifyOtp, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};