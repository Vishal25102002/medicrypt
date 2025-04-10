// src/services/recordService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { encryptData } = require('../utils/cryptoUtil');
const { uploadFile } = require('./ipfsService');
const { updateRecordCID } = require('./blockchainService');

async function uploadMedicalRecord({ patientId, fileBuffer, fileName, uploaderWallet }) {
  // Encrypt file content
  const encryptionResult = encryptData(fileBuffer.toString('utf8'));
  // Create a JSON payload of the encryption result.
  const encryptedPayload = JSON.stringify(encryptionResult);
  
  // Upload to IPFS
  const cid = await uploadFile(Buffer.from(encryptedPayload));
  
  // Create record in DB
  const record = await prisma.medicalRecord.create({
    data: {
      cid,
      fileName,
      patient: { connect: { id: patientId } }
    }
  });
  
  // Update on-chain pointer (assumes patient wallet signs or service is used)
  await updateRecordCID(uploaderWallet, cid);
  
  return record;
}

async function getMedicalRecord(recordId) {
  return prisma.medicalRecord.findUnique({ where: { id: recordId } });
}

module.exports = { uploadMedicalRecord, getMedicalRecord };
