import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, User, MessageSquare, HelpCircle, Send, Info, FileText } from "lucide-react";
import api from "../services/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNotificationStore } from "../store/useNotificationStore";

export default function Support() {
  const { user } = useAuth();
  const { addNotification } = useNotificationStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-fill fields if user is logged in
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      addNotification("Please fill in all required fields", "warning");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/support/contact", {
        name,
        email,
        subject,
        message,
      });

      addNotification(response.data.message, "success");
      
      // Clear message and subject but keep name/email
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error(error);
      addNotification(
        error.response?.data?.message || "Failed to send message. Please try again later.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 px-4 py-12 transition-colors duration-300">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-400/10 dark:bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 z-10">
        
        {/* Info Column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="md:col-span-5 flex flex-col justify-between p-8 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-violet-600/20 pointer-events-none z-0" />
          
          <div className="relative z-10 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-blue-400" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight">How can we help?</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Have questions about IOS Ledger? Drop us a message, and our team will get back to you as soon as possible.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Support Email</p>
                  <a href="mailto:idowus187@gmail.com" className="text-sm hover:text-blue-400 transition-colors">idowus187@gmail.com</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Response Time</p>
                  <p className="text-sm text-slate-350">Typically within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 md:mt-0 pt-6 border-t border-slate-800 text-xs text-slate-500">
            &copy; {new Date().getFullYear()} IOS Continental Ltd. All rights reserved.
          </div>
        </motion.div>

        {/* Form Column */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="md:col-span-7 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl shadow-xl"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send a Message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Your Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-550 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Subject Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Subject
              </label>
              <div className="relative group">
                <FileText className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Account help, billing, bug report..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* Message Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Message <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <MessageSquare className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <textarea
                  placeholder="Tell us what you need assistance with..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/15 dark:shadow-none hover:shadow-indigo-500/20 transition-all duration-200 scale-100 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? "Sending Message..." : "Send Message"}
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>

      </div>
    </div>
  );
}
