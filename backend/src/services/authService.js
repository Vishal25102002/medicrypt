// async function siweLogin({ wallet, siweMessage, signature, role, name, email, contact }) {
//     // Bypass real verification for testing
//     // const isValid = verifySiweMessage(siweMessage, signature, wallet);
//     const isValid = true;
    
//     if (!isValid) throw new Error('Invalid SIWE signature');
  
//     let user = await prisma.user.findUnique({
//       where: { walletAddress: wallet.toLowerCase() }
//     });
  
//     if (!user) {
//       user = await prisma.user.create({
//         data: {
//           walletAddress: wallet.toLowerCase(),
//           role,
//           name,
//           email,
//           contact
//         }
//       });
//     }
  
//     const token = jwt.sign({ userId: user.id, wallet: user.walletAddress, role: user.role }, jwtSecret, { expiresIn: '1h' });
//     return { user, token };
//   }

// src/services/authService.js

const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { jwtSecret } = require('../config');
// If you want to keep the verify function for future, you can import it
// but we won't use it for now, or we’ll skip it.
const { verifySiweMessage } = require('../utils/siweUtil');

async function siweLogin({ wallet, siweMessage, signature, role, name, email, contact }) {
  // BYPASS real signature verification for local dev:
  // const isValid = verifySiweMessage(siweMessage, signature, wallet);
  const isValid = true;
  
  if (!isValid) {
    throw new Error('Invalid SIWE signature');
  }

  let user = await prisma.user.findUnique({
    where: { walletAddress: wallet.toLowerCase() }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        walletAddress: wallet.toLowerCase(),
        role,
        name,
        email,
        contact
      }
    });
  }

  // Generate a JWT containing the user info (1-hour expiry)
  const token = jwt.sign(
    { userId: user.id, wallet: user.walletAddress, role: user.role },
    jwtSecret,
    { expiresIn: '1h' }
  );

  return { user, token };
}

module.exports = {
  siweLogin
};
