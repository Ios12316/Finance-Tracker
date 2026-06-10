import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Calendar, 
  Sparkles, 
  ArrowUpRight,
  TrendingUp as IconIncome,
  TrendingDown as IconExpense,
  Scale as IconBalance,
  Activity,
  Download,
  FileText,
  Percent
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import AddTransaction from "../components/AddTransaction";
import TransactionList from "../components/TransactionList";
import api from "../services/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNotificationStore } from "../store/useNotificationStore";

export default function Dashboard() {
  const { user } = useAuth();
  const { addNotification } = useNotificationStore();
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [refreshKey]);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/transactions", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error(error);
      addNotification("Failed to fetch transactions", "error");
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Filter transactions based on selected month & year
  const filteredTransactions = transactions.filter((t) => {
    if (selectedMonth === "all") return true;
    const d = new Date(t.date);
    return d.getUTCMonth() === selectedMonth && d.getUTCFullYear() === selectedYear;
  });

  // Calculate all-time summaries for Current Balance
  const allTimeSummary = transactions.reduce(
    (acc, t) => {
      const amt = Number(t.amount) || 0;
      if (t.type === "income") {
        acc.income += amt;
      } else {
        acc.expense += amt;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );
  const currentBalance = allTimeSummary.income - allTimeSummary.expense;

  // Calculate summaries based on filtered list (Monthly Stats)
  const summary = filteredTransactions.reduce(
    (acc, t) => {
      const amt = Number(t.amount) || 0;
      if (t.type === "income") {
        acc.income += amt;
      } else {
        acc.expense += amt;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );
  summary.balance = summary.income - summary.expense;
  summary.totalTransactions = filteredTransactions.length;

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      addNotification("No transactions to export", "warning");
      return;
    }
    const headers = ["Type", "Category", "Date", "Description", "Amount (₦)"];
    const rows = filteredTransactions.map(t => [
      t.type,
      t.category,
      new Date(t.date).toLocaleDateString(),
      t.description || "",
      t.amount
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ios_ledger_transactions_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification("CSV export started", "success");
  };

  const handleExportPDF = () => {
    if (filteredTransactions.length === 0) {
      addNotification("No transactions to export", "warning");
      return;
    }
    const printWindow = window.open("", "_blank");
    const monthName = selectedMonth === "all" ? "All Time" : new Date(2000, selectedMonth).toLocaleString(undefined, { month: 'long' });
    const periodStr = selectedMonth === "all" ? "All Time" : `${monthName} ${selectedYear}`;

    const htmlContent = `
      <html>
        <head>
          <title>IOS Ledger Report - ${periodStr}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; }
            .header-container { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            h1 { margin: 0; color: #1e3a8a; font-size: 28px; font-weight: 800; }
            .subtitle { margin: 5px 0 0 0; font-size: 14px; color: #64748b; }
            .report-info { text-align: right; font-size: 12px; color: #64748b; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px 16px; text-align: left; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
            th { background-color: #f8fafc; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
            .amount-income { color: #10b981; font-weight: 700; }
            .amount-expense { color: #f43f5e; font-weight: 700; }
            .summary-box { display: flex; gap: 20px; margin-bottom: 30px; }
            .summary-item { border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; flex: 1; background-color: #f8fafc; }
            .summary-label { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; }
            .summary-value { font-size: 20px; font-weight: 800; margin-top: 6px; }
            .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; font-size: 11px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="header-container">
            <div>
              <h1>IOS Ledger</h1>
              <p class="subtitle">Financial Report - ${periodStr}</p>
            </div>
            <div class="report-info">
              <div><strong>Generated by:</strong> ${user?.name || 'User'}</div>
              <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
            </div>
          </div>
          <div class="summary-box">
            <div class="summary-item">
              <div class="summary-label">Total Income</div>
              <div class="summary-value" style="color: #10b981">₦${Number(summary.income).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Total Expenses</div>
              <div class="summary-value" style="color: #f43f5e">₦${Number(summary.expense).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Net Balance</div>
              <div class="summary-value" style="color: ${summary.balance >= 0 ? '#1e3a8a' : '#f43f5e'}">₦${Number(summary.balance).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions.map(t => `
                <tr>
                  <td>${new Date(t.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td style="text-transform: capitalize; font-weight: 600;">${t.type}</td>
                  <td>${t.category}</td>
                  <td>${t.description || "-"}</td>
                  <td style="text-align: right;" class="${t.type === 'income' ? 'amount-income' : 'amount-expense'}">
                    ${t.type === 'income' ? '+' : '-'}₦${Number(t.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="footer">
            IOS Ledger is a financial management platform developed and maintained by IOS Continental Ltd.
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
    addNotification("PDF report generated", "success");
  };

  // Prepare data for Pie Chart
  const chartData = [
    { name: "Income", value: summary.income, color: "#10b981" },
    { name: "Expense", value: summary.expense, color: "#f43f5e" }
  ].filter(item => item.value > 0);

  const hasChartData = chartData.length > 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  // Savings rate calculation
  const savingsRate = summary.income > 0 ? ((summary.balance / summary.income) * 100).toFixed(0) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              Financial Overview
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-2 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-350 bg-clip-text text-transparent">
              Hello, {user?.name || "User"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-450 mt-1">
              Here's what's happening with your funds today.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 shadow-sm transition-colors">
            <Calendar className="w-4.5 h-4.5 text-slate-400" />
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Filters & Export Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-2xl shadow-sm transition-colors duration-300">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Month
              </span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Months</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(2000, i).toLocaleString(undefined, { month: "long" })}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Year
              </span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const yr = new Date().getFullYear() - 3 + i;
                  return (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Exports */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm transition-all active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/10 hover:shadow-blue-500/25 transition-all active:scale-[0.98]"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {/* Current Balance Card */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -4 }}
            className={`relative overflow-hidden border p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 ${
              currentBalance >= 0 
                ? "bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/60" 
                : "bg-rose-50/20 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/40"
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Current Balance</span>
              <span className={`p-2.5 rounded-2xl ${
                currentBalance >= 0 
                  ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400" 
                  : "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400"
              }`}>
                <Wallet className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4">
              <span className={`text-2xl lg:text-3xl font-black ${
                currentBalance >= 0 ? "text-slate-900 dark:text-white" : "text-rose-600 dark:text-rose-400"
              }`}>
                ₦{Number(currentBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className={`mt-2 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${
              currentBalance >= 0 
                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" 
                : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
            }`}>
              <Activity className="w-3.5 h-3.5" />
              {currentBalance >= 0 ? "Available Funds" : "Overdrawn"}
            </div>
          </motion.div>

          {/* Monthly Income Card */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -4 }}
            className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Monthly Income</span>
              <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                <IconIncome className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4">
              <span className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">
                ₦{Number(summary.income).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit">
              <TrendingUp className="w-3.5 h-3.5" />
              Cash Inflow active
            </div>
          </motion.div>

          {/* Monthly Expenses Card */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -4 }}
            className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Monthly Expenses</span>
              <span className="p-2.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-2xl">
                <IconExpense className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4">
              <span className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">
                ₦{Number(summary.expense).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full w-fit">
              <TrendingDown className="w-3.5 h-3.5" />
              Cash Outflow active
            </div>
          </motion.div>

          {/* Monthly Net Income Card */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -4 }}
            className={`relative overflow-hidden border p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 ${
              summary.balance >= 0 
                ? "bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/60" 
                : "bg-rose-50/20 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/40"
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Monthly Net Income</span>
              <span className={`p-2.5 rounded-2xl ${
                summary.balance >= 0 
                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" 
                  : "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400"
              }`}>
                <IconBalance className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4">
              <span className={`text-2xl lg:text-3xl font-black ${
                summary.balance >= 0 ? "text-slate-900 dark:text-white" : "text-rose-600 dark:text-rose-400"
              }`}>
                ₦{Number(summary.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className={`mt-2 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${
              summary.balance >= 0 
                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" 
                : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
            }`}>
              <Activity className="w-3.5 h-3.5" />
              {summary.balance >= 0 ? "Net Surplus" : "Net Deficit"}
            </div>
          </motion.div>

          {/* Savings Rate Card */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -4 }}
            className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Savings Rate</span>
              <span className="p-2.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-2xl">
                <Percent className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4">
              <span className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">
                {savingsRate}%
              </span>
            </div>
            <div className={`mt-2 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${
              savingsRate >= 20 
                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" 
                : savingsRate > 0 
                ? "text-blue-600 dark:text-blue-400 bg-blue-500/10" 
                : "text-slate-500 dark:text-slate-400 bg-slate-500/10"
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              {savingsRate >= 20 ? "Target Met" : savingsRate > 0 ? "Building" : "No Savings"}
            </div>
          </motion.div>
        </motion.div>

        {/* Analytics Section & Chart */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chart Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-3xl shadow-sm transition-colors duration-300 flex flex-col justify-between min-h-[300px]">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Analytics</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Visual representation of income and expenses</p>
            </div>

            {hasChartData ? (
              <div className="flex-1 grid md:grid-cols-5 items-center gap-6 mt-4">
                <div className="md:col-span-3 h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`₦${Number(value).toLocaleString()}`, "Amount"]}
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                          borderRadius: '12px',
                          border: 'none',
                          color: '#fff',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="md:col-span-2 space-y-4 pr-4">
                  {chartData.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1 p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.name}</span>
                      </div>
                      <span className="text-base font-bold text-slate-850 dark:text-slate-150">
                        {((item.value / (summary.income + summary.expense)) * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400">
                <p className="text-sm font-semibold">No transaction data available for plotting</p>
                <p className="text-xs text-slate-450 mt-1">Please insert a transaction to load the visual breakdown.</p>
              </div>
            )}
          </div>

          {/* Budget Insight Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-3xl shadow-sm transition-colors duration-300 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Savings Rate</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Portion of income saved this period</p>
            </div>
            
            <div className="my-6 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                  {savingsRate}%
                </span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Target: 20%
                </span>
              </div>
              
              {/* Custom progress bar */}
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    savingsRate >= 20 ? "bg-emerald-500" : savingsRate > 0 ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-700"
                  }`} 
                  style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/40 dark:border-blue-900/30 rounded-2xl">
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {savingsRate >= 20 
                  ? "Outstanding! You are exceeding the standard 50-30-20 budget recommendation. Keep allocating your surplus to savings or investments."
                  : savingsRate > 0 
                  ? "Good start. Try to reduce discretionary expenses or optimize subscriptions to push your savings rate above 20%."
                  : "No savings calculated yet. Log income and limit expenses to build your cash reserve."}
              </p>
            </div>
          </div>
        </div>

        {/* Input & List split grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div>
            <AddTransaction refresh={refresh} />
          </div>
          <div className="lg:col-span-2">
            <TransactionList refreshKey={refreshKey} refresh={refresh} />
          </div>
        </div>

      </div>
    </div>
  );
}