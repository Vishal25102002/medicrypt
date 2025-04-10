import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/Home';
import LoginPage from './components/Login';
import SignupPage from './components/Signup';
import Dashboard from './components/Dashboard';
import { connectMetaMask, getMetaMaskAccount } from './utils/MetaMask';

// Authentication Check
const isAuthenticated = () => {
  return localStorage.getItem('auth_token') !== null;
};

// Get User Type
const getUserType = () => {
  return localStorage.getItem('userType') || 'patient';
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

// 404 Not Found page
const NotFound = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-4">
    <div className="text-center">
      <h1 className="text-9xl font-bold text-blue-600">404</h1>
      <h2 className="text-3xl font-semibold mt-4 mb-6">Page Not Found</h2>
      <p className="text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <a 
        href="/" 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-md"
      >
        Go Back Home
      </a>
    </div>
  </div>
);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    // Check if user has dark mode preference saved
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    
    // Check if wallet is already connected
    const checkWalletConnection = async () => {
      try {
        const account = await getMetaMaskAccount();
        if (account) {
          setWalletConnected(true);
          setWalletAddress(account);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };
    
    checkWalletConnection();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const handleConnectWallet = async () => {
    try {
      const account = await connectMetaMask();
      setWalletConnected(true);
      setWalletAddress(account);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleDisconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
    // Note: This doesn't actually disconnect MetaMask as there's no direct API for that
    // It just clears our app's state
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/login" 
          element={
            <LoginPage 
              walletConnected={walletConnected}
              setWalletConnected={setWalletConnected}
              walletAddress={walletAddress}
              setWalletAddress={setWalletAddress}
            />
          } 
        />
        <Route 
          path="/signup" 
          element={
            <SignupPage 
              walletConnected={walletConnected}
              setWalletConnected={setWalletConnected}
              walletAddress={walletAddress}
              setWalletAddress={setWalletAddress}
            />
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard 
                userType={getUserType()} 
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                walletConnected={walletConnected}
                walletAddress={walletAddress}
                handleConnectWallet={handleConnectWallet}
                handleDisconnectWallet={handleDisconnectWallet}
              />
            </ProtectedRoute>
          } 
        />
        
        {/* Specific Dashboard Routes */}
        <Route 
          path="/patient" 
          element={
            <ProtectedRoute>
              <Dashboard 
                userType="patient" 
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                walletConnected={walletConnected}
                walletAddress={walletAddress}
                handleConnectWallet={handleConnectWallet}
                handleDisconnectWallet={handleDisconnectWallet}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor" 
          element={
            <ProtectedRoute>
              <Dashboard 
                userType="doctor" 
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                walletConnected={walletConnected}
                walletAddress={walletAddress}
                handleConnectWallet={handleConnectWallet}
                handleDisconnectWallet={handleDisconnectWallet}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/researcher" 
          element={
            <ProtectedRoute>
              <Dashboard 
                userType="researcher" 
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                walletConnected={walletConnected}
                walletAddress={walletAddress}
                handleConnectWallet={handleConnectWallet}
                handleDisconnectWallet={handleDisconnectWallet}
              />
            </ProtectedRoute>
          } 
        />
        
        {/* Additional Protected Routes */}
        <Route 
          path="/records" 
          element={
            <ProtectedRoute>
              <Dashboard 
                initialView="records" 
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                walletConnected={walletConnected}
                walletAddress={walletAddress}
                handleConnectWallet={handleConnectWallet}
                handleDisconnectWallet={handleDisconnectWallet}
              />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/messages" 
          element={
            <ProtectedRoute>
              <Dashboard 
                initialView="messages" 
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                walletConnected={walletConnected}
                walletAddress={walletAddress}
                handleConnectWallet={handleConnectWallet}
                handleDisconnectWallet={handleDisconnectWallet}
              />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Dashboard 
                initialView="settings" 
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                walletConnected={walletConnected}
                walletAddress={walletAddress}
                handleConnectWallet={handleConnectWallet}
                handleDisconnectWallet={handleDisconnectWallet}
              />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 Not Found page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;