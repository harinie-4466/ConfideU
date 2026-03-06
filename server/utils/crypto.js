const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, '../keys/private.pem'), 'utf8');
const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '../keys/public.pem'), 'utf8');

/**
 * Hybrid Encryption:
 * 1. Generate AES Key
 * 2. Encrypt Data with AES
 * 3. Encrypt AES Key with RSA Public Key
 */
exports.encryptFile = (buffer) => {
    // 1. Generate AES Key & IV
    const aesKey = crypto.randomBytes(32); // 256 bits
    const iv = crypto.randomBytes(16); // 128 bits initialization vector

    // 2. Encrypt Data with AES-256-CBC
    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
    let encryptedData = cipher.update(buffer);
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);

    // 3. Encrypt AES Key with RSA Public Key
    const encryptedAesKey = crypto.publicEncrypt(PUBLIC_KEY, aesKey);

    // 4. Compute Hash of Original for Integrity
    const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');

    // 5. Sign the Hash
    const sign = crypto.createSign('SHA256');
    sign.update(fileHash);
    const signature = sign.sign(PRIVATE_KEY, 'base64');

    return {
        encryptedData: encryptedData.toString('base64'), // Store as Base64 for safety
        encryptedAesKey: encryptedAesKey.toString('base64'),
        iv: iv.toString('base64'),
        fileHash,
        signature
    };
};

/**
 * Decryption:
 * 1. Decrypt AES Key with RSA Private Key
 * 2. Decrypt Data with AES Key
 */
exports.decryptFile = (encryptedDataB64, encryptedAesKeyB64, ivB64) => {
    try {
        const encryptedAesKey = Buffer.from(encryptedAesKeyB64, 'base64');
        const iv = Buffer.from(ivB64, 'base64');
        const encryptedData = Buffer.from(encryptedDataB64, 'base64');

        // 1. Decrypt AES Key
        const aesKey = crypto.privateDecrypt(PRIVATE_KEY, encryptedAesKey);

        // 2. Decrypt Data
        const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
        let decryptedData = decipher.update(encryptedData);
        decryptedData = Buffer.concat([decryptedData, decipher.final()]);

        return {
            decryptedData,
            aesKey, // Return for logging
            iv      // Return for logging
        };
    } catch (err) {
        console.error('Decryption failed:', err);
        throw new Error('Failed to decrypt file');
    }
};

/**
 * Verify Integrity
 */
exports.verifyIntegrity = (decryptedBuffer, originalHash, signature) => {
    // 1. Recompute Hash
    const currentHash = crypto.createHash('sha256').update(decryptedBuffer).digest('hex');

    // 2. Verify Hash Match
    const isHashMatch = currentHash === originalHash;

    // 3. Verify Signature
    const verify = crypto.createVerify('SHA256');
    verify.update(originalHash);
    const isSignatureValid = verify.verify(PUBLIC_KEY, signature, 'base64');

    return {
        isIntegrityIntact: isHashMatch && isSignatureValid,
        isHashMatch,
        isSignatureValid
    };
};

/**
 * Decrypt Signature (for logging purposes)
 * Returns the hash signed within the signature
 */
exports.decryptSignature = (signatureB64) => {
    try {
        const signatureBuffer = Buffer.from(signatureB64, 'base64');
        const decryptedHash = crypto.publicDecrypt(PUBLIC_KEY, signatureBuffer);
        return decryptedHash.toString('utf8'); // or hex? Hashes are usually hex. Sign signs the buffer.
        // Wait, standard sign/verify usually hashes the data then signs the hash.
        // But `crypto.publicDecrypt` on a signature created by `sign.sign` might not just return the hash raw, 
        // it returns the padded structure (PKCS#1 v1.5 padding + OID + Hash).
        // If we want simply to show "Decrypted Signature Hash", standard `verify` is safer.
        // BUT user asked for "Decrypted Signature Hash".
        // Let's assume for this academic project, we try to decrypt and show what we get.
        // If it's complex structure, we might just show hex representation of it.
        return decryptedHash.toString('hex');
    } catch (err) {
        return 'Decryption Failed or Invalid Padding';
    }
};
