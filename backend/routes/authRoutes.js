const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { registerUser, loginUser, getUserInfo } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// 1. Config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// 2. Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "profile_pics",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});

// 3. Define 'upload' ONLY ONCE
const upload = multer({ storage: storage });

// 4. Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);

router.post("/uploadProfilePicture", upload.single("profilePicture"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // 1. Get the image URL from Cloudinary
        const profilePictureUrl = req.file.path;

        // 2. Update the user in the database so it sticks!
        const User = require("../models/User"); // Ensure path is correct
        await User.findByIdAndUpdate(req.user.id, { profilePictureUrl });

        // 3. Return the key the frontend expects (profilePictureUrl)
        res.status(200).json({
            message: "Profile picture updated successfully",
            profilePictureUrl
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile picture", error: error.message });
    }
});

module.exports = router;