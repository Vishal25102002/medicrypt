import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { connectMetaMask, signMessage } from '../utils/MetaMask';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, userType } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [walletConnection, setWalletConnection] = useState({
    connected: false,
    address: '',
    error: null,
    connecting: false
  });

  useEffect(() => {
    document.documentElement.style.width = '100%';
    document.body.style.width = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflowX = 'hidden';
    
    // Check if user is already authenticated
    if (isAuthenticated) {
      navigate(`/${userType}`);
    }
    
    return () => {
      document.documentElement.style.width = '';
      document.body.style.width = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflowX = '';
    };
  }, [navigate, isAuthenticated, userType]);

  const handleMetaMaskConnect = async () => {
    if (loading) return;
    
    setError(null);
    setWalletConnection({
      ...walletConnection,
      connecting: true,
      error: null
    });
    
    try {
      const account = await connectMetaMask();
      
      // For demo, we'll assume the wallet is registered
      setWalletConnection({
        connected: true,
        address: account,
        connecting: false,
        error: null
      });
    } catch (err) {
      console.error("MetaMask connection error:", err);
      setWalletConnection({
        ...walletConnection,
        connecting: false,
        error: err.message || 'Failed to connect MetaMask. Please try again.'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!walletConnection.connected) {
      setError('Please connect your MetaMask wallet to sign in.');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Sign a message to verify wallet ownership
      const message = `Sign this message to authenticate with MediCrypt: ${Date.now()}`;
      const signature = await signMessage(walletConnection.address, message);
      
      // Login with wallet address and signature
      await login(walletConnection.address, signature);
      
      // Navigate to the appropriate dashboard
      navigate(`/${userType}`);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || 'Login failed. Please check your wallet and try again.');
      setLoading(false);
    }
  };

  // For demo purposes - quick login buttons
  const handleQuickLogin = async (role) => {
    setLoading(true);
    setError(null);
    
    let dummyAddress = '';
    
    // Use different addresses based on role
    if (role === 'patient') {
      dummyAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
    } else if (role === 'doctor') {
      dummyAddress = '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF';
    } else if (role === 'researcher') {
      dummyAddress = '0x6E0d01A76C3Cf4288372a29124A26D4353EE51BE';
    }
    
    try {
      // Skip signature for demo
      const dummySignature = 'dummy_signature_' + Date.now();
      
      // Login with wallet address and signature
      await login(dummyAddress, dummySignature);
      
      // Navigate to the appropriate dashboard
      navigate(`/${role}`);
    } catch (err) {
      console.error("Quick login error:", err);
      setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const floatingAnimation = {
    y: ["-5px", "5px"],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };
  
  // Function to truncate wallet address for display
  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen w-screen max-w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex flex-col justify-center items-center p-4 md:p-8 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-indigo-300/20 to-purple-300/20"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, Math.random() * 0.5 + 0.8],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <motion.div animate={floatingAnimation}>
              <svg className="w-10 h-10 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </motion.div>
            <motion.span 
              className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "linear" 
              }}
              style={{ backgroundSize: "200% auto" }}
            >
              MediCrypt
            </motion.span>
          </Link>
          <motion.h2 
            variants={itemVariants}
            className="mt-6 text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
          >
            Welcome Back
          </motion.h2>
          <motion.p variants={itemVariants} className="mt-2 text-gray-700">
            Sign in using your MetaMask wallet
          </motion.p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-indigo-100"
        >
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <motion.div 
                className="flex flex-col items-center justify-center mb-8"
                variants={itemVariants}
              >
                <motion.div 
                  className="w-24 h-24 mb-6 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <svg className="w-12 h-12 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </motion.div>
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
                
                {!walletConnection.connected ? (
                  <motion.button
                    type="button"
                    onClick={handleMetaMaskConnect}
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(237, 137, 54, 0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 px-6 rounded-full font-medium text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition shadow-md flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.44 4.02H4.56A2.56 2.56 0 002 6.58v10.84A2.56 2.56 0 004.56 20h14.88A2.56 2.56 0 0022 17.42V6.58a2.56 2.56 0 00-2.56-2.56zM10.9 13.68H7.07v1.93h2.51v1.25H7.07v1.97h3.83v1.28H5.72V12.4h5.18v1.28zm1.86 5.15h-1.35V12.4h1.35v6.43zm6.72 0h-5.18v-1.28h3.83v-1.97h-2.51v-1.25h2.51v-1.93h-3.83V12.4h5.18v6.43z" />
                        </svg>
                        Connect MetaMask
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="flex flex-col items-center space-y-3 w-full"
                  >
                    <div className="flex items-center space-x-3 bg-green-50 p-3 rounded-full w-full">
                      <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" />
                      </svg>
                      <span className="text-sm text-green-600 font-medium">
                        MetaMask Connected
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                      {walletConnection.address.slice(0, 6)}...{walletConnection.address.slice(-4)}
                    </div>
                  </motion.div>
                )}
              </motion.div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)" }}
                whileTap={{ scale: 0.97 }}
                variants={itemVariants}
                className={`w-full py-4 px-6 rounded-full font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading || !walletConnection.connected}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <span>Sign in with Wallet</span>
                )}
              </motion.button>
            </form>
          </div>
          
          {/* Demo: Quick Login Buttons */}
          <motion.div
            variants={itemVariants}
            className="px-8 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-t border-gray-200"
          >
            <p className="text-sm font-medium text-gray-700 mb-2">For Demo: Quick Login</p>
            <div className="grid grid-cols-3 gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickLogin('patient')}
                className="px-2 py-2 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Patient Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickLogin('doctor')}
                className="px-2 py-2 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Doctor Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickLogin('researcher')}
                className="px-2 py-2 text-xs font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Researcher Login
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="px-8 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-gray-200 flex justify-between items-center"
          >
            <p className="text-sm text-gray-700">Don't have an account?</p>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05, x: 3 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1"
              >
                Create account
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;