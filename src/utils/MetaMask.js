/**
 * Utility functions for interacting with MetaMask and Ethereum blockchain
 */

/**
 * Check if MetaMask is installed
 * @returns {boolean} Whether MetaMask is installed
 */
export const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
  };
  
  /**
   * Get the currently connected MetaMask account
   * @returns {Promise<string|null>} The connected account address or null if not connected
   */
  export const getMetaMaskAccount = async () => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }
  
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts.length > 0 ? accounts[0] : null;
    } catch (error) {
      console.error('Error checking MetaMask connection:', error);
      throw error;
    }
  };
  
  /**
   * Connect to MetaMask
   * @returns {Promise<string>} The connected account address
   */
  export const connectMetaMask = async () => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }
  
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      throw error;
    }
  };
  
  /**
   * Disconnect from MetaMask (note: MetaMask doesn't have a direct disconnect method,
   * so this just clears the state in our application)
   * @returns {Promise<void>}
   */
  export const disconnectMetaMask = async () => {
    // This doesn't actually disconnect MetaMask, as there's no API method for that
    // It simply clears the connection state in our application
    return Promise.resolve();
  };
  
  /**
   * Get the current Ethereum network ID
   * @returns {Promise<string>} The network ID
   */
  export const getNetworkId = async () => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }
  
    try {
      const networkId = await window.ethereum.request({ method: 'net_version' });
      return networkId;
    } catch (error) {
      console.error('Error getting network ID:', error);
      throw error;
    }
  };
  
  /**
   * Get the current Ethereum chain ID
   * @returns {Promise<string>} The chain ID
   */
  export const getChainId = async () => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }
  
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      return chainId;
    } catch (error) {
      console.error('Error getting chain ID:', error);
      throw error;
    }
  };
  
  /**
   * Sign a message using MetaMask
   * @param {string} account The account address to sign with
   * @param {string} message The message to sign
   * @returns {Promise<string>} The signature
   */
  export const signMessage = async (account, message) => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }
  
    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, account]
      });
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  };
  
  /**
   * Handle MetaMask account changes
   * @param {Function} callback Function to call when accounts change
   * @returns {void}
   */
  export const handleAccountsChanged = (callback) => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }
  
    window.ethereum.on('accountsChanged', callback);
  };
  
  /**
   * Handle MetaMask chain changes
   * @param {Function} callback Function to call when chain changes
   * @returns {void}
   */
  export const handleChainChanged = (callback) => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }
  
    window.ethereum.on('chainChanged', callback);
  };
  
  /**
   * Remove MetaMask event listeners
   * @param {string} eventName The event name to remove listeners for
   * @param {Function} callback The callback to remove
   * @returns {void}
   */
  export const removeMetaMaskListener = (eventName, callback) => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }
  
    window.ethereum.removeListener(eventName, callback);
  };
  
  export default {
    isMetaMaskInstalled,
    getMetaMaskAccount,
    connectMetaMask,
    disconnectMetaMask,
    getNetworkId,
    getChainId,
    signMessage,
    handleAccountsChanged,
    handleChainChanged,
    removeMetaMaskListener
  };