// src/utils/siweUtil.js
const { ethers } = require('ethers');

function verifySiweMessage(message, signature, expectedAddress) {
  try {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    return false;
  }
}

module.exports = { verifySiweMessage };
