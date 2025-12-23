const multer = require('multer');

//Configure Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Check if we are on Vercel (production)
        const uploadPath = process.env.NODE_ENV === 'production' ? '/tmp' : 'uploads/';
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

//File filter to allow only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed.'), false);
    }
}

const uplaod = multer({
    storage, fileFilter, limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

module.exports = upload;