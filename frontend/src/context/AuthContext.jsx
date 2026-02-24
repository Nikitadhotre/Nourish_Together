import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const res = await authAPI.getMe();
      setUser(res.data);
      // Also save user data to localStorage for offline access
      // Backend returns "id" not "_id"
      localStorage.setItem('userId', res.data.id || res.data._id);
      localStorage.setItem('userName', res.data.name);
      localStorage.setItem('userEmail', res.data.email);
      localStorage.setItem('userRole', res.data.role);
    } catch (error) {
      // Try to load from localStorage as fallback
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');
      const userEmail = localStorage.getItem('userEmail');
      const userRole = localStorage.getItem('userRole');
      
      if (userId && userName) {
        // Restore basic user data from localStorage
        setUser({
          _id: userId,
          id: userId,
          name: userName,
          email: userEmail,
          role: userRole,
        });
      } else {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const res = await authAPI.login(credentials);
    const { token, data: userData } = res.data;
    localStorage.setItem('token', token);
    // Backend returns "id" not "_id", so use userData.id
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userRole', userData.role);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    const { token, data: newUser } = res.data;
    localStorage.setItem('token', token);
    // Backend returns "id" not "_id", so use newUser.id
    localStorage.setItem('userId', newUser.id);
    localStorage.setItem('userName', newUser.name);
    localStorage.setItem('userEmail', newUser.email);
    localStorage.setItem('userRole', newUser.role);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await authAPI.updateProfile(profileData);
    setUser(res.data.data);
    if (res.data.data.name) {
      localStorage.setItem('userName', res.data.data.name);
    }
    return res.data.data;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
