// // src/controllers/recordController.js
// const recordService = require('../services/recordService');

// async function uploadRecordController(req, res) {
//   try {
//     // Assuming file uploaded via multer in req.file
//     const { ownerId, fileName } = req.body;
//     const fileBuffer = req.file.buffer;
//     const uploaderWallet = req.user.wallet; // Provided by auth middleware
//     const record = await recordService.uploadMedicalRecord({ ownerId, fileBuffer, fileName, uploaderWallet });
//     res.json({ success: true, record });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// }

// async function getRecordController(req, res) {
//   const { recordId } = req.params;
//   try {
//     const record = await recordService.getMedicalRecord(recordId);
//     if (!record) return res.status(404).json({ error: 'Record not found' });
//     res.json({ success: true, record });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// }

// module.exports = { uploadRecordController, getRecordController };
// Import prisma to check AccessRequest


// src/controllers/recordController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Probably you also want your recordService if you do "recordService.uploadMedicalRecord"
const recordService = require('../services/recordService');

// 1) Add or re-add the missing function
async function uploadRecordController(req, res) {
  try {
    // Assuming file is uploaded via multer in req.file
    const { patientId, fileName } = req.body;
    const fileBuffer = req.file.buffer;
    const uploaderWallet = req.user.wallet; // from auth

    const record = await recordService.uploadMedicalRecord({ patientId, fileBuffer, fileName, uploaderWallet });
    res.json({ success: true, record });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// 2) Keep your getRecordController
async function getRecordController(req, res) {
  const { recordId } = req.params;
  const user = req.user;

  try {
    const record = await recordService.getMedicalRecord(recordId);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    if (user.role === 'PATIENT' && record.patientId === user.userId) {
      return res.json({ success: true, record });
    }

    if (user.role === 'DOCTOR') {
      const approvedReq = await prisma.accessRequest.findFirst({
        where: {
          medicalRecordId: recordId,
          requesterId: user.userId,
          status: 'APPROVED'
        }
      });
      if (!approvedReq) {
        return res.status(403).json({ error: 'Access not granted' });
      }
      return res.json({ success: true, record });
    }

    return res.status(403).json({ error: 'Access not allowed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// 3) Export them both
module.exports = {
  uploadRecordController,
  getRecordController
};
