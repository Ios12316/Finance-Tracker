import User from "../models/User.js";
import { userValidation, loginValidation } from "../validation/userValidation.js";
import bcrypt from "bcryptjs";
import generateToken from "../Utis/generateToken.js";

//Register user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const { error } = userValidation.validate({ name, email, password });
        if (error) return res.status(400).json({ message: error.details[0].message });
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = await User.create({
            name,
            email,
            password
        });
        const token = generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(201).json({ message: "User registered successfully", token, user: {
            _id: user._id,
            name: user.name,
            email: user.email
        } });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

//Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { error } = loginValidation.validate({ email, password });
        if (error) return res.status(400).json({ message: error.details[0].message });
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid Email" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Password" });
        }
        const token = generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: "Login successful", token, user: {
            _id: user._id,
            name: user.name,
            email: user.email
        } });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

//Logout user
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}