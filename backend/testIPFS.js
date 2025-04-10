// testIPFS.js
const { uploadFile } = require('./src/services/ipfsService');

async function testUpload() {
  const testContent = "This is a test file for verifying IPFS integration.";
  const buffer = Buffer.from(testContent, 'utf8');

  try {
    const cid = await uploadFile(buffer);
    console.log("Test file uploaded to IPFS with CID:", cid);
    console.log(`You can view it at: https://ipfs.io/ipfs/${cid}`);
  } catch (err) {
    console.error("Failed to upload to IPFS:", err);
  }
}

testUpload();
