import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';

const Navbar = ({ 
  toggleSidebar, 
  isDarkMode, 
  toggleDarkMode, 
  userData, 
  walletConnected, 
  walletAddress, 
  handleConnectWallet, 
  handleDisconnectWallet 
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Sample notifications
  const notifications = [
    { id: 1, type: 'appointment', message: 'Dr. Smith has confirmed your appointment', time: '10 min ago', isRead: false },
    { id: 2, type: 'record', message: 'Your blood test results have been uploaded', time: '2 hours ago', isRead: false },
    { id: 3, type: 'system', message: 'System maintenance scheduled for tonight', time: '1 day ago', isRead: true },
  ];

  // Truncate wallet address for display
  const truncateAddress = (address) => {
    if (!address) return '';
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <nav className={`sticky top-0 z-30 w-full ${isDarkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white/90 backdrop-blur-md border-b border-indigo-100'} shadow-sm`}>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button onClick={toggleSidebar} className="p-2 rounded-md text-gray-500 hover:text-indigo-600 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Logo */}
            <Link to="/dashboard" className="ml-4 flex items-center">
              <svg className={`w-8 h-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className={`ml-2 text-xl font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text'}`}>MediCrypt</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:block relative">
              <input
                type="text"
                placeholder="Search..."
                className={`w-64 pl-10 pr-4 py-2 rounded-full ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' 
                    : 'bg-gray-100 border-transparent text-gray-800 placeholder-gray-500'
                } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              <div className="absolute left-3 top-2.5">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-indigo-100 text-indigo-600'}`}
            >
              {isDarkMode ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-full ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-indigo-100 text-indigo-600'
                } relative`}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* Notification badge */}
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>
              
              {/* Notifications dropdown */}
              {isNotificationsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-80 ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  } rounded-lg shadow-lg overflow-hidden z-40`}
                >
                  <div className={`p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                    <h3 className="font-semibold">Notifications</h3>
                    <button className="text-sm text-indigo-600 hover:underline">Mark all as read</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} ${notification.isRead ? 'opacity-70' : ''}`}
                        >
                          <div className="flex">
                            {/* Icon based on notification type */}
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                              notification.type === 'appointment' 
                                ? 'bg-blue-100 text-blue-500' 
                                : notification.type === 'record'
                                ? 'bg-green-100 text-green-500'
                                : 'bg-yellow-100 text-yellow-500'
                            }`}>
                              {notification.type === 'appointment' && (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              )}
                              {notification.type === 'record' && (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              )}
                              {notification.type === 'system' && (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </div>
                            <div className="ml-3">
                              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">No notifications yet</div>
                    )}
                  </div>
                  <div className={`p-3 ${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'} text-center`}>
                    <a href="#" className="text-sm text-indigo-600 hover:underline">View all notifications</a>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* MetaMask Wallet Status */}
            {walletConnected ? (
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`hidden sm:flex items-center px-3 py-1.5 text-sm rounded-full ${
                  isDarkMode ? 'bg-gray-700 text-orange-400 border border-gray-600' : 'bg-orange-100 text-orange-600'
                }`}
              >
                <svg className="w-5 h-5 mr-1.5" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32.9582 1L19.8241 10.7183L22.2667 5.09083L32.9582 1Z" fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.04858 1L14.9044 10.8728L12.7595 5.09085L2.04858 1Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {truncateAddress(walletAddress)}
              </button>
            ) : (
              <button 
                onClick={handleConnectWallet}
                className={`hidden sm:flex items-center px-3 py-1.5 text-sm rounded-full ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-orange-400 border border-gray-600' : 'bg-orange-100 hover:bg-orange-200 text-orange-600'
                }`}
              >
                <svg className="w-5 h-5 mr-1.5" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32.9582 1L19.8241 10.7183L22.2667 5.09083L32.9582 1Z" fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.04858 1L14.9044 10.8728L12.7595 5.09085L2.04858 1Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Connect Wallet
              </button>
            )}
            
            {/* User menu */}
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center"
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-indigo-700' : 'bg-indigo-100'}`}>
                  {userData?.profileImage ? (
                    <img 
                      src={userData.profileImage} 
                      alt={`${userData.firstName} ${userData.lastName}`} 
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <span className={`font-medium ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                      {userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0)}
                    </span>
                  )}
                </div>
                <svg className="ml-1 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isUserMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-48 py-2 ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  } rounded-lg shadow-lg z-40`}
                >
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userData?.firstName} {userData?.lastName}</p>
                    <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                  </div>
                  
                  <Link to="/profile" className={`block px-4 py-2 text-sm ${
                    isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                    Your Profile
                  </Link>
                  <Link to="/settings" className={`block px-4 py-2 text-sm ${
                    isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                    Settings
                  </Link>
                  
                  {walletConnected && (
                    <button 
                      onClick={handleDisconnectWallet}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Disconnect Wallet
                    </button>
                  )}
                  
                  <div className="border-t border-gray-200 mt-2">
                    <button 
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'
                      }`}
                    >
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;