// src/services/ipfsService.js
const axios = require('axios');
const FormData = require('form-data');
const { ipfs: ipfsConfig } = require('../config');

async function uploadFile(fileBuffer, fileName = 'record.txt') {
  try {
    const formData = new FormData();
    formData.append('file', fileBuffer, fileName);

    const response = await axios.post(ipfsConfig.url, formData, {
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        ...formData.getHeaders(),
        pinata_api_key: ipfsConfig.projectId,
        pinata_secret_api_key: ipfsConfig.projectSecret
      }
    });

    return response.data.IpfsHash; // This is your CID
  } catch (error) {
    console.error('Failed to upload to IPFS via Pinata:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { uploadFile };
