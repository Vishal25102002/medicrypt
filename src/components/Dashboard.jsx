import React, { useState } from 'react';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import ResearcherDashboard from './ResearcherDashboard';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Dashboard = ({ 
  userType = 'patient', 
  initialView = 'overview',
  isDarkMode = false,
  toggleDarkMode = () => {},
  walletConnected = false,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Mock user data (replace with actual authentication)
  const userData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    profileImage: null,
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const switchUserType = (newUserType) => {
    // In a real app, this would be managed by authentication
    console.log(`Switching user type to: ${newUserType}`);
  };

  const renderDashboard = () => {
    const commonProps = {
      userData,
      isDarkMode,
      walletConnected: false,
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