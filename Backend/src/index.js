import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
    "http://localhost:5173",
    "https://iosledger.vercel.app"
];
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""));
}

const isLocalOrigin = (origin) => {
    try {
        const url = new URL(origin);
        const hostname = url.hostname;
        return (
            hostname === "localhost" ||
            hostname === "127.0.0.1" ||
            hostname.startsWith("192.168.") ||
            hostname.startsWith("10.") ||
            (hostname.startsWith("172.") && parseInt(hostname.split(".")[1], 10) >= 16 && parseInt(hostname.split(".")[1], 10) <= 31) ||
            hostname.endsWith(".local")
        );
    } catch (e) {
        return false;
    }
};

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin.replace(/\/$/, "")) || isLocalOrigin(origin)) {
            callback(null, true);
        } else {
            callback(null, new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use("/api/user", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/support", supportRoutes);

app.get("/", (req, res) => {
    res.send("IOS Ledger API is running...");
});

if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
