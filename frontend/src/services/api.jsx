// api.js - Enhanced authentication service with dummy data

// Mock user data
const mockUsers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    userType: 'patient',
    profileImage: null
  },
  {
    id: '2',
    firstName: 'Elizabeth',
    lastName: 'Carter',
    email: 'dr.carter@hospital.com',
    walletAddress: '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF',
    userType: 'doctor',
    profileImage: null
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert@research.org',
    walletAddress: '0x6E0d01A76C3Cf4288372a29124A26D4353EE51BE',
    userType: 'researcher',
    profileImage: null
  }
];

// Mock patient records
const mockPatientRecords = [
  { id: '1', name: 'James Wilson', hasReportSubmitted: true, accessStatus: 'granted' },
  { id: '2', name: 'Sarah Johnson', hasReportSubmitted: true, accessStatus: 'pending' },
  { id: '3', name: 'Robert Chen', hasReportSubmitted: true, accessStatus: 'none' },
  { id: '4', name: 'Emily Davis', hasReportSubmitted: false, accessStatus: 'none' },
  { id: '5', name: 'Michael Brown', hasReportSubmitted: false, accessStatus: 'none' },
  { id: '6', name: 'Jessica Martinez', hasReportSubmitted: true, accessStatus: 'granted' }
];

// Mock medical records
const mockMedicalRecords = [
  { id: 1, type: 'Lab Test', date: '2023-05-10', provider: 'City Lab Services', status: 'Verified', result: 'Normal', hash: '0x7f9e8d7c6b5a4' },
  { id: 2, type: 'X-Ray', date: '2023-04-15', provider: 'Central Hospital', status: 'Verified', result: 'Normal', hash: '0x3d2c1b0a9f8e' },
  { id: 3, type: 'Vaccination', date: '2023-03-20', provider: 'Community Health', status: 'Verified', result: 'Completed', hash: '0x5f4e3d2c1b0a' },
];

// Mock access requests
const mockAccessRequests = [
  { id: 1, doctor: 'Dr. Emily Wilson', organization: 'Central Hospital', date: '2023-05-25', status: 'Pending' },
];

// Authentication service 
export const authService = {
  // Check if wallet is already registered
  checkWalletRegistration: async (walletAddress) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isRegistered = mockUsers.some(user => user.walletAddress.toLowerCase() === walletAddress.toLowerCase());
        resolve({ isRegistered });
      }, 1000);
    });
  },

  // Register a new user
  register: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create new user with ID
        const newUser = {
          id: `${mockUsers.length + 1}`,
          ...userData,
        };
        
        // In a real app, we would add to database
        // For demo, we'll return a token
        const token = `mock_token_${Date.now()}`;
        
        resolve({
          token,
          userType: userData.userType,
          user: newUser
        });
      }, 1500);
    });
  },

  // Log in an existing user
  login: async (walletAddress, signature) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(user => user.walletAddress.toLowerCase() === walletAddress.toLowerCase());
        
        if (user) {
          // In real app, we would verify the signature
          const token = `mock_token_${Date.now()}`;
          resolve({
            token,
            userType: user.userType,
            user
          });
        } else {
          reject(new Error('User not found'));
        }
      }, 1000);
    });
  },

  // Logout - clear local storage
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('userType');
  },

  // Get user profile
  getProfile: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, we would decode the token and get the user ID
        // For demo, we'll return a mock user
        const userType = localStorage.getItem('userType') || 'patient';
        const user = mockUsers.find(user => user.userType === userType) || mockUsers[0];
        
        resolve(user);
      }, 800);
    });
  }
};

// User service for managing users
export const userService = {
  // Get patients (for doctor dashboard)
  getPatients: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPatientRecords);
      }, 800);
    });
  },

  // Get profile
  getProfile: async () => {
    return authService.getProfile();
  }
};

// Records service for managing medical records
export const recordsService = {
  // Get records
  getRecords: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMedicalRecords);
      }, 800);
    });
  },

  // Submit a new record
  submitRecord: async (formData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, we would send to the blockchain
        // For demo, we'll just return success
        resolve({ success: true, recordId: Date.now() });
      }, 1500);
    });
  }
};

// Access service for managing record access
export const accessService = {
  // Get access requests
  getAccessRequests: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAccessRequests);
      }, 800);
    });
  },

  // Request access to a patient's records
  requestAccess: async (patientId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          requestId: `req-${Date.now()}`,
          patientId 
        });
      }, 1000);
    });
  },

  // Respond to an access request
  responseToAccessRequest: async (requestId, approved) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          status: approved ? 'Approved' : 'Denied',
          requestId
        });
      }, 1000);
    });
  },

  // Revoke access
  revokeAccess: async (requestId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          status: 'Revoked',
          requestId
        });
      }, 1000);
    });
  },

  // Check access status
  checkAccessStatus: async (requestId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Randomly return granted or pending
        const status = Math.random() > 0.5 ? 'granted' : 'pending';
        
        resolve({ 
          status,
          requestId,
          patientId: '1' // Hardcoded for demo
        });
      }, 1000);
    });
  }
};