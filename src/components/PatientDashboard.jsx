import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { recordsService, accessService, userService } from '../services/api';

const PatientDashboard = ({ userData, walletAddress }) => {
  // State for data
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bloodTestData, setBloodTestData] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch data from blockchain
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get user profile
        const profileResponse = await userService.getProfile();
        setUserProfile({
          ...profileResponse,
          walletAddress: walletAddress || profileResponse.walletAddress
        });
        
        // Get medical records
        const recordsResponse = await recordsService.getRecords();
        setMedicalRecords(recordsResponse);
        
        // Get access requests
        const requestsResponse = await accessService.getAccessRequests();
        setAccessRequests(requestsResponse);
        
        // For demo purposes, set some sample data for appointments, prescriptions, and blood tests
        // In production, these would come from API calls
        setAppointments([
          { id: 1, doctor: 'Dr. Sarah Johnson', specialty: 'Cardiology', date: '2023-06-15', time: '10:00 AM', status: 'Confirmed' },
          { id: 2, doctor: 'Dr. Robert Chen', specialty: 'Dermatology', date: '2023-06-28', time: '2:30 PM', status: 'Pending' },
        ]);

        setPrescriptions([
          { id: 1, medication: 'Amoxicillin', dosage: '500mg', frequency: 'Twice daily', dateIssued: '2023-05-05', endDate: '2023-05-15', doctor: 'Dr. Sarah Johnson', refills: 0 },
          { id: 2, medication: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', dateIssued: '2023-04-20', endDate: '2023-07-20', doctor: 'Dr. Michael Brown', refills: 2 },
        ]);

        setBloodTestData([
          {
            "patient_id": "patient123",
            "name": "John Doe",
            "blood_test_date": "2025-03-01",
            "glucose_level": 120,
            "cholesterol_level": 180,
            "diagnosis": "Normal, monitor glucose"
          },
          {
            "patient_id": "patient789",
            "name": "Alice Brown",
            "blood_test_date": "2025-01-10",
            "glucose_level": 90,
            "cholesterol_level": 160,
            "diagnosis": "Healthy"
          },
          {
            "patient_id": "hero123",
            "name": "Jane Smith",
            "blood_test_date": "2025-02-15",
            "glucose_level": 150,
            "cholesterol_level": 200,
            "diagnosis": "Pre-diabetic, recommend diet change"
          }
        ]);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch your medical data. Please try again later.');
        setLoading(false);
        
        // For demo, set sample data even if API calls fail
        setUserProfile({
          firstName: userData?.firstName || 'John',
          lastName: userData?.lastName || 'Doe',
          email: userData?.email || 'john.doe@example.com',
          userType: 'patient',
          walletAddress: walletAddress || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          joinDate: '2024-06-15',
          lastLogin: '2025-04-07',
          dataConsent: true
        });

        setMedicalRecords([
          { id: 1, type: 'Lab Test', date: '2023-05-10', provider: 'City Lab Services', status: 'Verified', result: 'Normal', hash: '0x7f9e8d7c6b5a4' },
          { id: 2, type: 'X-Ray', date: '2023-04-15', provider: 'Central Hospital', status: 'Verified', result: 'Normal', hash: '0x3d2c1b0a9f8e' },
          { id: 3, type: 'Vaccination', date: '2023-03-20', provider: 'Community Health', status: 'Verified', result: 'Completed', hash: '0x5f4e3d2c1b0a' },
        ]);

        setAccessRequests([
          { id: 1, doctor: 'Dr. Emily Wilson', organization: 'Central Hospital', date: '2023-05-25', status: 'Pending' },
        ]);
      }
    };

    fetchData();
  }, [userData?.id, walletAddress]);


  const revertRequestToPending = async (requestId) => {
    try {
      // This would be an API call in production
      // For now, just update the state
      setAccessRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, status: 'Pending' } : req
        )
      );
    } catch (error) {
      console.error('Error reverting request:', error);
      setError('Failed to revert request status. Please try again.');
    }
  };

  // Function to approve access request
  const handleApproveAccess = async (requestId) => {
    try {
      setLoading(true);
      // Call API to approve access
      await accessService.responseToAccessRequest(requestId, true);
      
      // Update the local state
      setAccessRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId ? { ...req, status: 'Approved' } : req
        )
      );
      setLoading(false);
    } catch (error) {
      console.error('Error approving access:', error);
      setError('Failed to approve access request. Please try again later.');
      setLoading(false);
    }
  };


  const handleDenyAccess = async (requestId) => {
    try {
      setLoading(true);
      // Check if it's already approved (revoke) or pending (deny)
      const request = accessRequests.find(req => req.id === requestId);
      
      if (request.status === 'Approved') {
        // Call API to revoke access
        await accessService.revokeAccess(requestId);
      } else {
        // Call API to deny access
        await accessService.responseToAccessRequest(requestId, false);
      }
      
      // Update local state
      setAccessRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId
            ? req.status === 'Approved'
              ? { ...req, status: 'Revoked' }
              : { ...req, status: 'Denied' }
            : req
        )
      );
      setLoading(false);
    } catch (error) {
      console.error('Error denying/revoking access:', error);
      setError('Failed to deny/revoke access request. Please try again later.');
      setLoading(false);
    }
  };

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

  // Truncate wallet address
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-indigo-200"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-indigo-600 text-sm font-medium">Loading</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Welcome Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
                <div className="absolute right-16 bottom-0 w-16 h-16 rounded-full bg-white opacity-10"></div>
                <div className="absolute left-16 -bottom-4 w-24 h-24 rounded-full bg-white opacity-10"></div>
              </div>
            </div>

            <div className="px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-indigo-100 border-4 border-white shadow-md -mt-12 flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {userProfile?.firstName?.charAt(0)}
                  {userProfile?.lastName?.charAt(0)}
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Welcome, {userProfile?.firstName} {userProfile?.lastName}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Your health data is secure on the blockchain
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-2 rounded-lg text-xs text-indigo-700">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                  </svg>
                  <span className="font-medium">
                    {truncateAddress(userProfile?.walletAddress)}
                  </span>
                  <button
                    className="text-indigo-600 hover:text-indigo-800"
                    onClick={() => {
                      navigator.clipboard.writeText(userProfile?.walletAddress);
                      alert('Wallet address copied to clipboard!');
                    }}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center space-x-1 bg-green-50 px-3 py-2 rounded-lg text-xs text-green-700">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Blockchain Verified</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-sm p-1 flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition ${
                activeTab === 'overview'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition ${
                activeTab === 'records'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Medical Records
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition ${
                activeTab === 'appointments'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('sharing')}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition ${
                activeTab === 'sharing'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Data Sharing
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              variants={itemVariants}
              className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Cards (shown in Overview tab) */}
          {activeTab === 'overview' && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Medical Records</div>
                    <div className="text-xl font-semibold text-gray-900">
                      {medicalRecords.length}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Appointments</div>
                    <div className="text-xl font-semibold text-gray-900">
                      {
                        appointments.filter((a) => a.status === 'Confirmed')
                          .length
                      }
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Prescriptions</div>
                    <div className="text-xl font-semibold text-gray-900">
                      {prescriptions.length}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Access Requests</div>
                    <div className="text-xl font-semibold text-gray-900">
                      {accessRequests.length}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            {(activeTab === 'overview' || activeTab === 'records') && (
              <div
                className={`space-y-6 ${
                  activeTab === 'overview' ? 'lg:col-span-2' : 'lg:col-span-3'
                }`}
              >
                {/* Recent Medical Records */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">
                      Recent Medical Records
                    </h3>
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                      View All
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Type
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Provider
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {medicalRecords.length > 0 ? (
                          medicalRecords.map((record) => (
                            <tr key={record.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {record.type}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {record.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {record.provider}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
                                  {record.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                  View
                                </button>
                                <button className="text-indigo-600 hover:text-indigo-900">
                                  Share
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                              No medical records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Rest of the content remains the same */}
                {/* ... */}
              </div>
            )}

            {/* Right Column - only in Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Access Requests Card */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">Access Requests</h3>
                    {accessRequests.length > 0 && (
                      <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                        Manage All
                      </button>
                    )}
                  </div>

                  <div className="p-6">
                    {accessRequests.length > 0 ? (
                      <div className="space-y-4">
                        {accessRequests.map((request) => (
                          <div
                            key={request.id}
                            className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {request.doctor}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {request.organization}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Requested on: {request.date}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  request.status === 'Approved'
                                    ? 'bg-green-100 text-green-800'
                                    : request.status === 'Revoked'
                                    ? 'bg-red-100 text-red-800'
                                    : request.status === 'Denied'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {request.status}
                              </span>
                            </div>

                            {/* If the request is Pending, show Approve / Deny */}
                            {request.status === 'Pending' && (
                              <div className="mt-4 grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => handleApproveAccess(request.id)}
                                  className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleDenyAccess(request.id)}
                                  className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Deny
                                </button>
                              </div>
                            )}

                            {/* If the request was Approved, show Revoke */}
                            {request.status === 'Approved' && (
                              <div className="mt-4">
                                <button
                                  onClick={() => handleDenyAccess(request.id)}
                                  className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Revoke Access
                                </button>
                              </div>
                            )}

                            {/* If the request was Denied or Revoked, allow user to revert to pending */}
                            {(request.status === 'Denied' ||
                              request.status === 'Revoked') && (
                              <div className="mt-4">
                                <button
                                  onClick={() => revertRequestToPending(request.id)}
                                  className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white"
                                >
                                  Revert to Pending
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                          <svg
                            className="w-8 h-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <p className="mt-3 text-sm text-gray-500">
                          No pending access requests
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Prescriptions Card */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">
                      Active Prescriptions
                    </h3>
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                      View All
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    {prescriptions.length > 0 ? (
                      prescriptions.map((prescription) => (
                        <div
                          key={prescription.id}
                          className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {prescription.medication}
                              </p>
                              <p className="text-sm text-gray-500">
                                {prescription.dosage} - {prescription.frequency}
                              </p>
                              <div className="mt-1 text-xs text-gray-500">
                                <span>
                                  Prescribed by: {prescription.doctor}
                                </span>
                              </div>
                              <div className="mt-1 flex items-center text-xs text-gray-500">
                                <span>Valid until: {prescription.endDate}</span>
                                <span className="mx-2">•</span>
                                <span>Refills: {prescription.refills}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                          <svg
                            className="w-8 h-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                        </div>
                        <p className="mt-3 text-sm text-gray-500">
                          No active prescriptions
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Data Sharing Tab */}
            {activeTab === 'sharing' && (
              <motion.div
                variants={itemVariants}
                className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Access Management Card */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-medium text-gray-900">
                      Access Management
                    </h3>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-indigo-100 rounded-md text-indigo-600">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-indigo-900">
                            Access Control
                          </p>
                          <p className="mt-1 text-xs text-indigo-700">
                            You can control who has access to your medical
                            records. Approved healthcare providers can view your
                            records securely via the blockchain.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Access Requests List */}
                    <h4 className="font-medium text-gray-700 text-sm mt-6 mb-3">
                      Pending Access Requests
                    </h4>
                    {accessRequests.filter((req) => req.status === 'Pending')
                      .length > 0 ? (
                      <div className="space-y-3">
                        {accessRequests
                          .filter((req) => req.status === 'Pending')
                          .map((request) => (
                            <div
                              key={request.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {request.doctor}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {request.organization}
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    handleApproveAccess(request.id)
                                  }
                                  className="px-3 py-1 text-xs font-medium rounded-lg bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleDenyAccess(request.id)}
                                  className="px-3 py-1 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Deny
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No pending requests
                      </p>
                    )}

                    {/* Approved Access List */}
                    <h4 className="font-medium text-gray-700 text-sm mt-6 mb-3">
                      Approved Access
                    </h4>
                    {accessRequests.filter((req) => req.status === 'Approved')
                      .length > 0 ? (
                      <div className="space-y-3">
                        {accessRequests
                          .filter((req) => req.status === 'Approved')
                          .map((request) => (
                            <div
                              key={request.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-full bg-green-100 text-green-600">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {request.doctor}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {request.organization}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDenyAccess(request.id)}
                                className="px-3 py-1 text-xs font-medium rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
                              >
                                Revoke
                              </button>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No approved access
                      </p>
                    )}
                  </div>
                </div>

                {/* Privacy Settings Card */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-medium text-gray-900">Privacy Settings</h3>
                  </div>

                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Data Sharing Status
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Allow doctors to request access to your records
                          </p>
                        </div>
                        <div className="relative inline-block w-12 h-6 align-middle">
                          <input
                            type="checkbox"
                            name="dataSharingToggle"
                            id="dataSharingToggle"
                            className="sr-only peer"
                            defaultChecked={userProfile?.dataConsent || true}
                          />
                          <label
                            htmlFor="dataSharingToggle"
                            className="block h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-300 peer-checked:bg-indigo-600"
                          ></label>
                          <span className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-6"></span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Anonymous Research
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Contribute anonymized data to medical research
                          </p>
                        </div>
                        <div className="relative inline-block w-12 h-6 align-middle">
                          <input
                            type="checkbox"
                            name="anonymousDataToggle"
                            id="anonymousDataToggle"
                            className="sr-only peer"
                          />
                          <label
                            htmlFor="anonymousDataToggle"
                            className="block h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-300 peer-checked:bg-indigo-600"
                          ></label>
                          <span className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-6"></span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Email Notifications
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Receive email alerts for new access requests
                          </p>
                        </div>
                        <div className="relative inline-block w-12 h-6 align-middle">
                          <input
                            type="checkbox"
                            name="emailNotificationToggle"
                            id="emailNotificationToggle"
                            className="sr-only peer"
                            defaultChecked={true}
                          />
                          <label
                            htmlFor="emailNotificationToggle"
                            className="block h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-300 peer-checked:bg-indigo-600"
                          ></label>
                          <span className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-6"></span>
                        </div>
                      </div>

                      <hr className="border-gray-200" />

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Data Privacy Audit Log
                        </h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-700">
                            <span className="text-gray-400">
                              2025-04-05 12:34 PM:
                            </span>{' '}
                            Data sharing settings updated
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-700">
                            <span className="text-gray-400">
                              2025-04-02 10:15 AM:
                            </span>{' '}
                            Access granted to Dr. Emily Wilson
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-700">
                            <span className="text-gray-400">
                              2025-03-28 03:22 PM:
                            </span>{' '}
                            Privacy policy acceptance
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blockchain Verification Card */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden lg:col-span-2">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-medium text-gray-900">
                      Blockchain Transaction History
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Transaction Hash
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Type
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {medicalRecords.length > 0 ? (
                          medicalRecords.map((record) => (
                            <tr
                              key={`tx-${record.id}`}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-600">
                                <a
                                  href={`https://etherscan.io/tx/${record.hash}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="hover:underline"
                                >
                                  {record.hash}
                                </a>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {record.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                Record {record.type} Verification
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
                                  Confirmed
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                              No blockchain transactions found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-10">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab('overview')}
            className={`p-2 flex flex-col items-center text-xs ${
              activeTab === 'overview' ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7m-14 0l2 2m0 0l7 7 7-7m-14 0l2-2"
              />
            </svg>
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`p-2 flex flex-col items-center text-xs ${
              activeTab === 'records' ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Records</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`p-2 flex flex-col items-center text-xs ${
              activeTab === 'appointments' ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Appointments</span>
          </button>

          <button
            onClick={() => setActiveTab('sharing')}
            className={`p-2 flex flex-col items-center text-xs ${
              activeTab === 'sharing' ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Sharing</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;