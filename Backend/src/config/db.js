import dns from "dns";
import mongoose from "mongoose";

// Only apply DNS resolution override in local development to fix local connection issues (e.g. querySrv ECONNREFUSED)
// Do not override DNS in production (like on Vercel) as it will break database resolution and lead to timeouts.
if (!process.env.VERCEL && process.env.NODE_ENV !== "production") {
    dns.setDefaultResultOrder("ipv4first");
    try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
        console.log("Applied local DNS resolution override (Google/Cloudflare).");
    } catch (e) {
        console.warn("Could not set DNS servers locally:", e);
    }
}

mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error event:", err);
});

const connectDB = async () => {
    // If already connected, do not re-connect
    if (mongoose.connection.readyState === 1) {
        console.log("MongoDB is already connected");
        return;
    }
    
    // If currently connecting, wait/return
    if (mongoose.connection.readyState === 2) {
        console.log("MongoDB is currently connecting...");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
    }
};

export default connectDB;