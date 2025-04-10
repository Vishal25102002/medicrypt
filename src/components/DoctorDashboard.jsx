import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { recordsService, accessService, userService } from '../services/api';

// Simple PatientRecordModal component
const PatientRecordModal = ({ isOpen, onClose, patientRecord }) => {
  if (!isOpen) return null;
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <h3 className="text-xl font-bold mb-4">Patient Record</h3>
        <pre className="text-sm text-gray-700 mb-4 overflow-auto max-h-80">
          {JSON.stringify(patientRecord, null, 2)}
        </pre>
        <motion.button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const DoctorDashboard = ({ userData = { firstName: 'Elizabeth', lastName: 'Carter' }, walletAddress }) => {
  // State for wallet address
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    // Set wallet status based on the provided walletAddress
    if (walletAddress) {
      setWalletConnected(true);
    }
  }, [walletAddress]);

  // Tabs: 'patients', 'add-record', 'permission-requests'
  const [activeTab, setActiveTab] = useState('patients');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [patients, setPatients] = useState([]);
  const [permissionRequests, setPermissionRequests] = useState([]);
  
  // Form states for submitting new record
  const [selectedPatient, setSelectedPatient] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [reportFile, setReportFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [reportType, setReportType] = useState('diagnosis');
  
  // New fields for patient record
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [diagnosisField, setDiagnosisField] = useState('');
  
  // Modal states and selected record data
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedRecordData, setSelectedRecordData] = useState(null);

  // Fetch data from API
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await userService.getPatients();
      setPatients(response);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patients data. Please try again later.');
      setLoading(false);
      
      // For demonstration, set mock data if API fails
      setPatients([
        { id: '1', name: 'James Wilson', hasReportSubmitted: true, accessStatus: 'granted' },
        { id: '2', name: 'Sarah Johnson', hasReportSubmitted: true, accessStatus: 'pending' },
        { id: '3', name: 'Robert Chen', hasReportSubmitted: true, accessStatus: 'none' },
        { id: '4', name: 'Emily Davis', hasReportSubmitted: false, accessStatus: 'none' },
        { id: '5', name: 'Michael Brown', hasReportSubmitted: false, accessStatus: 'none' },
        { id: '6', name: 'Jessica Martinez', hasReportSubmitted: true, accessStatus: 'granted' }
      ]);
    }
  };

  const fetchPermissionRequests = async () => {
    try {
      setLoading(true);
      const response = await accessService.getAccessRequests();
      setPermissionRequests(response);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching permission requests:', err);
      setError('Failed to load permission requests. Please try again later.');
      setLoading(false);
      
      // For demonstration, set mock data if API fails
      setPermissionRequests([
        { id: 'req1', patientName: 'Sarah Johnson', requestedAt: new Date().toISOString() },
        { id: 'req2', patientName: 'David Thompson', requestedAt: new Date(Date.now() - 86400000).toISOString() }
      ]);
    }
  };

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchPatients(),
          fetchPermissionRequests()
        ]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to initialize dashboard. Please refresh the page.');
      }
    };

    fetchData();
  }, []);

  // Handle request access - calls API
  const handleRequestAccess = async (patientId) => {
    try {
      setSubmitting(true);
      
      // Call API to request access to patient records
      const response = await accessService.requestAccess(patientId);
      
      // Update local state after successful API call
      const updatedPatients = patients.map((p) =>
        p.id === patientId ? { ...p, accessStatus: 'pending' } : p
      );
      setPatients(updatedPatients);
      
      // Add to permission requests
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        const newRequest = { 
          id: response.requestId || `req-${Date.now()}`, 
          patientName: patient.name, 
          requestedAt: new Date().toISOString() 
        };
        setPermissionRequests([...permissionRequests, newRequest]);
      }
      
      setSubmitting(false);
    } catch (err) {
      console.error('Error requesting access:', err);
      setError('Failed to request access. Please try again.');
      setSubmitting(false);
    }
  };

  // Submit a new report - calls API
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient || !reportContent) {
      setSubmitError('Please select a patient and provide a report.');
      return;
    }
    
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('patientId', selectedPatient);
      formData.append('reportContent', reportContent);
      formData.append('reportType', reportType);
      formData.append('patientAge', patientAge);
      formData.append('patientGender', patientGender);
      formData.append('diagnosis', diagnosisField);
      
      if (reportFile) {
        formData.append('reportFile', reportFile);
      }

      // Submit to API
      await recordsService.submitRecord(formData);

      // Update local state
      const updatedPatients = patients.map((p) =>
        p.id === selectedPatient ? { ...p, hasReportSubmitted: true } : p
      );
      
      setPatients(updatedPatients);
      setSubmitSuccess(true);
      setSelectedPatient('');
      setReportContent('');
      setPatientAge('');
      setPatientGender('');
      setDiagnosisField('');
      setReportFile(null);
      setSubmitting(false);
      
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error('Error submitting report:', err);
      setSubmitError('Failed to submit report. Please try again.');
      setSubmitting(false);
    }
  };

  // Check access status
  const checkAccessStatus = async (requestId) => {
    try {
      const response = await accessService.checkAccessStatus(requestId);
      
      // Update the UI based on the status
      if (response.status === 'granted') {
        const updatedRequests = permissionRequests.filter(req => req.id !== requestId);
        setPermissionRequests(updatedRequests);
        
        // Update patient status
        const patientId = response.patientId;
        const updatedPatients = patients.map((p) =>
          p.id === patientId ? { ...p, accessStatus: 'granted' } : p
        );
        setPatients(updatedPatients);
      }
      
      alert(`Access status: ${response.status}`);
    } catch (err) {
      console.error('Error checking status:', err);
      setError('Failed to check access status. Please try again.');
    }
  };

  // Open modal with patient details
  const viewPatientRecord = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedRecordData(patient);
    setShowRecordModal(true);
  };

  // Framer Motion variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-gray-50 font-sans">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-6"></div>
          <motion.p 
            className="text-2xl text-blue-900 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Loading MediSecure
          </motion.p>
          <motion.p 
            className="text-blue-600 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Connecting to secure medical network...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Patient Record Modal */}
      <AnimatePresence>
        {showRecordModal && (
          <PatientRecordModal 
            isOpen={showRecordModal}
            onClose={() => setShowRecordModal(false)}
            patientRecord={selectedRecordData}
          />
        )}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      <motion.header 
        className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 text-white shadow-lg px-6 py-4 flex items-center justify-between"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 50 }}
      >
        <div>
          <h1 className="text-2xl font-bold">
            Welcome, Dr. {userData?.firstName} {userData?.lastName}
          </h1>
          <p className="text-sm text-blue-100">MediSecure Professional Dashboard</p>
        </div>
        <div className="flex items-center space-x-4">
          {walletConnected && walletAddress && (
            <motion.div 
              className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg shadow-md"
              whileHover={{ scale: 1.03 }}
            >
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="font-medium">{walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4)}</span>
            </motion.div>
          )}
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start"
          >
            <div className="text-red-500 mr-3 text-xl">⚠️</div>
            <div>
              <p className="font-medium text-red-800">Error</p>
              <p className="text-red-700">{error}</p>
            </div>
          </motion.div>
        )}
        
        {/* Stats Cards */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {[
            { title: 'Total Patients', value: patients.length, icon: '👥' },
            { title: 'Records Submitted', value: patients.filter(p => p.hasReportSubmitted).length, icon: '📊' },
            { title: 'Pending Requests', value: permissionRequests.length, icon: '🔐' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              style={{ width: "280px" }}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * index, duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                  <motion.span
                    className="text-2xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                  >
                    {stat.icon}
                  </motion.span>
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">{stat.title}</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800 text-center">
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-200 flex space-x-2">
            {[
              { id: 'patients', label: 'Patient Records', icon: '👥' },
              { id: 'add-record', label: 'Add Medical Record', icon: '📝' },
              { id: 'permission-requests', label: 'Permission Requests', icon: '🔐' }
            ].map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="flex items-center gap-2">
                  <span>{tab.icon}</span>
                  {tab.label}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div 
          className="bg-white rounded-xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {/* Patient Records Tab */}
            {activeTab === 'patients' && (
              <motion.div
                key="patients"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                  <h2 className="text-2xl font-bold text-gray-800">Patient Records</h2>
                  <div className="relative w-full md:w-72">
                    <input
                      type="text"
                      placeholder="Search patients..."
                      className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute left-3 top-3 text-gray-400">🔍</div>
                  </div>
                </div>
                {patients.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">
                            Patient Name
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">
                            Access Status
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {patients.map((patient, index) => (
                          <motion.tr
                            key={patient.id}
                            className="hover:bg-gray-50 transition-colors"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.3 }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <motion.div 
                                  className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold mr-4"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  {patient.name.charAt(0)}
                                </motion.div>
                                <div>
                                  <div className="text-base font-medium text-gray-900">{patient.name}</div>
                                  <div className="text-sm text-gray-500">ID: {patient.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {patient.hasReportSubmitted ? (
                                patient.accessStatus === 'granted' ? (
                                  <motion.span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    Access Granted
                                  </motion.span>
                                ) : patient.accessStatus === 'pending' ? (
                                  <motion.span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
                                    Pending Permission
                                  </motion.span>
                                ) : (
                                  <motion.span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    Report Submitted
                                  </motion.span>
                                )
                              ) : (
                                <motion.span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                  <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                                  No Report
                                </motion.span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {patient.hasReportSubmitted && patient.accessStatus === 'none' && (
                                <motion.button
                                  onClick={() => handleRequestAccess(patient.id)}
                                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm bg-blue-600 text-white hover:bg-blue-700"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  disabled={submitting}
                                >
                                  <span className="mr-2">🔑</span> Request Access
                                </motion.button>
                              )}
                              {patient.accessStatus === 'granted' && (
                                <motion.button 
                                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm bg-green-600 text-white hover:bg-green-700"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => viewPatientRecord(patient.id)}
                                >
                                  <span className="mr-2">👁️</span> View Record
                                </motion.button>
                              )}
                              {patient.accessStatus === 'pending' && (
                                <motion.button
                                  disabled
                                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-gray-500 bg-gray-200 cursor-not-allowed"
                                  initial={{ scale: 1 }}
                                  animate={{ scale: [1, 1.02, 1], opacity: [1, 0.8, 1] }}
                                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                                >
                                  <span className="mr-2">⏳</span> Requested
                                </motion.button>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <motion.div 
                    className="text-center py-16 bg-gray-50 rounded-xl border-dashed border border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <motion.div 
                      className="text-5xl mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 100 }}
                    >
                      📋
                    </motion.div>
                    <p className="text-gray-500 text-lg">No patient records found.</p>
                    <motion.button 
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab('add-record')}
                    >
                      Add Your First Patient
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Add Medical Record Tab */}
            {activeTab === 'add-record' && (
              <motion.div
                key="add-record"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="max-w-4xl mx-auto"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Add New Medical Record</h2>

                {submitSuccess && (
                  <motion.div 
                    className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="text-green-500 mr-3 text-xl">✅</div>
                    <div>
                      <p className="font-medium text-green-800">Success!</p>
                      <p className="text-green-700">
                        Report submitted successfully! Please wait for the patient's permission to view the record.
                      </p>
                    </div>
                  </motion.div>
                )}

                {submitError && (
                  <motion.div 
                    className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="text-red-500 mr-3 text-xl">⚠️</div>
                    <div>
                      <p className="font-medium text-red-800">Error</p>
                      <p className="text-red-700">{submitError}</p>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleReportSubmit}>
                  <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Patient Selection</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <motion.div 
                        className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm"
                        whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient</label>
                        <div className="relative">
                          <select
                            value={selectedPatient}
                            onChange={(e) => setSelectedPatient(e.target.value)}
                            className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            required
                          >
                            <option value="">-- Select Patient --</option>
                            {patients
                              .filter((p) => !p.hasReportSubmitted)
                              .map((patient) => (
                                <option key={patient.id} value={patient.id}>
                                  {patient.name}
                                </option>
                              ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                            👤
                          </div>
                        </div>
                      </motion.div>

                      <motion.div 
                        className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm"
                        whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: 'diagnosis', icon: '🩺', label: 'Diagnosis' },
                            { id: 'prescription', icon: '💊', label: 'Prescription' },
                            { id: 'lab', icon: '🧪', label: 'Lab Results' }
                          ].map(type => (
                                                          <motion.div 
                              key={type.id}
                              className={`border ${reportType === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'} rounded-lg p-3 text-center cursor-pointer`}
                              whileHover={{ backgroundColor: "#EFF6FF", borderColor: "#3B82F6", scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setReportType(type.id)}
                            >
                              <motion.div 
                                className="text-2xl mb-1"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                              >
                                {type.icon}
                              </motion.div>
                              <div className="text-sm text-gray-700 font-medium">{type.label}</div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Medical Report Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Patient Age</label>
                        <input
                          type="number"
                          value={patientAge}
                          onChange={(e) => setPatientAge(e.target.value)}
                          placeholder="Enter patient age"
                          className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Patient Gender</label>
                        <select
                          value={patientGender}
                          onChange={(e) => setPatientGender(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                        >
                          <option value="">-- Select Gender --</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <motion.div 
                      className="mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">Medical Report</label>
                      <textarea
                        value={reportContent}
                        onChange={(e) => setReportContent(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter detailed medical report here..."
                        rows="6"
                        required
                      ></textarea>
                    </motion.div>
                    
                    <motion.div 
                      className="mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                      <textarea
                        value={diagnosisField}
                        onChange={(e) => setDiagnosisField(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter detailed diagnosis here..."
                        rows="3"
                      ></textarea>
                    </motion.div>

                    <motion.div 
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50"
                      whileHover={{ backgroundColor: "#F9FAFB", borderColor: "#3B82F6" }}
                      whileDrag={{ backgroundColor: "#EFF6FF", borderColor: "#2563EB", scale: 1.02 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
                      <div className="space-y-2">
                        <motion.div 
                          className="text-4xl text-gray-400 mb-2"
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                        >
                          📄
                        </motion.div>
                        <div className="text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={(e) => setReportFile(e.target.files[0])}
                            />
                          </label>
                          <span className="pl-1">or drag and drop</span>
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                        {reportFile && (
                          <div className="mt-2 text-sm text-gray-900 bg-blue-50 p-2 rounded-lg border border-blue-100">
                            {reportFile.name}
                          </div>
                        )}
                      </div>
                    </motion.div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Your data will be uploaded to our secure medical blockchain network for immutable record-keeping.
                        All data is encrypted and compliant with healthcare standards.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <motion.button 
                      type="submit"
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Report'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Permission Requests Tab */}
            {activeTab === 'permission-requests' && (
              <motion.div
                key="permission-requests"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Permission Requests</h2>
                {permissionRequests.length > 0 ? (
                  <div className="space-y-4">
                    {permissionRequests.map((req) => (
                      <div key={req.id} className="p-4 mb-4 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">{req.patientName}</p>
                          <p className="text-sm text-gray-500">
                            Requested at: {new Date(req.requestedAt).toLocaleString()}
                          </p>
                        </div>
                        <motion.button
                          onClick={() => checkAccessStatus(req.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Check Status
                        </motion.button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-xl border-dashed border border-gray-200">
                    <motion.div 
                      className="text-5xl mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 100 }}
                    >
                      🔐
                    </motion.div>
                    <p className="text-gray-500 text-lg">No permission requests found.</p>
                    <p className="text-gray-500">You can request access to patient records from the Patient Records tab.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default DoctorDashboard;