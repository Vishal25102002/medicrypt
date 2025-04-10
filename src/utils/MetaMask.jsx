// MetaMask.js - Utility functions for MetaMask wallet interactions

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
  return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
};

// Get the connected MetaMask account if already connected
export const getMetaMaskAccount = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }
  
  try {
    // Request accounts from MetaMask
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    
    if (accounts.length === 0) {
      return null; // No account connected
    }
    
    return accounts[0];
  } catch (error) {
    console.error('Error getting MetaMask account:', error);
    throw error;
  }
};

// Connect to MetaMask
export const connectMetaMask = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }
  
  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    if (accounts.length === 0) {
      throw new Error('No accounts found. Please unlock MetaMask and try again.');
    }
    
    return accounts[0];
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    throw error;
  }
};

// Sign a message with MetaMask
export const signMessage = async (address, message) => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }
  
  try {
    // When using MetaMask, you need to use personal_sign for messages
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address],
    });
    
    return signature;
  } catch (error) {
    console.error('Error signing message with MetaMask:', error);
    throw error;
  }
};

// Add an event listener for account changes
export const addAccountChangedListener = (callback) => {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('accountsChanged', callback);
  }
};

// Handle MetaMask connection (with dummy data for demo)
export const handleMetaMaskConnection = async () => {
  // For demo purposes, we can return a dummy address if MetaMask isn't available
  if (!isMetaMaskInstalled()) {
    console.warn('MetaMask not installed, using dummy address');
    return '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
  }
  
  try {
    return await connectMetaMask();
  } catch (error) {
    console.error('MetaMask connection error:', error);
    // Return dummy address for demo
    return '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
  }
};