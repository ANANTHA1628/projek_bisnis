import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:8000/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('posa_token');
    const savedUser = localStorage.getItem('posa_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const apiFetch = useCallback(async (url, options = {}) => {
    const currentToken = token || localStorage.getItem('posa_token');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(currentToken ? { 'Authorization': `Bearer ${currentToken}` } : {}),
      ...options.headers,
    };
    const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.message || data.errors?.email?.[0] || data.errors?.password?.[0] || 'Terjadi kesalahan';
      throw new Error(msg);
    }
    return data;
  }, [token]);

  const login = async (email, password, pin = '') => {
    const body = { email };
    if (password) body.password = password;
    if (pin) body.pin = pin;

    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('posa_token', data.token);
      localStorage.setItem('posa_user', JSON.stringify(data.user));
    }
    return data;
  };

  const register = async (name, email, password, role, pin = '') => {
    const body = { name, email, password, role };
    if (pin) body.pin = pin;

    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('posa_token', data.token);
      localStorage.setItem('posa_user', JSON.stringify(data.user));
    }
    return data;
  };

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // ignore network errors on logout
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('posa_token');
    localStorage.removeItem('posa_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    isOwner: user?.role === 'owner',
    isKaryawan: user?.role === 'karyawan',
    canViewLaporan: user?.role === 'admin' || user?.role === 'owner',
    canViewAbsensiAll: user?.role === 'admin' || user?.role === 'owner',
    login,
    register,
    logout,
    apiFetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
