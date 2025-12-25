const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'aidy-portfolio', // The folder name in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'], // Allowed formats
        // public_id: (req, file) => 'computed-filename-using-request',
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Error handling middleware for multer
const handleUpload = (fieldName) => {
    return (req, res, next) => {
        const uploadSingle = upload.single(fieldName);
        uploadSingle(req, res, (err) => {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ error: 'File terlalu besar. Maksimal 10MB.' });
                }
                // Multer-storage-cloudinary errors usually come as standard errors
                console.error('Upload error:', err);
                return res.status(500).json({ error: 'Gagal upload file ke Cloudinary.' });
            }
            next();
        });
    };
};

module.exports = { upload, handleUpload };
