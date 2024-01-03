const crypto = require('crypto');

const algorithm = 'aes-256-cbc';

// module.exports = {

  // Generates a random encryption key
function generateKey() {
    return {data: crypto.randomBytes(32).toString('base64')};  // 256 bits key for aes-256-cbc
}
exports.generateKey = generateKey;

// Encrypts text using the given key
function encrypt({text, key}) {
  const iv = crypto.randomBytes(16);  // initialization vector
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'base64'), iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return {data: iv.toString('base64') + encrypted};  // return iv + encrypted data in base64 format
}
exports.encrypt = encrypt;

// Encrypts text using the given key
function encryptBytes({data, key}) {
  const iv = crypto.randomBytes(16);  // initialization vector
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'base64'), iv);

  const encryptedBuffer = Buffer.concat([cipher.update(data), cipher.final()]);
  const encryptedData = Buffer.concat([iv, encryptedBuffer]); 

  return encryptedData.toString('base64');
}
exports.encryptBytes = encryptBytes;


// Decrypts text using the given key
function decrypt({encryptedText, key}) {
  const iv = Buffer.from(encryptedText.slice(0, 24), 'base64');  // extract the iv from the front, 16 bytes encoded in base64 is 24 characters
  const encrypted = encryptedText.slice(24);
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'base64'), iv);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return {data: decrypted};
}
exports.decrypt = decrypt;


function decryptBytes({encryptedData, key}) {
  const rawData = Buffer.from(encryptedData, 'base64');
  const iv = rawData.slice(0, 16); 
  const encrypted = rawData.slice(16);
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'base64'), iv);
  const decryptedBuffer = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decryptedBuffer;
}

exports.decryptBytes = decryptBytes;


exports.apiFunctions = {
    generateKey, encrypt, decrypt
}
