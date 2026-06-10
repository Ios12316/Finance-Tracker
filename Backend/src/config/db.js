import dns from "dns";
import mongoose from "mongoose";

dns.setDefaultResultOrder("ipv4first");
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
    console.warn("Could not set DNS servers:", e);
}

mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error event:", err);
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
    }
};

export default connectDB;