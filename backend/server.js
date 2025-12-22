require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// 1. Root route to fix "Cannot GET /"
app.get("/", (req, res) => {
  res.send("Financial Tracker API is running!");
});

// 2. CORS - Ensure this matches your Vercel frontend URL
app.use(cors({ 
  origin: process.env.CLIENT_URL || "*", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
  credentials: true,
}));

app.use(express.json());

// 3. Connect DB
connectDB();

// 4. Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 5. REMOVE the first app.listen and use only this conditional one
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// 6. EXPORT is required for Vercel
module.exports = app;