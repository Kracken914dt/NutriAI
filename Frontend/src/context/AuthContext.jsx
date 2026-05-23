import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('nutriai_token') || null);
  const [loading, setLoading] = useState(true);

  // Configure axios authorization header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('nutriai_token', token);
      
      // Fetch user profile on load or token change
      axios.get(`${API_URL}/user/profile`)
        .then(res => {
          setUser(res.data);
        })
        .catch(err => {
          console.error('Failed to load profile:', err.response?.data?.error || err.message);
          // Token expired or invalid
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('nutriai_token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Error al iniciar sesión. Inténtalo de nuevo.');
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Error al registrarse. Inténtalo de nuevo.');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('nutriai_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (updatedData) => {
    try {
      const res = await axios.put(`${API_URL}/user/profile`, updatedData);
      setUser(res.data);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Error al actualizar el perfil.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
