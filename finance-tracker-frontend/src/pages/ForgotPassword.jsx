import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, KeyRound, ArrowRight, ArrowLeft } from "lucide-react";
import api from "../services/axios.js";
import { useNotificationStore } from "../store/useNotificationStore";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [devLink, setDevLink] = useState("");
  const { addNotification } = useNotificationStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      addNotification("Please enter your email address", "warning");
      return;
    }

    setLoading(true);
    setDevLink("");
    try {
      const response = await api.post("/user/forgot-password", { email });
      addNotification(response.data.message, "success");
      
      // If server returned a devLink (because SMTP is not configured)
      if (response.data.devLink) {
        setDevLink(response.data.devLink);
      }
    } catch (error) {
      console.error(error);
      addNotification(
        error.response?.data?.message || "Something went wrong. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 px-4 transition-colors duration-300">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-400/10 dark:bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="w-full max-w-md bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl shadow-xl z-10"
      >
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to login
          </Link>
        </div>

        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-12 h-12 rounded-2xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/20"
          >
            <KeyRound className="w-6 h-6" />
          </motion.div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Forgot Password?
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            No worries! Enter your email to receive a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-550 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/15 dark:shadow-none hover:shadow-indigo-500/20 transition-all duration-200 scale-100 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none text-sm"
          >
            {loading ? "Sending..." : "Send Reset Link"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Development Helper link if SMTP is not set up */}
        {devLink && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200/30 dark:border-yellow-900/30 rounded-2xl text-xs"
          >
            <p className="font-bold text-yellow-850 dark:text-yellow-450 mb-1">🔧 Development Mode Sandbox:</p>
            <p className="text-slate-650 dark:text-slate-400 mb-2.5">
              SMTP variables are not configured in your backend `.env` file, so the link was generated and logged to the server console. Click below to reset:
            </p>
            <Link
              to={`/reset-password/${devLink.split("/").pop()}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-yellow-105 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/80 text-yellow-800 dark:text-yellow-300 font-bold rounded-xl transition-colors"
            >
              Go to Reset Form
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
