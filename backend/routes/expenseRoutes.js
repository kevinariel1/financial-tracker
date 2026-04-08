const express = require("express");
const { addExpense, getExpenses, deleteExpense, downloadExpenseExcel, scanReceipt } = require("../controllers/expenseController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/add", protect, addExpense);
router.post("/scan-receipt", protect, upload.single("receipt"), scanReceipt);
router.get("/get", protect, getExpenses);
router.delete("/delete/:id", protect, deleteExpense);
router.get("/downloadExcel", protect, downloadExpenseExcel);

module.exports = router;