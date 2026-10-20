import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, verifyOTP } from '../../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore stored session on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to restore auth session:', err);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAuthSuccess = (accessToken, refreshToken, userData) => {
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    if (res.accessToken && res.user) {
      handleAuthSuccess(res.accessToken, res.refreshToken, res.user);
    }
    return res;
  };

  const sendRegistrationOtp = async (formData) => {
    const res = await registerUser(formData);
    return res;
  };

  const verifyAndRegister = async (email, otp) => {
    const res = await verifyOTP({ email, otp });
    if (res.accessToken && res.user) {
      handleAuthSuccess(res.accessToken, res.refreshToken, res.user);
    }
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const updateCurrentUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    setUser(merged);
    localStorage.setItem('user', JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        sendRegistrationOtp,
        verifyAndRegister,
        logout,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
