// src/controllers/authController.js
const authService = require('../services/authService');

async function siweLoginController(req, res) {
  const { wallet, siweMessage, signature, role, name, email, contact } = req.body;
  try {
    const { user, token } = await authService.siweLogin({ wallet, siweMessage, signature, role, name, email, contact });
    res.json({ success: true, user, token });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
}

module.exports = { siweLoginController };
