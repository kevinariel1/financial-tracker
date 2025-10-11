const xlsx = require("xlsx");
const Expense = require("../models/Expense");

// Add expense
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;

        // Validate input
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }
        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });

        await newExpense.save();
        res.status(201).json({ message: "Expense added successfully", newExpense });
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Get all expenses
exports.getExpenses = async (req, res) => {
    const userId = req.user.id;
    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Delete expense
exports.deleteExpense = async (req, res) => {
    const userId = req.user.id;
    const expenseId = req.params.id;
    try {
        const expense = await Expense.findOneAndDelete({ _id: expenseId, userId });
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Download expense data as Excel file (memory-only, works in Postman & browsers)
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        // Fetch expenses from the database
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        
        // Prepare data for Excel
        const data = expenses.map(expense => ({
            Category: expense.category,
            Amount: expense.amount,
            Date: expense.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        }));

        // Create a new workbook and add the data
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expenses");

        // Write workbook to buffer
        const buffer = xlsx.write(wb, { bookType: "xlsx", type: "buffer" });

        // Set headers and send the file
        res.setHeader(
            "Content-Disposition", 
            "attachment; filename=expenses.xlsx"
        );
        res.setHeader(
            "Content-Type", 
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Length", buffer.length);

        // Send buffer as file
        res.send(buffer);
        
    } catch (error) {
        console.error("Error downloading expense Excel:", error);
        res.status(500).json({ message: "Server error" });
    }
};