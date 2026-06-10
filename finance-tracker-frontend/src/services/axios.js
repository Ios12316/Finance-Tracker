import axios from "axios";

const getBaseURL = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        const isLocal = 
            hostname === "localhost" || 
            hostname === "127.0.0.1" || 
            hostname.startsWith("192.168.") || 
            hostname.startsWith("10.") || 
            (hostname.startsWith("172.") && parseInt(hostname.split(".")[1], 10) >= 16 && parseInt(hostname.split(".")[1], 10) <= 31) ||
            hostname.endsWith(".local");
        
        if (isLocal) {
            return `http://${hostname}:5000/api`;
        }
    }
    return "https://iosfinance.vercel.app/api";
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;