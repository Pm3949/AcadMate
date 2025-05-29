import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

// 🔐 Derive a 32-byte key using SHA-256 from the environment variable
const rawKey = process.env.ENCRYPTION_SECRET_KEY || 'fallback-secret';
const secretKey = crypto.createHash('sha256').update(rawKey).digest(); // 32 bytes

export function encrypt(text) {
  const iv = crypto.randomBytes(16); // 16 bytes IV
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(encryptedText) {
  const [ivHex, encryptedHex] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString('utf8');
}
