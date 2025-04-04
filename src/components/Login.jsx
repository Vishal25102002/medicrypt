import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Force the body and html to be full width
    document.documentElement.style.width = '100%';
    document.body.style.width = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflowX = 'hidden';
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.style.width = '';
      document.body.style.width = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflowX = '';
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Predefined user credentials with their respective dashboard types
    const userCredentials = {
      'patient@medicrypt.com': { 
        password: 'patient', 
        userType: 'patient',
        firstName: 'Emily',
        lastName: 'Johnson'
      },
      'doctor@medicrypt.com': { 
        password: 'doctor', 
        userType: 'doctor',
        firstName: 'Dr. Sarah',
        lastName: 'Williams'
      },
      'researcher@medicrypt.com': { 
        password: 'researcher', 
        userType: 'researcher',
        firstName: 'Dr. Michael',
        lastName: 'Chen'
      }
    };

    // Simulate API call with timeout
    setTimeout(() => {
      const userInfo = userCredentials[formData.email];
      
      if (userInfo && userInfo.password === formData.password) {
        // Set authentication state
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', userInfo.userType);
        localStorage.setItem('firstName', userInfo.firstName);
        localStorage.setItem('lastName', userInfo.lastName);
        
        // Redirect to appropriate dashboard
        switch(userInfo.userType) {
          case 'patient':
            navigate('/patient');
            break;
          case 'doctor':
            navigate('/doctor');
            break;
          case 'researcher':
            navigate('/researcher');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        // Invalid credentials
        alert('Invalid email or password. Try:\n- patient@medicrypt.com/patient\n- doctor@medicrypt.com/doctor\n- researcher@medicrypt.com/researcher');
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
          <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Welcome back</h2>
          <p className="mt-2 text-gray-700">Please sign in to your account</p>
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
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@medicrypt.com"
                    className="pl-10 w-full p-3 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-gray-700 text-sm font-medium">Password</label>
                  <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800 transition font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10 w-full p-3 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg 
                      className="h-5 w-5 text-indigo-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember me</span>
                </label>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-4 rounded-full font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign in'}
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

        {/* Alternative Login Options */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6"
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 text-gray-600">
                Test Account Logins
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setFormData({
                  ...formData,
                  email: 'patient@medicrypt.com',
                  password: 'patient'
                });
              }}
              className="w-full flex justify-center items-center py-3 px-4 border-2 border-blue-300 rounded-full shadow-sm bg-blue-50 text-sm font-medium text-blue-700 hover:bg-blue-100 transition"
            >
              Patient Login
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setFormData({
                  ...formData,
                  email: 'doctor@medicrypt.com',
                  password: 'doctor'
                });
              }}
              className="w-full flex justify-center items-center py-3 px-4 border-2 border-green-300 rounded-full shadow-sm bg-green-50 text-sm font-medium text-green-700 hover:bg-green-100 transition"
            >
              Doctor Login
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setFormData({
                  ...formData,
                  email: 'researcher@medicrypt.com',
                  password: 'researcher'
                });
              }}
              className="w-full flex justify-center items-center py-3 px-4 border-2 border-purple-300 rounded-full shadow-sm bg-purple-50 text-sm font-medium text-purple-700 hover:bg-purple-100 transition"
            >
              Researcher Login
            </motion.button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center text-sm text-gray-600"
        >
          <p className="mb-2">By signing in, you agree to our</p>
          <div className="space-x-2">
            <a href="#" className="text-indigo-600 hover:text-indigo-800 transition">Privacy Policy</a>
            <span>and</span>
            <a href="#" className="text-indigo-600 hover:text-indigo-800 transition">Terms of Service</a>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6"
        >
          <Link to="/" className="flex items-center text-sm text-gray-700 hover:text-indigo-600 transition">
            <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;