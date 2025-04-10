// src/config/index.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  chainRpcUrl: process.env.CHAIN_RPC_URL,
  chainWsUrl: process.env.CHAIN_WS_URL,
  contractAddress: process.env.CONTRACT_ADDRESS,
  ipfs: {
    projectId: process.env.IPFS_PROJECT_ID,
    projectSecret: process.env.IPFS_PROJECT_SECRET,
    url: process.env.IPFS_URL
  }
};
