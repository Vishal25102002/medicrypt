import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { connectMetaMask, getMetaMaskAccount, signMessage } from '../utils/MetaMask';

const SignupPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, userType } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    agreeTerms: false,
    receiveUpdates: false,
    userType: 'patient', // Options: 'patient', 'doctor', or 'researcher'
  });

  const [walletConnection, setWalletConnection] = useState({
    connected: false,
    address: '',
    error: null,
    connecting: false,
    isRegistered: false,
  });

  // Helper function to truncate wallet address for display
  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Animation Variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  // Define roles options
  const roles = [
    {
      type: 'patient',
      label: 'Patient',
      description: 'Manage your own records',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      type: 'doctor',
      label: 'Doctor',
      description: 'Provide patient care',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5" />
        </svg>
      ),
    },
    {
      type: 'researcher',
      label: 'Researcher',
      description: 'Analyze and access medical data securely',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 20l9-5-9-5-9 5 9 5zm0-13v8" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    document.documentElement.style.width = '100%';
    document.body.style.width = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflowX = 'hidden';

    // If already authenticated, redirect immediately
    if (isAuthenticated) {
      navigate(`/${userType}`);
    }

    checkMetaMaskConnection();

    return () => {
      document.documentElement.style.width = '';
      document.body.style.width = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflowX = '';
    };
  }, [navigate, isAuthenticated, userType]);

  const checkMetaMaskConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await getMetaMaskAccount();
        if (accounts) {
          // For demo, we're not checking if wallet is registered
          setWalletConnection({
            connected: true,
            address: accounts,
            error: null,
            connecting: false,
            isRegistered: false,
          });
        }
      } catch (error) {
        console.error("Error checking MetaMask connection:", error);
      }
    }
  };

  const connectMetaMaskWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setWalletConnection({
        ...walletConnection,
        error: 'MetaMask is not installed. Please install MetaMask to continue.',
        connecting: false,
      });
      return;
    }
    setWalletConnection({
      ...walletConnection,
      connecting: true,
      error: null,
    });
    try {
      const account = await connectMetaMask();
      setWalletConnection({
        connected: true,
        address: account,
        error: null,
        connecting: false,
        isRegistered: false,
      });
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      setWalletConnection({
        ...walletConnection,
        error: error.message || 'Failed to connect to MetaMask. Please try again.',
        connecting: false,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // For demo purposes - quick signup buttons
  const handleQuickSignup = async (role) => {
    setLoading(true);
    try {
      // Create some dummy data based on role
      const dummyData = {
        firstName: role === 'patient' ? 'John' : role === 'doctor' ? 'Elizabeth' : 'Robert',
        lastName: role === 'patient' ? 'Doe' : role === 'doctor' ? 'Carter' : 'Johnson',
        email: `${role}@example.com`,
        userType: role,
        walletAddress: role === 'patient' 
          ? '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
          : role === 'doctor'
          ? '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF'
          : '0x6E0d01A76C3Cf4288372a29124A26D4353EE51BE',
        signature: 'dummy_signature_' + Date.now(),
        agreeTerms: true
      };
      
      // Register the user
      await register(dummyData);
      
      // Navigate to the role-specific dashboard
      navigate(`/${role}`);
    } catch (error) {
      console.error("Quick signup error:", error);
      setWalletConnection({
        ...walletConnection,
        error: error.message || 'Quick signup failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!walletConnection.connected) {
      setWalletConnection({
        ...walletConnection,
        error: 'MetaMask connection is required to create an account.',
      });
      return;
    }
    if (!formData.agreeTerms) {
      setWalletConnection({
        ...walletConnection,
        error: 'You must agree to the terms and conditions to continue.',
      });
      return;
    }
    setLoading(true);
    try {
      // Sign a message to verify wallet ownership
      const message = `Sign this message to create your MediCrypt account: ${Date.now()}`;
      const signature = await signMessage(walletConnection.address, message);
      const submissionData = {
        ...formData,
        walletAddress: walletConnection.address,
        signature: signature,
      };
      
      // Register the user
      await register(submissionData);
      
      // Redirect to the dashboard matching the selected role
      navigate(`/${formData.userType}`);
    } catch (error) {
      console.error("Registration error:", error);
      setWalletConnection({
        ...walletConnection,
        error: error.message || 'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen max-w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex flex-col justify-center items-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(40px)',
            }}
            animate={{
              x: [0, Math.random() * 60 - 30],
              y: [0, Math.random() * 60 - 30],
              opacity: [0.3, 0.6, 0.3],
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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <motion.svg
              className="w-8 h-8 text-indigo-600"
              viewBox="0 0 24 24"
              fill="currentColor"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.7 }}
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </motion.svg>
            <motion.span
              className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
              whileHover={{ letterSpacing: "0.05em" }}
              transition={{ duration: 0.3 }}
            >
              MediCrypt
            </motion.span>
          </Link>
          <motion.h2
            className="mt-6 text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Create Your Account
          </motion.h2>
          <motion.p
            className="mt-2 text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Join MediCrypt to securely manage your medical records
          </motion.p>
        </div>

        {/* Demo: Quick Signup Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8 bg-white rounded-xl shadow-md p-4 max-w-md mx-auto"
        >
          <h3 className="text-center font-medium mb-3 text-gray-700">For Demo: Quick Signup</h3>
          <div className="grid grid-cols-3 gap-2">
            <motion.button
              whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickSignup('patient')}
              disabled={loading}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all"
            >
              Patient
            </motion.button>
            <motion.button
              whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickSignup('doctor')}
              disabled={loading}
              className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all"
            >
              Doctor
            </motion.button>
            <motion.button
              whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickSignup('researcher')}
              disabled={loading}
              className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all"
            >
              Researcher
            </motion.button>
          </div>
          <div className="mt-3 text-center text-xs text-gray-500">
            Select a role for instant access to the corresponding dashboard
          </div>
        </motion.div>

        <div className="mb-8 w-full max-w-md mx-auto">
          {/* Progress Indicator */}
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((stepNumber) => (
              <motion.div
                key={stepNumber}
                className={`flex flex-col items-center ${stepNumber <= step ? 'text-indigo-600' : 'text-gray-400'}`}
                animate={stepNumber === step ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={{ duration: 1, repeat: stepNumber === step ? Infinity : 0, repeatType: "reverse" }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 
                    ${stepNumber < step
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : stepNumber === step
                        ? 'bg-white border-2 border-indigo-600 text-indigo-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                >
                  {stepNumber < step ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                <span className={`text-xs ${stepNumber <= step ? 'font-medium' : ''}`}>
                  {stepNumber === 1 ? 'Basic Info' : stepNumber === 2 ? 'Role Selection' : 'Wallet'}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="relative h-2 rounded-full bg-gray-200 overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
              initial={{ width: "33.33%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100"
          style={{ boxShadow: '0 10px 40px -10px rgba(79, 70, 229, 0.2)' }}
        >
          <div className="p-8">
            <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -100 }}
                  >
                    <motion.div variants={itemVariants} className="mb-6">
                      <h3 className="text-xl font-semibold mb-4 text-indigo-900">Basic Information</h3>
                      <p className="text-gray-700 mb-6">Enter your name and email address</p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label htmlFor="firstName" className="block text-gray-700 text-sm font-medium mb-2">
                          First Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="John"
                            className="w-full pl-10 p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-gray-700 text-sm font-medium mb-2">
                          Last Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Doe"
                            className="w-full pl-10 p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                          />
                        </div>
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="mb-6">
                      <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className="w-full pl-10 p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="mb-6">
                      <div className="flex items-center">
                        <input
                          id="agreeTerms"
                          name="agreeTerms"
                          type="checkbox"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 form-checkbox focus:ring-indigo-500 border-gray-300 rounded"
                          required
                        />
                        <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                          I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-800">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-800">Privacy Policy</a>
                        </label>
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="mb-6">
                      <div className="flex items-center">
                        <input
                          id="receiveUpdates"
                          name="receiveUpdates"
                          type="checkbox"
                          checked={formData.receiveUpdates}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 form-checkbox focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="receiveUpdates" className="ml-2 block text-sm text-gray-700">
                          I would like to receive updates and notifications about my health records
                        </label>
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="flex justify-end">
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(79,70,229,0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition flex items-center"
                      >
                        Continue
                        <motion.svg 
                          className="ml-2 w-5 h-5" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          initial={{ x: 0 }}
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </motion.svg>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -100 }}
                  >
                    <motion.div variants={itemVariants} className="mb-6">
                      <h3 className="text-xl font-semibold mb-4 text-indigo-900">Role Selection</h3>
                      <p className="text-gray-700 mb-6">Choose your role to customize your dashboard experience</p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="mb-6">
                      <label htmlFor="userType" className="block text-gray-700 text-sm font-medium mb-2">
                        I am a:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {roles.map((item) => (
                          <motion.div
                            key={item.type}
                            onClick={() => setFormData({ ...formData, userType: item.type })}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                              formData.userType === item.type
                                ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(79,70,229,0.2)" }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex flex-col items-center text-center">
                              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                                formData.userType === item.type
                                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                  : 'bg-gray-100 text-gray-500'
                              }`}>
                                {item.icon}
                              </div>
                              <span className="font-medium text-lg">{item.label}</span>
                              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                              {formData.userType === item.type && (
                                <motion.div
                                  className="mt-3 bg-indigo-600 text-white rounded-full px-3 py-1 text-xs flex items-center"
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                >
                                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Selected
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="flex justify-between">
                      <motion.button
                        type="button"
                        onClick={prevStep}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 border-2 border-gray-300 rounded-full font-medium hover:bg-gray-50 transition flex items-center"
                      >
                        <svg className="mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(79,70,229,0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition shadow-md flex items-center"
                      >
                        Continue
                        <motion.svg
                          className="ml-2 w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          initial={{ x: 0 }}
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </motion.svg>
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
  
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      variants={formVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, x: -100 }}
                    >
                      <motion.div variants={itemVariants} className="mb-6">
                        <h3 className="text-xl font-semibold mb-4 text-indigo-900">Connect Your Wallet</h3>
                        <p className="text-gray-700 mb-4">
                          To securely store your records and link your profile to the blockchain medical record system,
                          please connect your MetaMask wallet.
                        </p>
                        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 mb-4">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-indigo-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3h-1z" clipRule="evenodd" />
                            </svg>
                            <p className="ml-2 text-sm text-indigo-700">
                              Ensure your MetaMask wallet is installed, unlocked, and not already registered.
                            </p>
                          </div>
                        </div>
                        {walletConnection.error && (
                          <div className="mb-4 text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-100">
                            {walletConnection.error}
                          </div>
                        )}
                        <motion.button
                          type="button"
                          onClick={connectMetaMaskWallet}
                          whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(237,137,54,0.4)" }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full px-6 py-3 mb-4 ${walletConnection.connecting ? 'bg-gray-400' : 'bg-gradient-to-r from-orange-500 to-yellow-500'} text-white rounded-full font-medium hover:opacity-90 transition shadow-md flex items-center justify-center`}
                          disabled={walletConnection.connecting || walletConnection.connected}
                        >
                          {walletConnection.connecting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                              />
                              <span>Connecting...</span>
                            </>
                          ) : walletConnection.connected ? (
                            <>
                              <svg className="w-5 h-5 mr-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span>Connected with MetaMask</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.44 4.02H4.56A2.56 2.56 0 002 6.58v10.84A2.56 2.56 0 004.56 20h14.88A2.56 2.56 0 0022 17.42V6.58a2.56 2.56 0 00-2.56-2.56zM10.9 13.68H7.07v1.93h2.51v1.25H7.07v1.97h3.83v1.28H5.72V12.4h5.18v1.28zm1.86 5.15h-1.35V12.4h1.35v6.43zm6.72 0h-5.18v-1.28h3.83v-1.97h-2.51v-1.25h2.51v-1.93h-3.83V12.4h5.18v6.43z" />
                              </svg>
                              Connect MetaMask
                            </>
                          )}
                        </motion.button>
                        {walletConnection.connected && !walletConnection.error && (
                          <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-100 mb-4">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-green-700 text-sm font-medium">
                              Wallet Connected: {truncateAddress(walletConnection.address)}
                            </span>
                          </div>
                        )}
                      </motion.div>
                      <motion.div variants={itemVariants} className="flex justify-between">
                        <motion.button
                          type="button"
                          onClick={prevStep}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-6 py-3 border-2 border-gray-300 rounded-full font-medium hover:bg-gray-50 transition flex items-center"
                        >
                          <svg className="mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Back
                        </motion.button>
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(79,70,229,0.4)" }}
                          whileTap={{ scale: 0.98 }}
                          className={`px-6 py-3 ${loading || !walletConnection.connected ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} text-white rounded-full font-medium hover:opacity-90 transition shadow-md flex items-center`}
                          disabled={loading || !walletConnection.connected}
                        >
                          {loading ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                              />
                              <span>Creating Account...</span>
                            </>
                          ) : (
                            <span>Create Account</span>
                          )}
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  };
  
  export default SignupPage;