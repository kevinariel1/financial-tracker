const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/authController");
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

router.post(
  "/uploadProfilePicture",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Just return the URL from Cloudinary.
      // We will save it to the database during the Register or Profile Update step.
      res.status(200).json({
        message: "Image uploaded successfully",
        imageUrl: req.file.path, // This matches what SignUp.jsx expects
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error uploading image", error: error.message });
    }
  }
);

module.exports = router;
