import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Notification } from '../types/notification';
import { motion, AnimatePresence } from 'framer-motion';
import { eventBus } from '../lib/eventBus';

const NotificationList = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    
    // Subscribe to real-time events
    const unsubscribe = eventBus.subscribe('NOTIFICATION_RECEIVED', (newNotification: Notification) => {
      setNotifications(prev => [newNotification, ...prev]);
    });

    return () => unsubscribe();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div className="bg-card text-card-foreground border border-border p-4 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Notifications</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              layout
              key={notification._id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                notification.read 
                  ? 'bg-muted/30 border-border opacity-60' 
                  : 'bg-background border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
              onClick={() => !notification.read && markAsRead(notification._id)}
            >
              <p className="text-sm font-bold leading-tight mb-1">{notification.message}</p>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                {new Date(notification.createdAt).toLocaleDateString()}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {notifications.length === 0 && (
          <p className="text-muted-foreground text-center py-8 text-sm italic">No new activity.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
