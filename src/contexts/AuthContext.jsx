// AuthContext.js - Context for auth state management
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { getMetaMaskAccount, addAccountChangedListener } from '../utils/MetaMask';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('patient');
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);

  // Check authentication on load
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          // Get user profile from API
          const user = await authService.getProfile();
          setCurrentUser(user);
          setUserType(user.userType || localStorage.getItem('userType') || 'patient');
          setIsAuthenticated(true);
          
          // Check if wallet is connected
          const account = await getMetaMaskAccount();
          if (account) {
            setWalletAddress(account);
            setWalletConnected(true);
          }
        } catch (error) {
          console.error('Error checking authentication:', error);
          localStorage.removeItem('auth_token');
          setIsAuthenticated(false);
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
    
    // Listen for MetaMask account changes
    addAccountChangedListener((accounts) => {
      if (accounts.length === 0) {
        // User disconnected wallet
        setWalletConnected(false);
        setWalletAddress('');
      } else {
        // User switched accounts
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
      }
    });
  }, []);

  // Login function
  const login = async (walletAddress, signature) => {
    setLoading(true);
    try {
      const response = await authService.login(walletAddress, signature);
      
      // Store auth token
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('userType', response.userType);
      
      setCurrentUser(response.user);
      setUserType(response.userType);
      setIsAuthenticated(true);
      setWalletAddress(walletAddress);
      setWalletConnected(true);
      
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      
      // Store auth token
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('userType', response.userType);
      
      setCurrentUser(response.user);
      setUserType(response.userType);
      setIsAuthenticated(true);
      setWalletAddress(userData.walletAddress);
      setWalletConnected(true);
      
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setUserType('patient');
    setIsAuthenticated(false);
    setWalletConnected(false);
    setWalletAddress('');
  };

  // Switch user type (for demo)
  const switchUserType = (newType) => {
    setUserType(newType);
    localStorage.setItem('userType', newType);
  };

  // Context value
  const value = {
    currentUser,
    isAuthenticated,
    userType,
    loading,
    walletAddress,
    walletConnected,
    login,
    register,
    logout,
    switchUserType,
    setWalletAddress,
    setWalletConnected
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};