import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import type { Notification } from "../types/notification";
import { motion, AnimatePresence } from "framer-motion";
import { eventBus } from "../lib/eventBus";
import { Bell, Check, Loader2, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface NotificationListProps {
  embedded?: boolean;
}

const NotificationList = ({ embedded = false }: NotificationListProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5001/api/notifications", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await response.json();
      if (response.ok) setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchNotifications();
    const unsubscribe = eventBus.subscribe(
      "NOTIFICATION_RECEIVED",
      (newNotification: Notification) => {
        setNotifications((prev) => [newNotification, ...prev]);
      },
    );
    return () => unsubscribe();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
      await fetch(`http://localhost:5001/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div
      className={
        embedded ? "" : "bg-card border border-border p-4 rounded-xl shadow-sm"
      }
    >
      {!embedded && (
        <h3 className="text-xl font-black italic tracking-tighter mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5" /> In-App Updates
        </h3>
      )}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {notifications.map((notification) => (
            <motion.div
              layout
              key={notification._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0 }}
              onClick={() => handleNotificationClick(notification)}
              className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${
                notification.read
                  ? "bg-muted/10 border-border/50 opacity-60"
                  : "bg-card border-primary/20 shadow-sm hover:border-primary/40"
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p
                      className={`text-sm leading-tight ${
                        notification.read ? "font-medium" : "font-bold"
                      }`}
                    >
                      {notification.message}
                    </p>
                    {notification.link && (
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {!notification.read && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification._id);
                    }}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {notifications.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-xl">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
              No new notifications
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
