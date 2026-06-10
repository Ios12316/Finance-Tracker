import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Trash2, Calendar, Folder, MessageSquare, AlertCircle, Pencil, X } from "lucide-react";
import api from "../services/axios.js";
import { useNotificationStore } from "../store/useNotificationStore";

export default function TransactionList({ refreshKey, refresh }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotificationStore();
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, [refreshKey]);

  const handleEditClick = (transaction) => {
    setEditingTransaction({
      _id: transaction._id,
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description || "",
      date: new Date(transaction.date).toISOString().split("T")[0],
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const { _id, type, amount, category, description, date } = editingTransaction;
    if (!amount || !category || !date) {
      addNotification("Please fill in all required fields", "warning");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.put(`/transactions/${_id}`, {
        type,
        amount: Number(amount),
        category,
        description,
        date,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      addNotification("Transaction updated successfully", "success");
      setEditingTransaction(null);
      if (refresh) refresh();
      else fetchTransactions();
    } catch (error) {
      console.error(error);
      addNotification(
        error.response?.data?.message || "Failed to update transaction",
        "error"
      );
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(res.data.transactions || []);
    } catch (error) {
      console.error(error);
      addNotification("Failed to load transactions", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      addNotification("Transaction deleted", "success");
      // Call parent refresh to update list and totals
      if (refresh) refresh();
      else fetchTransactions();
    } catch (error) {
      console.error(error);
      addNotification("Failed to delete transaction", "error");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm transition-colors duration-300 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Recent Transactions
        </h2>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
          {transactions.length} Total
        </span>
      </div>

      {loading && transactions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm">Loading transactions...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-150 dark:border-slate-800 rounded-2xl text-slate-400">
          <AlertCircle className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-450">No transactions found</p>
          <p className="text-xs text-slate-450 mt-1">Add a new transaction above to get started.</p>
        </div>
      ) : (
        <>
          {/* Mobile Card Layout (visible on small screens only) */}
          <div className="sm:hidden space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex flex-col gap-3 relative"
              >
                {/* Header info */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        transaction.type === "income"
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                    </span>
                    <span className="text-sm font-semibold capitalize text-slate-700 dark:text-slate-300">
                      {transaction.category}
                    </span>
                  </span>
                  <span className={`text-base font-bold ${
                    transaction.type === "income"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}>
                    {transaction.type === "income" ? "+" : "-"}₦
                    {Number(transaction.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Date and Description */}
                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {new Date(transaction.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  {transaction.description && (
                    <div className="flex items-start gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="break-all text-slate-600 dark:text-slate-400">{transaction.description}</span>
                    </div>
                  )}
                </div>

                {/* Action buttons (fully visible on mobile) */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-2 mt-1">
                  <button
                    onClick={() => handleEditClick(transaction)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30 rounded-lg transition-colors focus:outline-none"
                    title="Edit transaction"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(transaction._id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 rounded-lg transition-colors focus:outline-none"
                    title="Delete transaction"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden sm:block overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <th className="pb-3.5 pl-2">Type</th>
                  <th className="pb-3.5">Category</th>
                  <th className="pb-3.5 hidden sm:table-cell">Date</th>
                  <th className="pb-3.5 hidden md:table-cell">Description</th>
                  <th className="pb-3.5 text-right">Amount</th>
                  <th className="pb-3.5 text-center pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* Type */}
                    <td className="py-4 pl-2">
                      <span className="flex items-center gap-2.5">
                        <span
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            transaction.type === "income"
                              ? "bg-emerald-55 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                              : "bg-rose-55 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowUpRight className="w-4.5 h-4.5" />
                          ) : (
                            <ArrowDownLeft className="w-4.5 h-4.5" />
                          )}
                        </span>
                        <span className="text-sm font-semibold capitalize text-slate-700 dark:text-slate-355">
                          {transaction.type}
                        </span>
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-4 text-sm font-medium text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Folder className="w-4 h-4 text-slate-450 shrink-0" />
                        {transaction.category}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 text-sm text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        {new Date(transaction.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-4 text-sm text-slate-500 dark:text-slate-400 hidden md:table-cell max-w-xs truncate">
                      <div className="flex items-center gap-1.5">
                        {transaction.description ? (
                          <>
                            <MessageSquare className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="truncate">{transaction.description}</span>
                          </>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-700 italic">No description</span>
                        )}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className={`py-4 text-sm font-bold text-right ${
                      transaction.type === "income"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}>
                      {transaction.type === "income" ? "+" : "-"}₦
                      {Number(transaction.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 text-center pr-2">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEditClick(transaction)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors focus:outline-none opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:focus:opacity-100"
                          title="Edit transaction"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors focus:outline-none opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:focus:opacity-100"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Edit Modal Overlay */}
      {editingTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 w-full max-w-md shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Edit Transaction
              </h3>
              <button
                onClick={() => setEditingTransaction(null)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {/* Type Selector */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTransaction({ ...editingTransaction, type: "income" })}
                  className={`py-2 px-4 rounded-xl text-sm font-bold border transition-all duration-200 ${
                    editingTransaction.type === "income"
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                      : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTransaction({ ...editingTransaction, type: "expense" })}
                  className={`py-2 px-4 rounded-xl text-sm font-bold border transition-all duration-200 ${
                    editingTransaction.type === "expense"
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
                <input
                  type="number"
                  placeholder="0.00"
                  value={editingTransaction.amount}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                />
              </div>

              {/* Category Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Food, Rent, Salary"
                  value={editingTransaction.category}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                />
              </div>

              {/* Date Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Date
                </label>
                <input
                  type="date"
                  value={editingTransaction.date}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Add brief details..."
                  value={editingTransaction.description}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none font-medium"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTransaction(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all duration-200 scale-100 active:scale-[0.98] text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/25 transition-all duration-200 scale-100 active:scale-[0.98] text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
