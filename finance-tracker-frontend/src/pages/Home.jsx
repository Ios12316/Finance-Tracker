import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Shield, 
  BarChart3, 
  ArrowRight, 
  Wallet, 
  PlusCircle, 
  ListFilter 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-60 -right-20 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <motion.div 
          className="container mx-auto px-6 relative z-10 text-center max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6 shadow-sm"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Your Personal Finance Command Center
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 dark:from-white dark:via-blue-200 dark:to-slate-200 bg-clip-text text-transparent"
          >
            IOS Ledger
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-4 max-w-2xl mx-auto leading-relaxed"
          >
            Track income, manage expenses, visualize spending patterns, and take control of your financial future.
          </motion.p>

          <motion.p 
            variants={itemVariants}
            className="text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400 mb-8"
          >
            Built by IOS Continental Ltd.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {user ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 dark:shadow-none hover:shadow-indigo-500/30 transition-all duration-200 scale-100 hover:scale-[1.02] active:scale-[0.98]"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 dark:shadow-none hover:shadow-indigo-500/30 transition-all duration-200 scale-100 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80 text-slate-800 dark:text-white font-semibold rounded-xl border border-slate-200 dark:border-slate-800 transition-colors duration-200"
                >
                  Log In
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/40 border-t border-b border-slate-100 dark:border-slate-800/50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Everything You Need to Succeed</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Unlock powerful finance features that help you track, analyze, and optimize every single transaction.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -8 }}
              className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Tracking</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                Log income and expenses seamlessly with categorized details, exact timestamps, and dynamic calculations.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -8 }}
              className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Interactive Charts</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                Visualize income vs. expenses instantly with rich graphical views to understand your spending breakdown.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -8 }}
              className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Safe & Secure</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                Your credentials and transactions are encrypted, keeping your personal financial footprint safe and private.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visual Demo Info */}
      <section className="py-20 container mx-auto px-6 max-w-5xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900/60 dark:to-indigo-900/60 rounded-3xl p-8 lg:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
          <div className="relative z-10 max-w-md">
            <h2 className="text-3xl font-extrabold mb-4 leading-tight">Ready to master your budget?</h2>
            <p className="text-blue-100 mb-0">
              Join thousands of users organizing their everyday finances. Create a free account in 30 seconds.
            </p>
          </div>
          <div className="relative z-10 shrink-0 w-full md:w-auto">
            {user ? (
              <Link
                to="/dashboard"
                className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white text-blue-600 font-bold rounded-xl shadow hover:bg-blue-50 transition-colors duration-200"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white text-blue-600 font-bold rounded-xl shadow hover:bg-blue-50 transition-colors duration-200"
              >
                Sign Up Now
              </Link>
            )}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-6 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-900 space-y-3">
        <p className="max-w-md mx-auto leading-relaxed">
          IOS Ledger is a financial management platform developed and maintained by IOS Continental Ltd.
        </p>
        <p>
          &copy; 2026 IOS Continental Ltd. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
