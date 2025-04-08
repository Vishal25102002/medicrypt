import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.style.width = '100%';
    document.body.style.width = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflowX = 'hidden';
    return () => {
      document.documentElement.style.width = '';
      document.body.style.width = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflowX = '';
    };
  }, []);

  const connectMetaMask = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed. Please install it to continue.');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setWalletConnected(true);
        setWalletAddress(accounts[0]);
      }
    } catch (err) {
      console.error("MetaMask connection error:", err);
      alert('Failed to connect MetaMask. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!walletConnected) {
      alert('Please connect your MetaMask wallet to sign in.');
      return;
    }
    setLoading(true);
    // Instead of password validation, send the email and wallet address to your backend 
    // to retrieve the user role and proper dashboard route.
    setTimeout(() => {
      // Dummy logic for demonstration. Replace with your API call.
      if (email && walletAddress) {
        localStorage.setItem('isAuthenticated', 'true');
        // Assume backend returns userType based on email/wallet mapping
        const userType = email.includes('doctor') ? 'doctor' : email.includes('researcher') ? 'researcher' : 'patient';
        localStorage.setItem('userType', userType);
        switch(userType) {
          case 'patient': navigate('/patient'); break;
          case 'doctor': navigate('/doctor'); break;
          case 'researcher': navigate('/researcher'); break;
          default: navigate('/dashboard');
        }
      } else {
        alert('Invalid email or wallet not connected.');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-screen max-w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex flex-col justify-center items-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <svg className="w-8 h-8 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">MediCrypt</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Welcome Back</h2>
          <p className="mt-2 text-gray-700">Sign in using your MetaMask wallet</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@medicrypt.com"
                  className="w-full p-3 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div className="mb-6">
                {!walletConnected ? (
                  <button
                    type="button"
                    onClick={connectMetaMask}
                    className="w-full py-3 px-4 rounded-full font-medium text-white bg-orange-500 hover:bg-orange-600 transition shadow-md"
                  >
                    Connect MetaMask
                  </button>
                ) : (
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" />
                    </svg>
                    <span className="text-sm text-green-600">MetaMask Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                  </div>
                )}
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-4 rounded-full font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </motion.button>
            </form>
          </div>
          <div className="px-8 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-700">
              Don't have an account?
            </p>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
              >
                Create account
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
