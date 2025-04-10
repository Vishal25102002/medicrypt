import React, { useState, useEffect } from 'react';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import ResearcherDashboard from './ResearcherDashboard';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { userService } from '../services/api';

const Dashboard = ({ 
  userType = 'patient', 
  initialView = 'overview',
  isDarkMode = false,
  toggleDarkMode = () => {},
  walletConnected = false,
  walletAddress = '',
  handleConnectWallet = () => {},
  handleDisconnectWallet = () => {}
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await userService.getProfile();
        setUserData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again later.');
        
        // Mock user data if API fails
        setUserData({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          profileImage: null,
          userType: userType
        });
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userType]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const switchUserType = (newUserType) => {
    // In a real app, this would be managed by authentication
    console.log(`Switching user type to: ${newUserType}`);
    // Redirect to the appropriate dashboard
    window.location.href = `/${newUserType}`;
  };

  const renderDashboard = () => {
    const commonProps = {
      userData,
      isDarkMode,
      walletConnected,
      walletAddress
    };

    switch (userType) {
      case 'doctor':
        return <DoctorDashboard {...commonProps} />;
      case 'researcher':
        return <ResearcherDashboard {...commonProps} />;
      case 'patient':
      default:
        return <PatientDashboard {...commonProps} />;
    }
  };

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
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        userType={userType}
        isDarkMode={isDarkMode}
        switchUserType={switchUserType}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar 
          toggleSidebar={toggleSidebar}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          userData={userData}
          walletConnected={walletConnected}
          walletAddress={walletAddress}
          handleConnectWallet={handleConnectWallet}
          handleDisconnectWallet={handleDisconnectWallet}
        />
        
        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;