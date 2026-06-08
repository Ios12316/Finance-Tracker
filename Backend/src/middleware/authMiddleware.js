import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) =>{
    try {
        const secretKey = process.env.JWT_SECRET;
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({ message: "Unauthorized"});
        }
        const decoded = jwt.verify(token, secretKey);
        req.user = await User.findById(decoded.id).select("-password");
        if(!req.user) return res.status(401).json({ message: "User not found"});
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Unauthorized"});
    }
}

export default authMiddleware;
