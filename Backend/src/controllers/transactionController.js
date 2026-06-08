import Transaction from "../models/transaction.js";

export const addTransaction = async (req, res) => {
    try {
        const { type, amount, category, description, date } = req.body;

        const transaction = await Transaction.create({
            user: req.user._id,
            type,
            amount,
            category,
            description,
            date: date || Date.now()
        });
        res.status(201).json({ message: "Transaction added successfully", transaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
        res.status(200).json({ count: transactions.length, transactions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });
        if (transaction.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateTransaction = async(req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });
        if (transaction.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id, {
                ...req.body
            },
            { new: true, runValidators: true }
        );
        res.status(200).json({ message: "Transaction updated successfully", updatedTransaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteTransaction = async(req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });
        if (transaction.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        await Transaction.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getSummary = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id });
        const income = transactions
        .filter((transaction) => transaction.type === "income")
        .reduce((total, transaction) => total + transaction.amount, 0);

        const expense = transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((total, transaction) => total + transaction.amount, 0);
        const balance = income - expense;


        res.status(200).json({ income, expense, balance, totalTransactions: transactions.length});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
