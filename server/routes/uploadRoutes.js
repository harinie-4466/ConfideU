const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { encryptFile } = require('../utils/crypto');

const router = express.Router();

// Memory Storage mostly to intercept buffer for encryption
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 10000000 },
});

// @route   POST /api/upload
// @desc    Upload & Encrypt File
router.post('/', upload.single('file'), (req, res) => {
    if (req.file) {
        try {
            // Encrypt Logic
            const { encryptedData, encryptedAesKey, iv, fileHash, signature } = encryptFile(req.file.buffer);

            // Save Encrypted File to Disk
            const filename = `${req.file.fieldname}-${Date.now()}${path.extname(req.file.originalname)}.enc`;
            const filePath = path.join(__dirname, '../uploads/', filename);

            fs.writeFileSync(filePath, encryptedData); // Write Base64 string

            // Return Metadata including Keys (In real app, keys strictly stored in DB, but returning here for immediate association logic in frontend -> DB)
            // Actually, we should return a reference and store the keys in DB.
            // BUT, currently the Report creation happens AFTER upload.
            // So we will return the metadata to the frontend to pass back to the CreateReport API, which will save it.
            // This is a trade-off. Ideally: Upload -> Save to Temp DB -> Return ID -> Create Report linked to ID.
            // Let's stick to returning data for simplicity of flow, but note security implication.

            res.send({
                success: true,
                filePath: `/uploads/${filename}`,
                fileName: req.file.originalname,
                encryption: {
                    encryptedAesKey,
                    iv,
                    fileHash,
                    signature
                }
            });

        } catch (err) {
            console.error(err);
            res.status(500).send({ success: false, error: 'Encryption failed' });
        }

    } else {
        res.status(400).send({ success: false, error: 'No file uploaded' });
    }
});

module.exports = router;
