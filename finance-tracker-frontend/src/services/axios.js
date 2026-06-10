import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
        ? "http://localhost:5000/api"
        : "https://iosfinance.vercel.app/api"),
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;