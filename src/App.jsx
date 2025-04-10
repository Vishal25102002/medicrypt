import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/Home';
import LoginPage from './components/Login';
import SignupPage from './components/Signup';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { getMetaMaskAccount, connectMetaMask } from './utils/MetaMask';

// Authentication Check HOC
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-indigo-200"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-indigo-600 text-sm font-medium">Loading</div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Role-Specific Route
const RoleRoute = ({ allowedRole, children }) => {
  const { userType, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-indigo-200"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-indigo-600 text-sm font-medium">Loading</div>
        </div>
      </div>
    );
  }
  
  if (userType !== allowedRole) {
    return <Navigate to={`/${userType}`} />;
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

function AppContent() {
  const { 
    userType, 
    walletConnected, 
    walletAddress, 
    setWalletConnected, 
    setWalletAddress 
  } = useAuth();
  
  const [isDarkMode, setIsDarkMode] = useState(false);

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
  }, [setWalletConnected, setWalletAddress]);

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
              walletAddress={walletAddress}
            />
          } 
        />
        <Route 
          path="/signup" 
          element={
            <SignupPage 
              walletConnected={walletConnected}
              walletAddress={walletAddress}
            />
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard 
                userType={userType} 
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
        
        {/* Role-Specific Dashboard Routes */}
        <Route 
          path="/patient" 
          element={
            <ProtectedRoute>
              <RoleRoute allowedRole="patient">
                <Dashboard 
                  userType="patient" 
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                  walletConnected={walletConnected}
                  walletAddress={walletAddress}
                  handleConnectWallet={handleConnectWallet}
                  handleDisconnectWallet={handleDisconnectWallet}
                />
              </RoleRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor" 
          element={
            <ProtectedRoute>
              <RoleRoute allowedRole="doctor">
                <Dashboard 
                  userType="doctor" 
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                  walletConnected={walletConnected}
                  walletAddress={walletAddress}
                  handleConnectWallet={handleConnectWallet}
                  handleDisconnectWallet={handleDisconnectWallet}
                />
              </RoleRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/researcher" 
          element={
            <ProtectedRoute>
              <RoleRoute allowedRole="researcher">
                <Dashboard 
                  userType="researcher" 
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                  walletConnected={walletConnected}
                  walletAddress={walletAddress}
                  handleConnectWallet={handleConnectWallet}
                  handleDisconnectWallet={handleDisconnectWallet}
                />
              </RoleRoute>
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;