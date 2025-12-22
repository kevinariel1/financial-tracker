const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

//Register User
exports.registerUser = async (req, res) => {
  // Make sure 'profilePictureUrl' is included here
  const { fullName, email, password, profilePictureUrl } = req.body || {};

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user with the Cloudinary URL (or null if they didn't upload one)
    const user = new User({
      fullName,
      email,
      password,
      profilePictureUrl: profilePictureUrl || "", // Force it to an empty string if null
    });

    await user.save();

    res.status(201).json({
      id: user._id,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePictureUrl: user.profilePictureUrl,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please enter your Email and Password" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res
      .status(200)
      .json({ id: user._id, user, token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Get User
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
