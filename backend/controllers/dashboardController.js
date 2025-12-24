const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types, isValidObjectId } = require("mongoose");

// Get dashboard data
exports.getDashboardData = async (req, res) => {
       
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        // Fetch total income
        const totalIncomeAgg = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        console.log("totalIncomeAgg:", {totalIncomeAgg, userId: isValidObjectId(userId)});

        // Fetch total expense
        const totalExpenseAgg = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        console.log("totalExpenseAgg:", {totalExpenseAgg, userId: isValidObjectId(userId)});

        // Get Income Transactions in the last 60 days
        const lastSixtyDaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 })

        // Get total income in the last 60 days
        const incomeLastSixtyDays = lastSixtyDaysIncomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

        // Get expense transactions in the last 30 days
        const lastThirtyDaysExpenseTransactions = await Expense.find({
            userId,
            date: {$gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)},
        }).sort({ date: -1})

        // Get total expenses for last 30 days
        const expensesLastThirtyDays = lastThirtyDaysExpenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

        // Get last 5 transactions (income + expense)
        const lastTransactions = [
            ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({ 
                    ...txn.toObject(), 
                    type: "income",
                 })
                ), 
            ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({ 
                    ...txn.toObject(), 
                    type: "expense",
                })
            ) 
        ].sort ((a, b) => b.date - a.date); // Sort latest first

        //Final Response
        res.json({
            totalBalance:
            (totalIncomeAgg[0]?.total || 0) - (totalExpenseAgg[0]?.total || 0),
            totalIncome: totalIncomeAgg[0]?.total || 0,
            totalExpense: totalExpenseAgg[0]?.total || 0,
            lastThirtyDaysExpense: {
                total: expensesLastThirtyDays,
                transactions: lastThirtyDaysExpenseTransactions,
            },
            lastSixtyDaysIncome: {
                total: incomeLastSixtyDays,
                transactions: lastSixtyDaysIncomeTransactions,
            },
            recentTransactions: lastTransactions,
        })
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Server error" });
    }
}