// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import HomePage from './components/Home';
// import LoginPage from './components/Login';
// import SignupPage from './components/Signup';
// import Dashboard from './components/Dashboard';

// // Authentication Check
// const isAuthenticated = () => {
//   return localStorage.getItem('isAuthenticated') === 'true';
// };

// // Get User Type
// const getUserType = () => {
//   return localStorage.getItem('userType') || 'patient';
// };

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   if (!isAuthenticated()) {
//     return <Navigate to="/login" />;
//   }
//   return children;
// };

// // 404 Not Found page
// const NotFound = () => (
//   <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-4">
//     <div className="text-center">
//       <h1 className="text-9xl font-bold text-blue-600">404</h1>
//       <h2 className="text-3xl font-semibold mt-4 mb-6">Page Not Found</h2>
//       <p className="text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
//       <a 
//         href="/" 
//         className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-md"
//       >
//         Go Back Home
//       </a>
//     </div>
//   </div>
// );

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />
        
//         {/* Protected Routes */}
//         <Route 
//           path="/dashboard" 
//           element={
//             <ProtectedRoute>
//               <Dashboard userType={getUserType()} />
//             </ProtectedRoute>
//           } 
//         />
        
//         {/* Specific Dashboard Routes */}
//         <Route 
//           path="/patient" 
//           element={
//             <ProtectedRoute>
//               <Dashboard userType="patient" />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/doctor" 
//           element={
//             <ProtectedRoute>
//               <Dashboard userType="doctor" />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/researcher" 
//           element={
//             <ProtectedRoute>
//               <Dashboard userType="researcher" />
//             </ProtectedRoute>
//           } 
//         />
        
//         {/* Additional Protected Routes */}
//         <Route 
//           path="/records" 
//           element={
//             <ProtectedRoute>
//               <Dashboard initialView="records" />
//             </ProtectedRoute>
//           } 
//         />
        
//         <Route 
//           path="/messages" 
//           element={
//             <ProtectedRoute>
//               <Dashboard initialView="messages" />
//             </ProtectedRoute>
//           } 
//         />
        
//         <Route 
//           path="/settings" 
//           element={
//             <ProtectedRoute>
//               <Dashboard initialView="settings" />
//             </ProtectedRoute>
//           } 
//         />
        
//         {/* 404 Not Found page */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React from 'react'
import DoctorDashboard from './components/DoctorDashboard'
// import PatientDashboard from './components/PatientDashboard'
function App() {
  return (
    <div>
      {/* <PatientDashboard/> */}
      <DoctorDashboard/>
    </div>
  )
}

export default App