import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useNotificationStore } from "../store/useNotificationStore";

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
  error: <XCircle className="w-5 h-5 text-rose-500 shrink-0" />,
  info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
};

const borderColors = {
  success: "border-emerald-500/20 dark:border-emerald-500/10",
  error: "border-rose-500/20 dark:border-rose-500/10",
  info: "border-sky-500/20 dark:border-sky-500/10",
  warning: "border-amber-500/20 dark:border-amber-500/10",
};

const bgColors = {
  success: "bg-emerald-50/95 dark:bg-emerald-950/20",
  error: "bg-rose-50/95 dark:bg-rose-950/20",
  info: "bg-sky-50/95 dark:bg-sky-950/20",
  warning: "bg-amber-50/95 dark:bg-amber-950/20",
};

export default function NotificationContainer() {
  const { notifications, dismissNotification } = useNotificationStore();

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {notifications.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md ${bgColors[toast.type]} ${borderColors[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200 break-words pr-2">
              {toast.message}
            </div>
            <button
              onClick={() => dismissNotification(toast.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
