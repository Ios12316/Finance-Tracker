import React from "react";
import { Wallet } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-350 border-t border-slate-800 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-2">
            <a href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-200">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                IOS Ledger
              </span>
            </a>
            <p className="text-sm leading-relaxed max-w-sm">
              IOS Ledger is a financial management platform developed and maintained by IOS Continental Ltd. Track income, manage expenses, and optimize your wealth.
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/" className="hover:text-white transition-colors duration-150">Home</a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-white transition-colors duration-150">Dashboard</a>
              </li>
              <li>
                <a href="/support" className="hover:text-white transition-colors duration-150">Help & Support</a>
              </li>
              <li>
                <a href="/login" className="hover:text-white transition-colors duration-150">Login</a>
              </li>
              <li>
                <a href="/register" className="hover:text-white transition-colors duration-150">Register</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} IOS Continental Ltd. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
