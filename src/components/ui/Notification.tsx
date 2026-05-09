import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import React from 'react';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

export const Notification = ({ message, type, onClose }: NotificationProps) => {
  const icons = {
    success: <CheckCircle className="text-green-400" size={20} />,
    error: <AlertCircle className="text-red-400" size={20} />,
    info: <Info className="text-blue-400" size={20} />,
  };

  const bgColors = {
    success: 'hsla(142, 70%, 50%, 0.1)',
    error: 'hsla(0, 70%, 50%, 0.1)',
    info: 'hsla(210, 70%, 50%, 0.1)',
  };

  const borderColors = {
    success: 'hsla(142, 70%, 50%, 0.3)',
    error: 'hsla(0, 70%, 50%, 0.3)',
    info: 'hsla(210, 70%, 50%, 0.3)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="glass notification-card"
      style={{
        background: bgColors[type],
        borderColor: borderColors[type],
      }}
    >
      <div className="flex items-center gap-3">
        {icons[type]}
        <p className="message-text">{message}</p>
      </div>
      <button onClick={onClose} className="close-btn">
        <X size={16} />
      </button>
    </motion.div>
  );
};

export const NotificationContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="notification-container">
      <AnimatePresence>
        {children}
      </AnimatePresence>
    </div>
  );
};
