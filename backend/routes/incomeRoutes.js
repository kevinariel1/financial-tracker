const express = require("express");
const { addIncome, getIncomes, deleteIncome, downloadIncomeExcel } = require("../controllers/incomeController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/add", protect, addIncome);
router.get("/get", protect, getIncomes);
router.delete("/delete/:id", protect, deleteIncome);
router.get("/downloadExcel", protect, downloadIncomeExcel);

module.exports = router;