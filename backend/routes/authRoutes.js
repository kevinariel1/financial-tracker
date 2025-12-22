const express = require("express");
const { registerUser, loginUser, getUserInfo } = require("../controllers/authController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);

// 1. Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// 2. Set up Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "profile_pictures", // Folder name in Cloudinary
        allowed_formats: ["jpg", "jpeg", "png"],
    },  
});

const upload = multer({ storage: storage });

router.post("/upload-profile-picture", upload.single("profilePicture"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Cloudinary automatically gives you the secure_url
        const imageUrl = req.file.path;

        res.status(200).json({
            message: "Image uploaded successfully",
            imageUrl: imageUrl // This will be https://res.cloudinary.com/...
        });
    } catch (error) {
        res.status(500).json({ message: "Upload failed", error });
    }
});

module.exports = router;