const fs = require('fs');
const crypto = require('crypto');

// Encrypt a file using AES encryption
const encryptFile = (filePath, secretKey) => {
    const cipher = crypto.createCipher('aes-256-cbc', secretKey);  // Using AES-256-CBC encryption
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(filePath + '.enc');  // Encrypted file will have '.enc' extension

    input.pipe(cipher).pipe(output);

    output.on('finish', () => {
        console.log('File encrypted successfully');
    });
};
