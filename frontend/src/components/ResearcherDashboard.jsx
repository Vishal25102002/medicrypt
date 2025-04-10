import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PharmaDashboard = ({ userData, isDarkMode, walletConnected }) => {
  // Sample data for pharmaceutical companies
  const [dataSets] = useState([
    { 
      id: 1, 
      name: 'Diabetes Type 2 Genomic Markers', 
      records: 1250, 
      status: 'Premium', 
      lastUpdated: '2024-03-15', 
      potentialMarkets: ['Type 2 Diabetes', 'Metabolic Disorders'],
      price: 250000,
      exclusivity: true
    },
    { 
      id: 2, 
      name: 'Cardiovascular Risk Predictors', 
      records: 3421, 
      status: 'Exclusive', 
      lastUpdated: '2024-02-20', 
      potentialMarkets: ['Heart Disease', 'Preventive Medicine'],
      price: 450000,
      exclusivity: true
    },
    { 
      id: 3, 
      name: 'COVID-19 Long-Term Impact Study', 
      records: 983, 
      status: 'Available', 
      lastUpdated: '2024-04-01', 
      potentialMarkets: ['Respiratory Treatments', 'Immunology'],
      price: 150000,
      exclusivity: false
    },
  ]);
  
  const [activeProjects] = useState([
    { 
      id: 1, 
      name: 'Precision Diabetes Medication Development', 
      status: 'In Progress', 
      dataSetUsed: 'Diabetes Type 2 Genomic Markers',
      progressPercentage: 65,
      estimatedTimeToMarket: '18 months'
    },
    { 
      id: 2, 
      name: 'Advanced Cardiovascular Prevention', 
      status: 'Initiated', 
      dataSetUsed: 'Cardiovascular Risk Predictors',
      progressPercentage: 25,
      estimatedTimeToMarket: '24 months'
    },
  ]);
  
  const [marketInsights] = useState([
    { 
      id: 1, 
      therapeuticArea: 'Metabolic Disorders', 
      marketSize: '$45.2B', 
      growthProjection: '12.3%',
      keyTrends: ['Personalized Medicine', 'Gene Therapy']
    },
    { 
      id: 2, 
      therapeuticArea: 'Cardiovascular Treatments', 
      marketSize: '$62.7B', 
      growthProjection: '8.7%',
      keyTrends: ['Preventive Care', 'AI Diagnostics']
    },
  ]);

  // Animation variants
  const containerVariants = {
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

  // Icons as SVG components
  const icons = {
    Briefcase: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    Database: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    ChartBar: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    Globe: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h0A2.5 2.5 0 0013 5.5V5c0-1.933 1.567-3.5 3.5-3.5h1.5m-9 8.945L8.5 21.5a2.5 2.5 0 002.694 2.054 2.5 2.5 0 002.278-2.013M12 14.5v-7.5a2 2 0 00-2-2H5.5" />
      </svg>
    ),
    LightBulb: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h-4a2 2 0 01-2-2v-0.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    ShieldCheck: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  };

  // Modern Card Component
  const ModernCard = ({ 
    title, 
    children, 
    icon: Icon, 
    className = '', 
    actionText, 
    actionClick 
  }) => (
    <motion.div
      variants={itemVariants}
      className={`rounded-2xl overflow-hidden shadow-xl 
        ${isDarkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
          : 'bg-white'
        } 
        transform transition-all duration-300 hover:scale-[1.02] 
        ${className}`}
    >
      <div className={`px-6 py-4 border-b flex justify-between items-center 
        ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
        ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center space-x-3">
          {Icon && (
            <Icon 
              className={`w-6 h-6 ${
                isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
              }`} 
            />
          )}
          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {title}
          </h3>
        </div>
        {actionText && (
          <button
            onClick={actionClick}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300
              ${isDarkMode 
                ? 'bg-indigo-700 hover:bg-indigo-600 text-white' 
                : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
              }`}
          >
            {actionText}
          </button>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`min-h-screen p-6 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 to-black text-white' 
          : 'bg-gray-50'
      }`}
    >
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className={`rounded-2xl mb-8 p-6 
          ${isDarkMode 
            ? 'bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900' 
            : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'
          }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Pharma Insights Platform
            </h1>
            <p className="text-indigo-100">
              Empowering Drug Discovery through Advanced Data Intelligence
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-full px-4 py-2 flex items-center space-x-2">
              <icons.Briefcase className="w-5 h-5 text-white" />
              <span className="text-white font-medium">
                {userData?.companyName || 'Pharma Corp'}
              </span>
            </div>
            {walletConnected ? (
              <div className="bg-green-500/20 rounded-full px-4 py-2 flex items-center space-x-2">
                <icons.ShieldCheck className="w-5 h-5 text-green-300" />
                <span className="text-green-100">Blockchain Verified</span>
              </div>
            ) : (
              <button className="bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 text-white">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Sets Section */}
        <div className="lg:col-span-2 space-y-6">
          <ModernCard 
            title="Available Research Datasets" 
            icon={icons.Database}
            actionText="Explore Datasets"
            actionClick={() => console.log('Explore Datasets')}
          >
            {/* Rest of the content remains the same as in the previous version */}
            {/* (Dataset rendering code) */}
          </ModernCard>

          {/* Active Projects */}
          <ModernCard 
            title="Active Research Projects" 
            icon={icons.ChartBar}
            actionText="New Project"
            actionClick={() => console.log('Start New Project')}
          >
            {/* Rest of the content remains the same as in the previous version */}
            {/* (Active Projects rendering code) */}
          </ModernCard>
        </div>

        {/* Market Insights and Additional Information */}
        <div className="space-y-6">
          {/* Market Insights */}
          <ModernCard 
            title="Market Insights" 
            icon={icons.Globe}
            actionText="Full Report"
            actionClick={() => console.log('View Full Market Report')}
          >
            {/* Rest of the content remains the same as in the previous version */}
            {/* (Market Insights rendering code) */}
          </ModernCard>

          {/* Innovation Potential */}
          <ModernCard 
            title="Innovation Potential" 
            icon={icons.LightBulb}
          >
            {/* Rest of the content remains the same as in the previous version */}
            {/* (Innovation Potential rendering code) */}
          </ModernCard>

          {/* Blockchain Verification */}
          <ModernCard 
            title="Data Verification" 
            icon={icons.ShieldCheck}
          >
            {/* Rest of the content remains the same as in the previous version */}
            {/* (Blockchain Verification rendering code) */}
          </ModernCard>
        </div>
      </div>
    </motion.div>
  );
};

export default PharmaDashboard;