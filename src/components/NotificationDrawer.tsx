import React from 'react';
import { Notification } from '../types';
import { Bell, CheckCheck, X, MessageSquareText, Calendar, Shield, Users } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">System Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action controls */}
        <div className="px-5 py-2.5 bg-slate-100/60 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">
            {notifications.filter((n) => !n.read).length} unread alerts
          </span>
          <button
            onClick={onMarkAllRead}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        </div>

        {/* Notifications list */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          {notifications.map((n) => {
            let icon = <Bell className="w-4 h-4 text-indigo-500" />;
            if (n.type === 'enquiry') icon = <MessageSquareText className="w-4 h-4 text-blue-500" />;
            if (n.type === 'appointment') icon = <Calendar className="w-4 h-4 text-emerald-500" />;
            if (n.type === 'student') icon = <Users className="w-4 h-4 text-amber-500" />;

            return (
              <div
                key={n.id}
                className={`p-4 rounded-xl border text-xs space-y-1 transition-all ${
                  !n.read
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/50 font-medium'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span className="flex items-center gap-2">
                    {icon} {n.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">{n.timestamp}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-6">
                  {n.message}
                </p>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl w-full"
          >
            Close Notifications
          </button>
        </div>

      </div>
    </div>
  );
};
