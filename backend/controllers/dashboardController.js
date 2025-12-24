const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types, isValidObjectId } = require("mongoose");

// Get dashboard data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));
        const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        // FIRE ALL QUERIES AT ONCE
        const [
            totalIncomeAgg,
            totalExpenseAgg,
            lastSixtyDaysIncomeTransactions,
            lastThirtyDaysExpenseTransactions,
            recentIncomes,
            recentExpenses
        ] = await Promise.all([
            Income.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Expense.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Income.find({ userId, date: { $gte: sixtyDaysAgo } }).sort({ date: -1 }),
            Expense.find({ userId, date: { $gte: thirtyDaysAgo } }).sort({ date: -1 }),
            Income.find({ userId }).sort({ date: -1 }).limit(5),
            Expense.find({ userId }).sort({ date: -1 }).limit(5)
        ]);

        // Logic processing (happens in memory, very fast)
        const totalIncome = totalIncomeAgg[0]?.total || 0;
        const totalExpense = totalExpenseAgg[0]?.total || 0;
        const incomeLastSixtyDays = lastSixtyDaysIncomeTransactions.reduce((sum, t) => sum + t.amount, 0);
        const expensesLastThirtyDays = lastThirtyDaysExpenseTransactions.reduce((sum, t) => sum + t.amount, 0);

        const lastTransactions = [
            ...recentIncomes.map(txn => ({ ...txn.toObject(), type: "income" })),
            ...recentExpenses.map(txn => ({ ...txn.toObject(), type: "expense" }))
        ].sort((a, b) => b.date - a.date).slice(0, 5);

        res.json({
            totalBalance: totalIncome - totalExpense,
            totalIncome,
            totalExpense,
            lastThirtyDaysExpense: {
                total: expensesLastThirtyDays,
                transactions: lastThirtyDaysExpenseTransactions,
            },
            lastSixtyDaysIncome: {
                total: incomeLastSixtyDays,
                transactions: lastSixtyDaysIncomeTransactions,
            },
            recentTransactions: lastTransactions,
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ message: "Server error" });
    }
};