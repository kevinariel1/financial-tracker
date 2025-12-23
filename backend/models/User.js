const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePictureUrl: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function () {
    // If password isn't modified, just exit the function
    if (!this.isModified("password")) { 
        return; 
    }
    
    // Hash the password
    this.password = await bcrypt.hash(this.password, 10);
    
    // No next() call needed here!
});

// Method to compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model("User", UserSchema);