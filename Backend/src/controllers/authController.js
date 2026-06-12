import User from "../models/User.js";
import { userValidation, loginValidation } from "../validation/userValidation.js";
import bcrypt from "bcryptjs";
import generateToken from "../Utis/generateToken.js";
import crypto from "crypto";
import sendEmail from "../Utis/sendEmail.js";

//Register user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const { error } = userValidation.validate({ name, email, password });
        if (error) return res.status(400).json({ message: error.details[0].message });
        const normalizedEmail = email ? email.toLowerCase().trim() : "";
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = await User.create({
            name,
            email: normalizedEmail,
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
        console.error("Register Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { error } = loginValidation.validate({ email, password });
        if (error) return res.status(400).json({ message: error.details[0].message });
        const normalizedEmail = email ? email.toLowerCase().trim() : "";
        const user = await User.findOne({ email: normalizedEmail });
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
        console.error("Login Error:", error);
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
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Forgot Password - Send Reset Link
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Please provide an email address" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ message: "No user found with that email address" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");

        // Hash token and set to user model
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        // Create reset URL pointing to frontend
        const origin = process.env.CLIENT_URL || req.headers.origin || process.env.FRONTEND_URL || "https://iosledger.vercel.app";
        const resetUrl = `${origin}/reset-password/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) requested a password reset for your account on IOS Ledger.
Please click the link below to set a new password:

${resetUrl}

If you did not request this reset, please ignore this email and your password will remain unchanged.
This link will expire in 10 minutes.`;

        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #1e3a8a; text-align: center;">IOS Ledger Password Reset</h2>
            <p>Hello,</p>
            <p>You requested a password reset for your IOS Ledger account. Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Reset Password</a>
            </div>
            <p>If the button doesn't work, copy and paste the following link into your web browser:</p>
            <p style="word-break: break-all; color: #64748b; font-size: 13px;">${resetUrl}</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="font-size: 11px; color: #94a3b8; text-align: center;">This link will expire in 10 minutes. If you did not request this, you can ignore this email.</p>
          </div>
        `;

        try {
            const result = await sendEmail({
                email: user.email,
                subject: "IOS Ledger Password Reset Request",
                message,
                html
            });

            res.status(200).json({
                message: result.logged 
                    ? "Reset link generated successfully (Logged to server console in dev mode)" 
                    : "Password reset link sent to your email",
                devLink: result.logged ? resetUrl : undefined
            });
        } catch (err) {
            console.error(err);
            user.resetPasswordToken = null;
            user.resetPasswordExpire = null;
            await user.save();
            return res.status(500).json({ message: "Email could not be sent" });
        }

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Reset Password - Verify Token & Save New Password
export const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: "Please provide a new password" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Hash token from params
        const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;

        await user.save();

        res.status(200).json({ message: "Password reset successful. You can now log in with your new password." });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}