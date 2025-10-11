const express = require("express");
const { addExpense, getExpenses, deleteExpense, downloadExpenseExcel } = require("../controllers/expenseController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/add", protect, addExpense);
router.get("/get", protect, getExpenses);
router.delete("/delete/:id", protect, deleteExpense);
router.get("/downloadExcel", protect, downloadExpenseExcel);

module.exports = router;