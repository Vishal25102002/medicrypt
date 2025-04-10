// // src/controllers/accessController.js
// const blockchainService = require('../services/blockchainService');

// async function requestAccessController(req, res) {
//   const { patientWallet } = req.body;
//   const doctorWallet = req.user.wallet;
//   try {
//     const txHash = await blockchainService.requestAccess(patientWallet, doctorWallet);
//     res.json({ success: true, txHash });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// }

// async function grantAccessController(req, res) {
//   const { doctorWallet } = req.body;
//   const patientWallet = req.user.wallet;
//   try {
//     const txHash = await blockchainService.grantAccess(patientWallet, doctorWallet);
//     res.json({ success: true, txHash });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// }

// module.exports = { requestAccessController, grantAccessController };

// src/controllers/accessController.js
const blockchainService = require('../services/blockchainService');

// ADD these lines:
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// doctor requests access
async function requestAccessController(req, res) {
  try {
    if (req.user.role !== 'DOCTOR') {
      return res.status(403).json({ success: false, error: 'Only doctors can request access' });
    }

    // We still call the chain:
    const { patientWallet } = req.body;
    const doctorWallet = req.user.wallet;
    const txHash = await blockchainService.requestAccess(patientWallet, doctorWallet);

    // ALSO store in DB. Suppose you pass `medicalRecordId` in the body.
    // We'll create a new AccessRequest row for the record & the requesting user.
    const { medicalRecordId } = req.body;
    if (!medicalRecordId) {
      return res.status(400).json({ success: false, error: 'medicalRecordId is required' });
    }

    // In your schema, "requester" references the `User` model, so we use `requesterId = req.user.userId`
    const newReq = await prisma.accessRequest.create({
      data: {
        medicalRecordId,
        requesterId: req.user.userId, // the user's DB id
        status: 'PENDING'
      }
    });

    res.json({ success: true, txHash, dbRequest: newReq });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// patient grants access
async function grantAccessController(req, res) {
  try {
    if (req.user.role !== 'PATIENT') {
      return res.status(403).json({ success: false, error: 'Only patients can grant access' });
    }

    // Original chain call:
    const { doctorWallet } = req.body;
    const patientWallet = req.user.wallet;
    const txHash = await blockchainService.grantAccess(patientWallet, doctorWallet);

    // ALSO update DB. We'll pass an `accessRequestId` in body to identify which request to approve.
    const { accessRequestId, newStatus } = req.body;
    if (!accessRequestId || !newStatus) {
      return res.status(400).json({ success: false, error: 'accessRequestId and newStatus required' });
    }

    // find the AccessRequest row
    const existingReq = await prisma.accessRequest.findUnique({
      where: { id: accessRequestId },
      include: { medicalRecord: true }
    });
    if (!existingReq) {
      return res.status(404).json({ success: false, error: 'Access request not found' });
    }

    // make sure the patient actually owns that record
    if (existingReq.medicalRecord.patientId !== req.user.userId) {
      return res.status(403).json({ success: false, error: 'This request does not belong to your record' });
    }

    const updatedReq = await prisma.accessRequest.update({
      where: { id: accessRequestId },
      data: { status: newStatus } // 'APPROVED' or 'REJECTED'
    });

    res.json({ success: true, txHash, updatedReq });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { requestAccessController, grantAccessController };
