import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredStep, setHoveredStep] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    
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

  const faqItems = [
    {
      question: "What is MediCrypt?",
      answer: "MediCrypt is a secure platform for storing, sharing, and managing medical records using blockchain technology to ensure data integrity and privacy."
    },
    {
      question: "How does MediCrypt protect my medical data?",
      answer: "MediCrypt uses end-to-end encryption and blockchain technology to ensure your medical data can only be accessed by authorized healthcare providers and yourself."
    },
    {
      question: "Can I share my medical records with my doctors?",
      answer: "Yes, MediCrypt allows you to securely share your medical records with healthcare providers of your choice, and you can revoke access at any time."
    },
    {
      question: "Is MediCrypt compliant with healthcare regulations?",
      answer: "Yes, MediCrypt is fully compliant with HIPAA, GDPR, and other major healthcare privacy regulations worldwide."
    },
    {
      question: "How do I get started with MediCrypt?",
      answer: "Simply sign up for an account, verify your identity, and you can start uploading and managing your medical records immediately."
    }
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="w-screen max-w-full min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 text-gray-800 overflow-x-hidden">
      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
            style={{
              width: Math.random() * 100 + 20,
              height: Math.random() * 100 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 40 - 20],
              y: [0, Math.random() * 40 - 20],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Header Section */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 shadow-sm w-full border-b border-indigo-100">
        <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 flex-1"
          >
            <motion.svg 
              className="w-8 h-8 text-indigo-600" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.7 }}
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </motion.svg>
            <motion.span 
              className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600 text-transparent bg-clip-text"
              whileHover={{ letterSpacing: "0.05em" }}
              transition={{ duration: 0.3 }}
            >
              MediCrypt
            </motion.span>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className=" md:flex flex-1 justify-end items-center gap-12"
          >
            <div className="flex gap-8">
              {["Features", "How It Works", "FAQ", "Contact"].map((item, index) => (
                <motion.a 
                  key={index} 
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="font-medium text-gray-700 hover:text-indigo-600 transition relative group"
                  whileHover={{ y: -2 }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 group-hover:w-full" />
                </motion.a>
              ))}
            </div>
            <div className="flex gap-4">
              <Link to="/login">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-full font-medium hover:bg-indigo-50 transition"
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition shadow-md relative overflow-hidden group"
                >
                  <span className="relative z-10">Sign Up</span>
                  <motion.span 
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 z-0" 
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </Link>
            </div>
          </motion.nav>

          {/* Mobile Menu Button */}
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="md:hidden text-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/95 backdrop-blur-sm border-t w-full"
            >
              <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
                {["Features", "How It Works", "FAQ", "Contact"].map((item, index) => (
                  <motion.a 
                    key={index}
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="py-2 font-medium text-indigo-900 relative overflow-hidden group"
                    onClick={() => setIsMenuOpen(false)}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>{item}</span>
                    <motion.span 
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600"
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2 border-2 border-indigo-600 text-indigo-600 rounded-full font-medium hover:bg-indigo-50 transition"
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition shadow-md"
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 w-full relative overflow-hidden">
        <div className="container max-w-full mx-auto px-4 md:px-8 lg:px-16 flex flex-col md:flex-row items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2 mb-10 md:mb-0 pr-0 md:pr-8 relative z-10"
          >
            <motion.div 
              className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 font-medium text-sm mb-4"
              whileHover={{ scale: 1.05, backgroundColor: "#e0e7ff" }}
            >
              Blockchain Secured
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-transparent bg-clip-text leading-tight">
              Secure Your Medical Data with 
              <span className="block mt-1 relative">
                <span className="relative z-10">Blockchain Technology</span>
                <motion.span
                  className="absolute bottom-1 left-0 h-3 w-full bg-indigo-100 -z-10"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </span>
            </h1>
            <p className="text-lg mb-8 text-gray-700">MediCrypt provides a secure, decentralized platform for storing and sharing your medical records with healthcare providers.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <motion.button 
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 15px 30px -5px rgba(79, 70, 229, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium shadow-md hover:opacity-90 transition overflow-hidden relative"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <motion.span 
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 z-0" 
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.button>
              </Link>
              <a href="#features">
                <motion.button 
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.2)",
                    x: 5
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-full font-medium hover:bg-indigo-50 transition flex items-center group"
                >
                  <span>Learn More</span>
                  <motion.svg 
                    className="w-4 h-4 ml-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </motion.svg>
                </motion.button>
              </a>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full md:w-1/2 relative z-10"
          >
            <motion.div 
              className="relative"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl opacity-75 blur-sm"
                animate={{ 
                  rotate: [0, 1, 0, -1, 0],
                  scale: [1, 1.01, 1, 0.99, 1]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  repeatType: "mirror" 
                }}
              />
              <div className="relative bg-white p-6 rounded-3xl shadow-lg">
                <div className="aspect-video bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.svg 
                      className="w-32 h-32 text-indigo-400" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                      animate={{ 
                        scale: [1, 1.03, 1],
                        rotate: [0, 0.5, 0, -0.5, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        repeatType: "reverse" 
                      }}
                    >
                      <path d="M9 17a4.97 4.97 0 0 1-2.3-4 4.97 4.97 0 0 1 2.3-4h6a4.97 4.97 0 0 1 2.3 4 4.97 4.97 0 0 1-2.3 4H9z" />
                      <path d="M12 10.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm-6 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm12 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z" />
                    </motion.svg>
                    <motion.div 
                      className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatType: "reverse" 
                      }}
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  </motion.div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-indigo-800">Medical Records Dashboard</h3>
                    <p className="text-sm text-gray-500">Safe. Secure. Accessible.</p>
                  </div>
                  <div className="flex space-x-2">
                    {["bg-green-400", "bg-indigo-400", "bg-purple-400"].map((color, index) => (
                      <motion.span 
                        key={index} 
                        className={`h-3 w-3 ${color} rounded-full`}
                        whileHover={{ scale: 1.5 }}
                        transition={{ duration: 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="mt-6 flex justify-center">
              <motion.div 
                className="bg-white rounded-full shadow-sm px-4 py-2 flex items-center"
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.2)" }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="w-3 h-3 bg-green-400 rounded-full mr-2"
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "reverse" 
                  }}
                />
                <span className="text-sm text-gray-600">HIPAA & GDPR Compliant</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white w-full relative">
        <div className="container max-w-full mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.div 
              className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 font-medium text-sm mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Why Choose Us
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Why Choose MediCrypt?</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">Our platform combines blockchain security with user-friendly interfaces to revolutionize how medical data is stored and shared.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                title: "Uncompromised Security",
                description: "End-to-end encryption and blockchain technology ensure your medical data remains private and tamper-proof."
              },
              {
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
                title: "Instant Access",
                description: "Access your medical records anytime, anywhere, and share them instantly with healthcare providers."
              },
              {
                icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2",
                title: "Complete Control",
                description: "Manage permissions and control exactly who can access your medical information and for how long."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <motion.div 
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 h-full"
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 20px 40px -15px rgba(79, 70, 229, 0.3)",
                    scale: 1.02 
                  }}
                >
                  <motion.div 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    whileHover={{ 
                      rotate: 360,
                      transition: { duration: 0.5 }
                    }}
                  >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 text-indigo-900">{feature.title}</h3>
                  <p className="text-gray-700">{feature.description}</p>
                  
                  <motion.div 
                    className="w-full h-1 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: hoveredFeature === index ? "100%" : "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50 w-full">
        <div className="container max-w-full mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.div 
              className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 font-medium text-sm mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Simple Process
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">How MediCrypt Works</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">Our streamlined process makes it easy to secure and manage your medical records.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-indigo-200 to-purple-200 z-0" />
            
            {[
              { number: 1, title: "Create Account", desc: "Sign up and verify your identity securely." },
              { number: 2, title: "Upload Records", desc: "Easily upload your existing medical documents." },
              { number: 3, title: "Manage Access", desc: "Control who can view your medical information." },
              { number: 4, title: "Share Securely", desc: "Grant temporary access to healthcare providers." }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative"
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <motion.div 
                  className="bg-white p-6 rounded-2xl shadow-md relative z-10 h-full"
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 20px 40px -15px rgba(79, 70, 229, 0.3)",
                    scale: 1.03 
                  }}
                >
                  <motion.div 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-4"
                    whileHover={{ scale: 1.2 }}
                    animate={{ 
                      scale: hoveredStep === index ? [1, 1.1, 1] : 1,
                      transition: { 
                        duration: 1, 
                        repeat: hoveredStep === index ? Infinity : 0,
                        repeatType: "reverse"
                      }
                    }}
                  >
                    {step.number}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-900">{step.title}</h3>
                  <p className="text-gray-700">{step.desc}</p>
                  
                  <motion.div 
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-b-2xl"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredStep === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: "left" }}
                  />
                </motion.div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 right-0 z-0">
                    <motion.div 
                      className="absolute right-0 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"
                      initial={{ scale: 0.6, opacity: 0.5 }}
                      animate={{ 
                        scale: [0.6, 1, 0.6],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatType: "loop" 
                      }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white w-full">
        <div className="container max-w-full mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.div 
              className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 font-medium text-sm mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Help Center
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Frequently Asked Questions</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">Find answers to common questions about MediCrypt's services and technology.</p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="mb-4"
              >
                <motion.div 
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-md overflow-hidden cursor-pointer relative"
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 15px 30px -5px rgba(79, 70, 229, 0.2)",
                  }}
                  transition={{ duration: 0.2 }}
                  onClick={() => toggleFaq(index)}
                >
                  <div className="p-4 flex justify-between items-center">
                    <h3 className="font-medium text-indigo-900">{item.question}</h3>
                    <motion.div 
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${expandedFaq === index ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100'}`}
                      animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 border-t border-indigo-100 text-gray-700">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: expandedFaq === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: "left" }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/CTA Section */}
      <section id="contact" className="py-16 relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 -z-10"></div>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                borderRadius: "40%",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                rotate: [0, Math.random() * 360],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        <div className="container max-w-full mx-auto px-4 md:px-8 lg:px-16 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              className="inline-block px-3 py-1 rounded-full bg-white/20 text-white font-medium text-sm mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Get Started Today
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-indigo-500">Ready to Secure Your Medical Data?</h2>
            <p className="mb-8 max-w-2xl mx-auto text-indigo-400">Join thousands of patients and healthcare providers who trust MediCrypt with their sensitive medical information.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 15px 30px -5px rgba(255, 255, 255, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-3 bg-white text-indigo-600 rounded-full font-medium shadow-lg hover:bg-indigo-50 transition overflow-hidden relative"
                >
                  <motion.span 
                    className="relative z-10"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut" 
                    }}
                  >
                    Get Started for Free
                  </motion.span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-white -z-0" 
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </Link>
              <a href="#contact">
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border-2 border-white text-indigo-500 rounded-full font-medium hover:bg-white/10 transition"
                >
                  Contact Sales
                </motion.button>
              </a>
            </div>
            
            <motion.div 
              className="mt-8 flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex -space-x-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-indigo-300 to-purple-300 flex items-center justify-center"
                    whileHover={{ y: -5, zIndex: 10 }}
                  >
                    <span className="text-xs font-bold text-indigo-800">
                      {['JD', 'AK', 'BT', 'MR', 'SL'][i]}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="ml-4 text-indigo-500 text-sm">
                <span className="font-bold text-indigo-500">2,500+</span> users already trust MediCrypt
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-indigo-200 py-12 ">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex flex-wrap items-center gap-23 justify-between">
            <div>
              <div className="flex items-center  gap-2  mb-4">
                <motion.svg 
                  className="w-6 h-6 text-indigo-400" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.7 }}
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </motion.svg>
                <span className="text-xl font-bold text-white">MediCrypt</span>
              </div>
              <p className="text-sm">Revolutionizing medical data security with blockchain technology.</p>
              
              <div className="mt-4">
                <div className="flex space-x-3">
                  {[
                    "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
                    "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
                    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 7h-2v-3c0-.55-.45-1-1-1s-1 .45-1 1v3h-2v-6h2v1.1c.37-.72 1.37-1.2 2-1.2 1.1 0 2 .9 2 2v4.2z"
                  ].map((icon, index) => (
                    <motion.a 
                      key={index}
                      href="#" 
                      className="h-8 w-8 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-300 hover:text-white transition"
                      whileHover={{ y: -3, backgroundColor: "#4338ca" }}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d={icon} />
                      </svg>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
            
            {[
              {
                title: "Quick Links",
                links: [
                  { name: "Features", href: "#features" },
                  { name: "How It Works", href: "#how-it-works" },
                  { name: "FAQ", href: "#faq" },
                  { name: "Contact", href: "#contact" }
                ]
              },
              {
                title: "Legal",
                links: [
                  { name: "Privacy Policy", href: "#" },
                  { name: "Terms of Service", href: "#" },
                  { name: "Cookie Policy", href: "#" },
                  { name: "HIPAA Compliance", href: "#" }
                ]
              }
            ].map((column, colIndex) => (
              <div key={colIndex}>
                <h3 className="text-white font-medium mb-4">{column.title}</h3>
                <ul className="space-y-2 text-sm">
                  {column.links.map((link, linkIndex) => (
                    <motion.li key={linkIndex}>
                      <motion.a 
                        href={link.href} 
                        className="hover:text-white transition inline-block relative group"
                        whileHover={{ x: 3 }}
                      >
                        {link.name}
                        <motion.span 
                          className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"
                          initial={{ width: 0 }}
                          whileHover={{ width: "100%" }}
                        />
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
            
            <div>
              <h3 className="text-white font-medium mb-4">Stay Updated</h3>
              <div className="mt-2 relative">
                <input 
                  type="email" 
                  className="p-2 pr-14 rounded-full w-full bg-indigo-800 border border-indigo-700 text-white placeholder-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                  placeholder="Your email" 
                />
                <motion.button 
                  className="absolute right-0 h-full px-4 rounded-r-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
              </div>
              
              <motion.div 
                className="mt-6 p-4 rounded-lg bg-indigo-800/50 border border-indigo-700"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.2)" }}
              >
                <h4 className="text-white text-sm font-medium mb-2">Need Help?</h4>
                <p className="text-xs text-indigo-300 mb-3">We're here to assist you with any questions.</p>
                <a href="#contact">
                  <motion.button 
                    className="text-xs py-1.5 px-3 bg-indigo-700 text-indigo-500 rounded-full hover:bg-indigo-600 transition w-full"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Contact Support
                  </motion.button>
                </a>
              </motion.div>
            </div>
          </div>
          
          <div className="border-t border-indigo-800 mt-8 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} MediCrypt. All rights reserved.</p>
            <motion.p 
              className="mt-2 text-indigo-300"
              animate={{ 
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              Secure. Private. Blockchain-powered medical records.
            </motion.p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;