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
// Allow the specific frontend domain
app.use(cors({
    origin: [
        "https://financial-tracker-rjbe-8ezl4j5um-kevins-projects-60310d70.vercel.app", // Your current preview link
        "financial-tracker-alpha-eight.vercel.app", // Your production link
        "http://localhost:5173" // Local dev
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle OPTIONS pre-flight for all routes
app.options('*', cors());

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