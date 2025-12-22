const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

//Register User
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password, profilePictureUrl } = req.body || {};

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Use empty string if no URL is provided
    const user = new User({
      fullName,
      email,
      password,
      profilePictureUrl: profilePictureUrl || "",
    });

    await user.save();

    // Create the token after saving successfully
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePictureUrl: user.profilePictureUrl,
      },
    });
  } catch (error) {
    // This will appear in your Vercel logs if it fails again
    console.error("REGISTER_ERROR:", error); 
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
