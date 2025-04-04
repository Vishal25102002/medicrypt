import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    receiveUpdates: false,
    userType: 'patient' // 'patient', 'provider', or 'doctor'
  });

  const [walletConnection, setWalletConnection] = useState({
    connected: false,
    address: '',
    error: null,
    connecting: false,
    isRegistered: false,
    signature: null,
    message: null
  });

  useEffect(() => {
    // Force the body and html to be full width
    document.documentElement.style.width = '100%';
    document.body.style.width = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflowX = 'hidden';
    
    // Check if MetaMask is already connected
    checkMetaMaskConnection();
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.style.width = '';
      document.body.style.width = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflowX = '';
    };
  }, []);

  // Check if MetaMask is installed and connected
  const checkMetaMaskConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Get existing accounts
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          // Check if this wallet is already registered
          try {
            const walletCheckResponse = await axios.get(`your-backend-url/api/wallet-check/${accounts[0]}`);
            
            setWalletConnection({
              connected: true,
              address: accounts[0],
              error: walletCheckResponse.data.isRegistered ? 'This wallet is already registered.' : null,
              connecting: false,
              isRegistered: walletCheckResponse.data.isRegistered
            });
          } catch (error) {
            // Assume wallet is not registered if we can't check
            setWalletConnection({
              connected: true,
              address: accounts[0],
              error: null,
              connecting: false,
              isRegistered: false
            });
          }
        }
      } catch (error) {
        console.error("Error checking MetaMask connection:", error);
      }
    }
  };

  // Connect to MetaMask
  const connectMetaMask = async () => {
    if (typeof window.ethereum === 'undefined') {
      setWalletConnection({
        ...walletConnection,
        error: 'MetaMask is not installed. Please install MetaMask to continue.',
        connecting: false
      });
      return;
    }

    setWalletConnection({
      ...walletConnection,
      connecting: true,
      error: null
    });

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // After connecting, try to verify the backend connection
      try {
        // Check if the wallet is already registered
        const walletCheckResponse = await axios.get(`your-backend-url/api/wallet-check/${accounts[0]}`);
        
        if (walletCheckResponse.data.isRegistered) {
          setWalletConnection({
            connected: true,
            address: accounts[0],
            error: 'This wallet is already registered. Please use another wallet or sign in.',
            connecting: false,
            isRegistered: true
          });
          return;
        }
      } catch (backendError) {
        // If it's a 404, the wallet is not registered, which is fine
        // Any other error we should still allow connection but log it
        console.warn("Error checking wallet registration:", backendError);
      }
      
      setWalletConnection({
        connected: true,
        address: accounts[0],
        error: null,
        connecting: false,
        isRegistered: false
      });
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      setWalletConnection({
        ...walletConnection,
        error: error.message || 'Failed to connect to MetaMask. Please try again.',
        connecting: false
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const nextStep = () => {
    // Always allow moving to the next step
    // (We'll handle the MetaMask connection requirement in the final submit)
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure MetaMask is connected before submitting
    if (!walletConnection.connected) {
      setWalletConnection({
        ...walletConnection,
        error: 'MetaMask connection is required to create an account.'
      });
      return;
    }
    
    setLoading(true);
    
    // Include wallet address with form data for API submission
    const submissionData = {
      ...formData,
      walletAddress: walletConnection.address
    };
    
    try {
      // Send the registration data to your backend
      const response = await axios.post('your-backend-url/api/register', submissionData);
      
      console.log("Registration successful:", response.data);
      
      // Redirect to dashboard after successful signup
      navigate('/dashboard');
    } catch (error) {
      console.error("Registration error:", error);
      // Handle error - you could set an error state and display it to the user
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Variant for staggered animation of form elements
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen w-screen max-w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex flex-col justify-center items-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <svg className="w-8 h-8 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">MediCrypt</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Create your account</h2>
          <p className="mt-2 text-gray-700">Join MediCrypt to securely manage your medical records</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 w-full max-w-md mx-auto">
          <div className="overflow-hidden h-2 rounded-full bg-gray-200">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" 
              initial={{ width: "33.33%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span className={step >= 1 ? "text-indigo-600 font-medium" : ""}>Account</span>
            <span className={step >= 2 ? "text-indigo-600 font-medium" : ""}>Profile</span>
            <span className={step >= 3 ? "text-indigo-600 font-medium" : ""}>Wallet & Preferences</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <form onSubmit={step === 3 ? handleSubmit : e => e.preventDefault()}>
              {/* Step 1: Account Information */}
              {step === 1 && (
                <motion.div
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={itemVariants} className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-900">Account Information</h3>
                    <p className="text-gray-700 mb-6">Enter your email and create a strong password</p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mb-6">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                    <p className="mt-2 text-xs text-gray-600">Must be at least 8 characters with a number and a special character</p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex justify-end">
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition shadow-md"
                    >
                      Continue
                      <svg className="inline-block ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 2: Personal Information */}
              {step === 2 && (
                <motion.div
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={itemVariants} className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-900">Personal Information</h3>
                    <p className="text-gray-700 mb-6">Tell us a bit about yourself</p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mb-6">
                    <label htmlFor="userType" className="block text-gray-700 text-sm font-medium mb-2">I am a:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div 
                        onClick={() => setFormData({...formData, userType: 'patient'})}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.userType === 'patient' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${formData.userType === 'patient' ? 'border-indigo-500' : 'border-gray-400'}`}>
                            {formData.userType === 'patient' && <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>}
                          </div>
                          <span className="font-medium">Patient</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 pl-8">Looking to store and manage my medical records</p>
                      </div>
                      <div 
                        onClick={() => setFormData({...formData, userType: 'doctor'})}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.userType === 'doctor' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${formData.userType === 'doctor' ? 'border-indigo-500' : 'border-gray-400'}`}>
                            {formData.userType === 'doctor' && <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>}
                          </div>
                          <span className="font-medium">Doctor</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 pl-8">Providing patient care and treatment</p>
                      </div>
                      <div 
                        onClick={() => setFormData({...formData, userType: 'provider'})}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.userType === 'provider' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${formData.userType === 'provider' ? 'border-indigo-500' : 'border-gray-400'}`}>
                            {formData.userType === 'provider' && <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>}
                          </div>
                          <span className="font-medium">Healthcare Provider</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 pl-8">Looking to access patient records securely</p>
                      </div>
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <motion.div variants={itemVariants}>
                      <label htmlFor="firstName" className="block text-gray-700 text-sm font-medium mb-2">First Name</label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label htmlFor="lastName" className="block text-gray-700 text-sm font-medium mb-2">Last Name</label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants} className="flex justify-between">
                    <motion.button
                      type="button"
                      onClick={prevStep}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 border-2 border-gray-300 rounded-full font-medium hover:bg-gray-50 transition"
                    >
                      <svg className="inline-block mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition shadow-md"
                    >
                      Continue
                      <svg className="inline-block ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 3: MetaMask Connection and Preferences */}
              {step === 3 && (
                <motion.div
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={itemVariants} className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-900">Connect Your Wallet</h3>
                    <p className="text-gray-700 mb-4">To store your medical records on IPFS, you need to connect your MetaMask wallet.</p>
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 mb-4">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-indigo-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="ml-2 text-sm text-indigo-700">
                          Your medical records will be securely stored on IPFS using blockchain technology. Connecting your wallet ensures only you control access to your data.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mb-6">
                    {!walletConnection.connected ? (
                      <div className="border-2 border-gray-200 rounded-lg p-6 text-center">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                          alt="MetaMask Logo" 
                          className="h-16 mx-auto mb-4" 
                        />
                        <h4 className="text-lg font-medium mb-2">Connect MetaMask</h4>
                        <p className="text-gray-600 mb-4">Secure your medical data with blockchain technology</p>
                        
                        {walletConnection.error && (
                          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                            {walletConnection.error}
                          </div>
                        )}
                        
                        <button
                          type="button"
                          onClick={connectMetaMask}
                          disabled={walletConnection.connecting}
                          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition shadow-md disabled:opacity-70"
                        >
                          {walletConnection.connecting ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Connecting...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                              </svg>
                              Connect MetaMask
                            </span>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-green-200 bg-green-50 rounded-lg p-6">
                        <div className="flex items-center justify-center mb-4">
                          <svg className="w-6 h-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <h4 className="text-lg font-medium text-green-800">MetaMask Connected</h4>
                        </div>
                        <p className="text-center text-gray-700 mb-2">Wallet Address:</p>
                        <p className="text-center font-mono text-sm bg-white p-2 rounded border border-gray-200 mb-4 overflow-x-auto">
                          {walletConnection.address}
                        </p>
                        <p className="text-center text-green-700 text-sm">
                          Your medical records will be securely linked to this wallet
                        </p>
                      </div>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants} className="mb-6">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition"
                        required
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
                      </span>
                    </label>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mb-8">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="receiveUpdates"
                        checked={formData.receiveUpdates}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        I want to receive updates about new features, product improvements, and healthcare insights
                      </span>
                    </label>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex justify-between">
                    <motion.button
                      type="button"
                      onClick={prevStep}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 border-2 border-gray-300 rounded-full font-medium hover:bg-gray-50 transition"
                    >
                      <svg className="inline-block mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition shadow-md ${(loading || !walletConnection.connected || !formData.agreeTerms) ? 'opacity-70 cursor-not-allowed' : ''}`}
                      disabled={loading || !walletConnection.connected || !formData.agreeTerms}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Account...
                        </span>
                      ) : (
                        <>
                          Create Account
                          <svg className="inline-block ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </form>
          </div>

          <div className="px-8 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-gray-200">
            <p className="text-sm text-gray-700 text-center">
              Already have an account? 
              <Link to="/login" className="ml-1 text-indigo-600 hover:text-indigo-800 transition">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 text-center text-xs text-gray-600"
      >
        <p>&copy; {new Date().getFullYear()} MediCrypt. All rights reserved.</p>
        <p>Secure. Private. Blockchain-powered medical records.</p>
      </motion.div>
    </div>
  );
};

export default SignupPage;