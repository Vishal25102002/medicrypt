import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const DoctorDashboard = ({ userData, isDarkMode, walletConnected }) => {
  // Dashboard state management
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // API data states
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [patientStats, setPatientStats] = useState({});
  
  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real implementation, these would be actual API calls
        // For now we'll simulate API responses with empty data
        
        // Simulated API response times
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set empty data for now (will be replaced by API data)
        setPatients([]);
        setAppointments([]);
        setPendingRequests([]);
        setRecentActivity([]);
        setMedicalRecords([]);
        setPrescriptions([]);
        setPatientStats({
          totalPatients: 0,
          activePatients: 0,
          newPatientsThisMonth: 0,
          requiringFollowUp: 0
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter patients based on search term
  useEffect(() => {
    if (patients.length > 0) {
      if (searchTerm.trim() === '') {
        setFilteredPatients(patients);
      } else {
        const filtered = patients.filter(patient => {
          return (
            patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.condition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.status?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
        setFilteredPatients(filtered);
      }
    } else {
      setFilteredPatients([]);
    }
  }, [searchTerm, patients]);

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

  // Render a card with a title and children
  const Card = ({ title, children, className = '', actionText, actionClick }) => (
    <motion.div
      variants={itemVariants}
      className={`rounded-xl shadow-md overflow-hidden ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      } ${className}`}
    >
      <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
        {actionText && (
          <button
            onClick={actionClick}
            className={`text-sm font-medium ${
              isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
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

  // Tabs for different sections
  const Tabs = () => (
    <div className="border-b mb-6 pb-1">
      <div className="flex space-x-4 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'patients', label: 'Patients' },
          { id: 'appointments', label: 'Appointments' },
          { id: 'records', label: 'Medical Records' },
          { id: 'prescriptions', label: 'Prescriptions' },
          { id: 'requests', label: 'Requests' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === tab.id
                ? isDarkMode
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-indigo-600 border-b-2 border-indigo-600'
                : isDarkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = ({ message, icon }) => (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <p className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{message}</p>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-base text-gray-800 mb-2">Something went wrong</p>
        <p className="text-sm text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <motion.div 
        variants={itemVariants}
        className={`rounded-xl shadow-md overflow-hidden ${
          isDarkMode 
            ? 'bg-gradient-to-r from-blue-800 to-indigo-900' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600'
        }`}
      >
        <div className="px-6 py-8 sm:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <div className="text-sm text-blue-200 mb-2">Welcome, Dr.</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">{userData?.firstName || 'Doctor'} {userData?.lastName || ''}</h2>
              <p className="mt-2 text-blue-200">Your patient dashboard is ready</p>
            </div>
            <div className="mt-4 sm:mt-0">
              {walletConnected ? (
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white">
                  <div className="text-xs opacity-80">Blockchain Verified</div>
                  <div className="flex items-center mt-1">
                    <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                    <span className="text-sm">Connected & Secured</span>
                  </div>
                </div>
              ) : (
                <button className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white border border-white/20 hover:bg-white/20 transition">
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-white/20">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="text-xs text-blue-200">Patients Today</div>
                  <div className="text-lg font-semibold text-white">0</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-white/20">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="text-xs text-blue-200">Appointments</div>
                  <div className="text-lg font-semibold text-white">{appointments.length || 0}</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-white/20">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="text-xs text-blue-200">Pending Requests</div>
                  <div className="text-lg font-semibold text-white">{pendingRequests.length || 0}</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-white/20">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="text-xs text-blue-200">Prescriptions</div>
                  <div className="text-lg font-semibold text-white">{prescriptions.length || 0}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Tabs for different sections */}
      <Tabs />
      
      {/* Search Bar - Only for patients and records tabs */}
      {(activeTab === 'patients' || activeTab === 'records' || activeTab === 'prescriptions') && (
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${
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
        </div>
      )}
      
      {/* Dashboard Content based on active tab */}
      {activeTab === 'overview' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Appointments */}
              <Card 
                title="Today's Appointments" 
                actionText="View All"
                actionClick={() => setActiveTab('appointments')}
              >
                {appointments && appointments.length > 0 ? (
                  <div className="space-y-4">
                    {/* Appointment list would go here */}
                  </div>
                ) : (
                  <EmptyState 
                    message="No appointments scheduled for today." 
                    icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                )}
              </Card>
              
              {/* Recent Activity */}
              <Card 
                title="Recent Activity" 
                actionText="View All"
                actionClick={() => console.log('View all activity')}
              >
                {recentActivity && recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {/* Activity list would go here */}
                  </div>
                ) : (
                  <EmptyState 
                    message="No recent activity to display." 
                    icon="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                )}
              </Card>
            </div>
            
            <div className="space-y-6">
              {/* Pending Requests */}
              <Card 
                title="Pending Requests" 
                actionText={pendingRequests && pendingRequests.length > 0 ? "View All" : ""}
                actionClick={pendingRequests && pendingRequests.length > 0 ? () => setActiveTab('requests') : undefined}
              >
                {pendingRequests && pendingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {/* Requests list would go here */}
                  </div>
                ) : (
                  <EmptyState 
                    message="No pending requests." 
                    icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                )}
              </Card>
              
              {/* AI Medical History Assistant */}
              <Card title="AI Medical History Assistant">
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                    <div className="flex items-center mb-3">
                      <div className={`p-2 rounded-full ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-100'}`}>
                        <svg className={`w-5 h-5 ${isDarkMode ? 'text-indigo-200' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className={`ml-3 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Patient Insights</h3>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                      Use AI to quickly analyze and retrieve patient information. Ask questions in natural language.
                    </p>
                    
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="E.g., 'Show me patient's last 3 blood test results'"
                        className={`w-full pl-4 pr-12 py-2 rounded-lg ${
                          isDarkMode 
                            ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                        } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      />
                      <button className={`absolute right-2 top-2 p-1 rounded-md ${
                        isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-100 hover:bg-indigo-200'
                      }`}>
                        <svg className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Patients Tab */}
      {activeTab === 'patients' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card title="Your Patients">
            <div className="mb-4 flex justify-between items-center">
              <div></div>
              <button className="px-3 py-1.5 text-sm rounded-md flex items-center bg-green-600 text-white hover:bg-green-700">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Patient
              </button>
            </div>
            
            {patients && patients.length > 0 ? (
              <div className="overflow-x-auto">
                {/* Patient table would go here */}
                <p>Patient data would display here</p>
              </div>
            ) : (
              <EmptyState 
                message="No patient records found. Add your first patient to get started." 
                icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            )}
          </Card>
        </motion.div>
      )}
      
      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card title="Upcoming Appointments">
            <div className="mb-4 flex justify-between items-center">
              <div className="flex flex-wrap gap-3">
                <button className="px-3 py-1.5 text-sm rounded-md bg-indigo-100 text-indigo-700">
                  All Appointments
                </button>
                <button className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                  Today
                </button>
                <button className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                  This Week
                </button>
              </div>
              <button className="px-3 py-1.5 text-sm rounded-md flex items-center bg-green-600 text-white hover:bg-green-700">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Appointment
              </button>
            </div>
            
            {appointments && appointments.length > 0 ? (
              <div className="overflow-x-auto">
                {/* Appointments table would go here */}
                <p>Appointment data would display here</p>
              </div>
            ) : (
              <EmptyState 
                message="No appointments scheduled. Create your first appointment to get started." 
                icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            )}
          </Card>
        </motion.div>
      )}
      
      {/* Medical Records Tab */}
      {activeTab === 'records' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card title="Patient Medical Records">
                <div className="mb-4 flex justify-between items-center">
                  <div className="flex flex-wrap gap-3">
                    <button className="px-3 py-1.5 text-sm rounded-md bg-indigo-100 text-indigo-700">
                      All Records
                    </button>
                    <button className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                      Lab Results
                    </button>
                    <button className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                      Radiology
                    </button>
                  </div>
                  <button className="px-3 py-1.5 text-sm rounded-md flex items-center bg-green-600 text-white hover:bg-green-700">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Record
                  </button>
                </div>
                
                {medicalRecords && medicalRecords.length > 0 ? (
                  <div className="overflow-x-auto">
                    {/* Medical records table would go here */}
                    <p>Medical record data would display here</p>
                  </div>
                ) : (
                  <EmptyState 
                    message="No medical records found. Add your first record to get started." 
                    icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                )}
              </Card>
            </div>
            
            <div className="space-y-6">
              {/* Secure Sharing Feature */}
              <Card title="Secure Record Sharing">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-full ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-100'}`}>
                      <svg className={`w-5 h-5 ${isDarkMode ? 'text-indigo-200' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </div>
                    <h3 className={`ml-3 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Blockchain-secured Sharing</h3>
                  </div>
                  
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                    Securely share patient records with other healthcare providers while maintaining full audit trail and privacy controls.
                  </p>
                  
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search for patient or record..."
                      className={`w-full pl-4 pr-4 py-2 rounded-lg ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                      } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Share with:
                    </label>
                    <select 
                      className={`w-full p-2 rounded-lg ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-600 text-gray-200' 
                          : 'bg-white border-gray-300 text-gray-800'
                      } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    >
                      <option value="">Select recipient...</option>
                      <option value="doctor">Another Doctor</option>
                      <option value="specialist">Specialist</option>
                      <option value="hospital">Hospital</option>
                      <option value="patient">Patient directly</option>
                    </select>
                  </div>
                  
                  <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium">
                    Generate Secure Share Link
                  </button>
                </div>
              </Card>
              
              {/* Blockchain Verification Status */}
              <Card title="Records Verification">
                <div className="text-center">
                  <div className={`inline-block p-4 rounded-full ${
                    walletConnected
                      ? 'bg-green-100 text-green-600'
                      : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {walletConnected ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      )}
                    </svg>
                  </div>
                  <h4 className={`mt-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {walletConnected ? 'Record verification active' : 'Connect wallet for record verification'}
                  </h4>
                  <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {walletConnected 
                      ? 'New medical records can be securely verified on the blockchain. This ensures data integrity and patient privacy.' 
                      : 'Connect your MetaMask wallet to verify and add immutable medical records on the blockchain.'}
                  </p>
                  
                  {!walletConnected && (
                    <button className="mt-4 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium">
                      Connect Wallet
                    </button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Prescriptions Tab */}
      {activeTab === 'prescriptions' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card title="Active Prescriptions">
            <div className="mb-4 flex justify-between items-center">
              <div className="flex flex-wrap gap-3">
                <button className="px-3 py-1.5 text-sm rounded-md bg-indigo-100 text-indigo-700">
                  All Prescriptions
                </button>
                <button className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                  Active
                </button>
                <button className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                  Expiring Soon
                </button>
              </div>
              <button className="px-3 py-1.5 text-sm rounded-md flex items-center bg-green-600 text-white hover:bg-green-700">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Prescription
              </button>
            </div>
            
            {prescriptions && prescriptions.length > 0 ? (
              <div className="overflow-x-auto">
                {/* Prescriptions table would go here */}
                <p>Prescription data would display here</p>
              </div>
            ) : (
              <EmptyState 
                message="No prescriptions found. Create your first prescription to get started." 
                icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            )}
          </Card>
          
          {/* Add AI Medical History Assistant Suggestions */}
          <div className="mt-6">
            <Card title="AI Prescription Assistant">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-600' : 'bg-blue-100'}`}>
                    <svg className={`w-5 h-5 ${isDarkMode ? 'text-blue-200' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className={`ml-3 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Prescription Insights</h3>
                </div>
                
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                  AI-powered insights help identify potential interactions, patient adherence patterns, and recommendations based on medical history.
                </p>
                
                <div className="mt-3">
                  <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium">
                    Run Medication Analysis
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      )}
      
      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card title="Pending Requests">
                <div className="mb-4 flex flex-wrap gap-3">
                  <button className="px-3 py-1.5 text-sm rounded-md bg-indigo-100 text-indigo-700">
                    All Requests
                  </button>
                  <button className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                    Medical Record Access
                  </button>
                  <button className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                    Prescription Renewal
                  </button>
                </div>
                
                {pendingRequests && pendingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {/* Requests list would go here */}
                    <p>Request data would display here</p>
                  </div>
                ) : (
                  <EmptyState 
                    message="No pending requests found." 
                    icon="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                )}
              </Card>
            </div>
            
            <div className="space-y-6">
              {/* Research Data Participation */}
              <Card title="Research Collaboration Requests">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-full ${isDarkMode ? 'bg-purple-600' : 'bg-purple-100'}`}>
                      <svg className={`w-5 h-5 ${isDarkMode ? 'text-purple-200' : 'text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className={`ml-3 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Research Data Requests</h3>
                  </div>
                  
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                    Research institutions may request anonymized patient data for medical studies. All data will be protected using Zero-Knowledge Proofs.
                  </p>
                  
                  <div className="text-center py-2">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No active research requests</p>
                  </div>
                </div>
              </Card>
              
              {/* Patient Privacy Controls */}
              <Card title="Patient Privacy Controller">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-full ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-100'}`}>
                      <svg className={`w-5 h-5 ${isDarkMode ? 'text-indigo-200' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className={`ml-3 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Privacy Controls</h3>
                  </div>
                  
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                    Manage patient data privacy settings and access controls for blockchain-secured medical records.
                  </p>
                  
                  <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium">
                    Manage Privacy Settings
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Footer */}
      <footer className="mt-8 text-center text-sm opacity-70">
        <p>&copy; {new Date().getFullYear()} MediCrypt AI. All rights reserved.</p>
        <p className="mt-1">Secure. Private. Blockchain-powered medical records.</p>
      </footer>
    </motion.div>
  );
};

export default DoctorDashboard;