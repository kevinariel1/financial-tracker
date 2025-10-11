const xlsx = require("xlsx");
const Income = require("../models/Income");

// Add income source
exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body;

        // Validate input
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }
        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date),
        });

        await newIncome.save();
        res.status(201).json({ message: "Income source added successfully", newIncome });
    } catch (error) {
        console.error("Error adding income source:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Get all income source
exports.getIncomes = async (req, res) => {
    const userId = req.user.id;

    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        console.error("Error fetching income sources:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Delete income source
exports.deleteIncome = async (req, res) => {
    const userId = req.user.id;
    const incomeId = req.params.id;
    try {
        const income = await Income.findOneAndDelete({ _id: incomeId, userId });
        if (!income) {
            return res.status(404).json({ message: "Income source not found" });
        }
        res.status(200).json({ message: "Income source deleted successfully" });
    } catch (error) {
        console.error("Error deleting income source:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Download income data as Excel file (memory-only, works in Postman & browsers)
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user?.id;

    try {
        // Fetch incomes
        const income = await Income.find({ userId }).sort({ date: -1 });

        // Prepare data
        const data = income.map(item => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date ? item.date.toISOString().split("T")[0] : "",
        }));

        // Create workbook and worksheet
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Incomes");

        // Generate buffer (Excel file in memory)
        const buffer = xlsx.write(wb, { bookType: "xlsx", type: "buffer" });

        // Set headers to force download
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=Income_details.xlsx"
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Length", buffer.length);

        // Send buffer as file
        res.end(buffer);

    } catch (error) {
        console.error("Error downloading income data as Excel:", error);
        res.status(500).json({ message: "Server error" });
    }
};
