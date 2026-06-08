import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { 
    addTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getSummary 
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", authMiddleware, addTransaction);
router.get("/", authMiddleware, getTransactions);
router.get("/summary", authMiddleware, getSummary);
router.get("/:id", authMiddleware, getTransactionById);
router.put("/:id", authMiddleware, updateTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);

export default router;
