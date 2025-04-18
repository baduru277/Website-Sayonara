const crypto = require('crypto');

// Generate a secure key and IV (store securely, e.g., in environment variables)
const ENCRYPTION_KEY = crypto.randomBytes(32); // Replace with a securely stored key
const IV_LENGTH = 16; // AES block size (16 bytes for AES)

// Encrypt data
function encryptData(data) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
  };
}

// Decrypt data
function decryptData(encryptedData, iv) {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    ENCRYPTION_KEY,
    Buffer.from(iv, 'hex')
  );
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encryptData, decryptData };
