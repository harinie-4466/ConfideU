import crypto from 'crypto'

// Generate AES encryption key
export function generateAESKey(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Hash data with SHA-256
export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}

// Generate digital signature
export function generateSignature(data: string, privateKey: string): string {
  const sign = crypto.createHmac('sha256', privateKey)
  sign.update(data)
  return sign.digest('hex')
}

// Verify signature
export function verifySignature(data: string, signature: string, publicKey: string): boolean {
  const expectedSignature = generateSignature(data, publicKey)
  return signature === expectedSignature
}

// Encrypt data with AES-256-CBC
export function encryptAES(data: string, key: string): { iv: string; encrypted: string } {
  const iv = crypto.randomBytes(16).toString('hex')
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'))
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return { iv, encrypted }
}

// Decrypt data with AES-256-CBC
export function decryptAES(encryptedData: string, key: string, iv: string): string {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'))
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

// Hash password with salt (bcrypt-like, simplified for frontend demo)
export function hashPassword(password: string, salt: string = ''): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, actualSalt, 100000, 64, 'sha512').toString('hex')
  return { hash, salt: actualSalt }
}

// Verify password hash
export function verifyPasswordHash(password: string, hash: string, salt: string): boolean {
  const { hash: newHash } = hashPassword(password, salt)
  return newHash === hash
}

// Generate RSA-like key pair (simplified for frontend)
export function generateKeyPair(): { publicKey: string; privateKey: string } {
  const privateKey = crypto.randomBytes(32).toString('hex')
  const publicKey = crypto.createHash('sha256').update(privateKey).digest('hex')
  return { publicKey, privateKey }
}

// Mock RSA encryption with AES (for demo purposes)
export function mockRSAEncrypt(data: string, publicKey: string): string {
  const encrypted = crypto.createHash('sha256').update(data + publicKey).digest('hex')
  return encrypted
}

// Mock RSA decryption
export function mockRSADecrypt(encryptedData: string, privateKey: string): string {
  // For demo, we'll simulate decryption by returning a derived value
  return crypto.createHash('sha256').update(encryptedData + privateKey).digest('hex')
}
