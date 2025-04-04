import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PatientDashboard = ({ userData, isDarkMode, walletConnected }) => {
  // Sample data
  const [medicalRecords] = useState([
    { id: 1, type: 'Lab Test', date: '2023-05-10', provider: 'City Lab Services', status: 'Verified', result: 'Normal', hash: '0x7f9e8d7c6b5a4' },
    { id: 2, type: 'X-Ray', date: '2023-04-15', provider: 'Central Hospital', status: 'Verified', result: 'Normal', hash: '0x3d2c1b0a9f8e' },
    { id: 3, type: 'Vaccination', date: '2023-03-20', provider: 'Community Health', status: 'Verified', result: 'Completed', hash: '0x5f4e3d2c1b0a' },
  ]);
  
  const [appointments] = useState([
    { id: 1, doctor: 'Dr. Sarah Johnson', specialty: 'Cardiology', date: '2023-06-15', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, doctor: 'Dr. Robert Chen', specialty: 'Dermatology', date: '2023-06-28', time: '2:30 PM', status: 'Pending' },
  ]);
  
  const [prescriptions] = useState([
    { id: 1, medication: 'Amoxicillin', dosage: '500mg', frequency: 'Twice daily', dateIssued: '2023-05-05', endDate: '2023-05-15', doctor: 'Dr. Sarah Johnson', refills: 0 },
    { id: 2, medication: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', dateIssued: '2023-04-20', endDate: '2023-07-20', doctor: 'Dr. Michael Brown', refills: 2 },
  ]);
  
  const [accessRequests] = useState([
    { id: 1, doctor: 'Dr. Emily Wilson', organization: 'Central Hospital', date: '2023-05-25', status: 'Pending' },
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
            ? 'bg-gradient-to-r from-indigo-800 to-purple-900' 
            : 'bg-gradient-to-r from-indigo-600 to-purple-600'
        }`}
      >
        <div className="px-6 py-8 sm:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <div className="text-sm text-indigo-200 mb-2">Welcome back,</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">{userData?.firstName} {userData?.lastName}</h2>
              <p className="mt-2 text-indigo-200">Your medical data is secure and accessible</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-white/20">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="text-xs text-indigo-200">Medical Records</div>
                  <div className="text-lg font-semibold text-white">{medicalRecords.length}</div>
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
                  <div className="text-xs text-indigo-200">Upcoming Appointments</div>
                  <div className="text-lg font-semibold text-white">{appointments.filter(a => a.status === 'Confirmed').length}</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-white/20">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="text-xs text-indigo-200">Active Prescriptions</div>
                  <div className="text-lg font-semibold text-white">{prescriptions.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Two Column Layout for Desktop, Single Column for Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Medical Records */}
          <Card 
            title="Recent Medical Records" 
            actionText="View All"
            actionClick={() => console.log('View all records')}
          >
            {medicalRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  <thead>
                    <tr>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Type</th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Date</th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Provider</th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {medicalRecords.map((record) => (
                      <tr key={record.id}>
                        <td className={`px-4 py-3 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{record.type}</td>
                        <td className={`px-4 py-3 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{record.date}</td>
                        <td className={`px-4 py-3 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{record.provider}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <button className={`mr-2 ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}>
                            View
                          </button>
                          <button className={`mr-2 ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}>
                            Share
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No medical records found.</p>
              </div>
            )}
          </Card>
          
          {/* Appointments */}
          <Card 
            title="Upcoming Appointments" 
            actionText="Schedule New"
            actionClick={() => console.log('Schedule new appointment')}
          >
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`p-2 rounded-md ${
                        appointment.status === 'Confirmed' 
                          ? 'bg-green-400 bg-opacity-20 text-green-500' 
                          : 'bg-yellow-400 bg-opacity-20 text-yellow-500'
                      }`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{appointment.doctor}</p>
                        <p className="text-xs text-gray-500">{appointment.specialty}</p>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <span>{appointment.date} at {appointment.time}</span>
                          <span className="mx-2">•</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            appointment.status === 'Confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0 flex space-x-2 ml-0 sm:ml-4">
                      <button className={`px-3 py-1 text-xs rounded-md ${
                        isDarkMode 
                          ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}>
                        Reschedule
                      </button>
                      <button className={`px-3 py-1 text-xs rounded-md ${
                        isDarkMode 
                          ? 'bg-red-500 bg-opacity-30 hover:bg-opacity-40 text-red-300' 
                          : 'bg-red-100 hover:bg-red-200 text-red-700'
                      }`}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No upcoming appointments.</p>
              </div>
            )}
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Access Control */}
          <Card 
            title="Access Requests" 
            actionText={accessRequests.length > 0 ? "Manage All" : ""}
            actionClick={accessRequests.length > 0 ? () => console.log('Manage all access requests') : undefined}
          >
            {accessRequests.length > 0 ? (
              <div className="space-y-4">
                {accessRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{request.doctor}</p>
                        <p className="text-xs text-gray-500">{request.organization}</p>
                        <p className="text-xs text-gray-500 mt-1">Requested on: {request.date}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        {request.status}
                      </span>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button className="w-full px-3 py-2 text-xs font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white">
                        Approve
                      </button>
                      <button className={`w-full px-3 py-2 text-xs font-medium rounded-md ${
                        isDarkMode 
                          ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}>
                        Deny
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No pending access requests.</p>
              </div>
            )}
          </Card>
          
          {/* Active Prescriptions */}
          <Card 
            title="Active Prescriptions" 
            actionText="View All"
            actionClick={() => console.log('View all prescriptions')}
          >
            {prescriptions.length > 0 ? (
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div 
                    key={prescription.id} 
                    className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="p-2 rounded-md bg-blue-100 text-blue-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{prescription.medication}</p>
                        <p className="text-xs text-gray-500">{prescription.dosage} - {prescription.frequency}</p>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <span>Prescribed by: {prescription.doctor}</span>
                        </div>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <span>Valid until: {prescription.endDate}</span>
                          <span className="mx-2">•</span>
                          <span>Refills: {prescription.refills}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No active prescriptions.</p>
              </div>
            )}
          </Card>
          
          {/* Blockchain Security Status */}
          <Card title="Blockchain Security">
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
                {walletConnected ? 'Your data is blockchain secured' : 'Connect your wallet for enhanced security'}
              </h4>
              <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {walletConnected 
                  ? 'Your medical records are secured and verified on the blockchain network, ensuring data integrity and privacy.' 
                  : 'Link your MetaMask wallet to secure and verify your medical records on the blockchain.'}
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
  );
};

export default PatientDashboard;