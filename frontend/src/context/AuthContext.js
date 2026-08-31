import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI, getMe } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tms_token');
    if (token) {
      getMe().then(res => setUser(res.data.user)).catch(() => localStorage.removeItem('tms_token')).finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await loginAPI({ email, password });
    localStorage.setItem('tms_token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('tms_token');
    setUser(null);
  };

  const isSuperAdmin = () => user?.role?.name === 'SuperAdmin';
  const isUser       = () => user?.role?.name === 'User';
  const isStaff      = () => ['Networking Staff','Plumber','Electrician','Software Developer'].includes(user?.role?.name);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isSuperAdmin, isUser, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
