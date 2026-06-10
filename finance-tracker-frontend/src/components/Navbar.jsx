import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, Menu, X, Wallet, LogOut, LayoutDashboard, UserPlus, LogIn, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotificationStore } from "../store/useNotificationStore";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      addNotification("Dark mode enabled", "info", 1500);
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      addNotification("Light mode enabled", "info", 1500);
    }
  };

  const handleLogout = () => {
    logout();
    addNotification("Logged out successfully", "success");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
      isActive(path)
        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
    }`;

  const mobileLinkClass = (path) =>
    `flex items-center gap-2.5 p-3.5 rounded-xl text-base font-semibold transition-all duration-200 ${
      isActive(path)
        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
        : "text-slate-600 hover:text-slate-950/50 dark:text-slate-300 dark:hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-200">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-blue-950 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
              IOS Ledger
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <a href="/" className={linkClass("/")}>
              <Home className="w-4 h-4" />
              Home
            </a>

            {user ? (
              <>
                <Link to="/dashboard" className={linkClass("/dashboard")}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={linkClass("/login")}>
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link to="/register" className={linkClass("/register")}>
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </>
            )}

            {/* Divider */}
            <span className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-2" />

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 focus:outline-none"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
          </div>

          {/* Mobile Right Bar */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 px-4 pt-3 pb-4 space-y-1 shadow-inner">
          <a
            href="/"
            onClick={() => setIsOpen(false)}
            className={mobileLinkClass("/")}
          >
            <Home className="w-4.5 h-4.5" />
            Home
          </a>

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className={mobileLinkClass("/dashboard")}
              >
                <LayoutDashboard className="w-4.5 h-4.5" />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-left flex items-center gap-2.5 p-3.5 rounded-xl text-base font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20 transition-all duration-200"
              >
                <LogOut className="w-4.5 h-4.5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className={mobileLinkClass("/login")}
              >
                <LogIn className="w-4.5 h-4.5" />
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className={mobileLinkClass("/register")}
              >
                <UserPlus className="w-4.5 h-4.5" />
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
