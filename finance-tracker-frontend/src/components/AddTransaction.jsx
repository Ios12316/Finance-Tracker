import React, { useState } from "react";
import { PlusCircle, Calendar, Tag, FileText, Banknote } from "lucide-react";
import api from "../services/axios.js";
import { useNotificationStore } from "../store/useNotificationStore";

export default function AddTransaction({ refresh }) {
  const { addNotification } = useNotificationStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { amount, category, date } = formData;
    if (!amount || !category || !date) {
      addNotification("Please fill in all required fields", "warning");
      return;
    }

    setLoading(false);
    try {
      const token = localStorage.getItem("token");
      await api.post("/transactions", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      addNotification("Transaction saved successfully", "success");
      setFormData({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      refresh();
    } catch (error) {
      console.error(error);
      addNotification(
        error.response?.data?.message || "Failed to save transaction.",
        "error"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm space-y-4 transition-colors duration-300"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
          <PlusCircle className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Add Transaction
        </h2>
      </div>

      {/* Type Selector */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, type: "income" })}
          className={`py-2 px-4 rounded-xl text-sm font-bold border transition-all duration-200 ${
            formData.type === "income"
              ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          }`}
        >
          Income
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, type: "expense" })}
          className={`py-2 px-4 rounded-xl text-sm font-bold border transition-all duration-200 ${
            formData.type === "expense"
              ? "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400"
              : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          }`}
        >
          Expense
        </button>
      </div>

      {/* Amount Input */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Amount (₦)
        </label>
        <div className="relative group">
          <Banknote className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="number"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          />
        </div>
      </div>

      {/* Category Input */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Category
        </label>
        <div className="relative group">
          <Tag className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="e.g. Food, Rent, Salary"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          />
        </div>
      </div>

      {/* Date Input */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Date
        </label>
        <div className="relative group">
          <Calendar className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          />
        </div>
      </div>

      {/* Description Input */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Description (Optional)
        </label>
        <div className="relative group">
          <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors" />
          <textarea
            placeholder="Add brief details..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="2"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/25 transition-all duration-200 scale-100 active:scale-[0.98] text-sm"
      >
        {loading ? "Saving..." : "Save Transaction"}
      </button>
    </form>
  );
}
