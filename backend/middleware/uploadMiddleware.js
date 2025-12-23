const multer = require('multer');

// Use Memory Storage instead of Disk Storage for Vercel
const storage = multer.memoryStorage(); 

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed.'), false);
    }
};

const upload = multer({
    storage, 
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;