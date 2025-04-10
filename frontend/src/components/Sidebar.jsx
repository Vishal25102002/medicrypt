import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, userType, isDarkMode, switchUserType }) => {
  const location = useLocation();
  
  // Define navigation items based on user type
  const getNavigationItems = () => {
    const commonItems = [
      { name: 'Overview', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { name: 'Blockchain Records', path: '/records', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { name: 'Messages', path: '/messages', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
      { name: 'Settings', path: '/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    ];

    // Specific items based on user type
    switch (userType) {
      case 'patient':
        return [
          ...commonItems,
          { name: 'Medical History', path: '/medical-history', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
          { name: 'Appointments', path: '/appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
          { name: 'Prescriptions', path: '/prescriptions', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
          { name: 'Access Control', path: '/access-control', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
        ];
      case 'doctor':
        return [
          ...commonItems,
          { name: 'Patients', path: '/patients', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
          { name: 'Appointments', path: '/appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
          { name: 'Prescriptions', path: '/prescriptions', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
          { name: 'Lab Results', path: '/lab-results', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
        ];
      case 'researcher':
        return [
          ...commonItems,
          { name: 'Research Data', path: '/research-data', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
          { name: 'Anonymized Records', path: '/anonymized-records', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
          { name: 'Analytics', path: '/analytics', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
          { name: 'Consent Management', path: '/consent-management', icon: 'M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4' },
        ];
      default:
        return commonItems;
    }
  };

  const navigationItems = getNavigationItems();

  // Demo only - switcher component
  const UserTypeSwitcher = () => (
    <div className={`p-4 mt-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
      <h3 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Demo: Switch User Type</h3>
      <div className="space-y-2">
        {['patient', 'doctor', 'researcher'].map((type) => (
          <button
            key={type}
            onClick={() => switchUserType(type)}
            className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
              userType === type
                ? isDarkMode 
                  ? 'bg-indigo-700 text-white' 
                  : 'bg-indigo-600 text-white'
                : isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-600' 
                  : 'text-gray-700 hover:bg-indigo-100'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
  
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed inset-y-0 left-0 z-20 w-64 overflow-y-auto ${
          isDarkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-indigo-100'
        } lg:translate-x-0 lg:static lg:z-0`}
      >
        <div className="p-4">
          {/* Logo for mobile - visible when sidebar is open */}
          <div className="lg:hidden flex items-center mb-6">
            <svg className={`w-8 h-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className={`ml-2 text-xl font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text'}`}>MediCrypt</span>
          </div>
          
          {/* User Type Display */}
          <div className={`mb-6 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-md ${
                userType === 'patient'
                  ? 'bg-blue-500'
                  : userType === 'doctor'
                  ? 'bg-green-500'
                  : 'bg-purple-500'
              } text-white`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {userType === 'patient' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                  {userType === 'doctor' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />}
                  {userType === 'researcher' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
                </svg>
              </div>
              <div className="ml-3">
                <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userType === 'patient' && 'Patient Account'}
                  {userType === 'doctor' && 'Doctor Account'}
                  {userType === 'researcher' && 'Researcher Account'}
                </h3>
                <p className="text-xs text-gray-500">
                  {userType === 'patient' && 'Manage your medical records'}
                  {userType === 'doctor' && 'Manage patient records'}
                  {userType === 'researcher' && 'Access anonymized data'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? isDarkMode 
                        ? 'bg-indigo-800 text-white' 
                        : 'bg-indigo-50 text-indigo-600'
                      : isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg 
                    className={`mr-3 h-5 w-5 ${
                      isActive
                        ? 'text-indigo-500'
                        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span>{item.name}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.span 
                      layoutId="sidebar-indicator"
                      className="absolute right-0 w-1 h-8 bg-indigo-500 rounded-l-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* Demo User Type Switcher */}
          <UserTypeSwitcher />
          
          {/* Help & Support */}
          <div className={`p-4 mt-6 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'
          }`}>
            <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Need Help?</h3>
            <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Contact our support team for assistance with your account.</p>
            <a
              href="#support"
              className={`flex items-center text-sm font-medium ${
                isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
              }`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Get Support
            </a>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;