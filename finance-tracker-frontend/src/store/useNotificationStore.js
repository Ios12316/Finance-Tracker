import { create } from "zustand";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  
  addNotification: (message, type = "info", duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    set((state) => ({
      notifications: [...state.notifications, { id, message, type, duration }],
    }));
    
    if (duration > 0) {
      setTimeout(() => {
        get().dismissNotification(id);
      }, duration);
    }
    
    return id;
  },
  
  dismissNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));
