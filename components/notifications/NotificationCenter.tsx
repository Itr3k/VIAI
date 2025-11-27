import React, { useState } from 'react';
import { Bell, X, Check, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { Notification } from '../../types';

// Mock Data
const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'n1',
        title: 'System Maintenance',
        message: 'Scheduled maintenance tonight at 2 AM EST.',
        type: 'info',
        targetAudience: 'global',
        createdAt: new Date().toISOString(),
        read: false
    },
    {
        id: 'n2',
        title: 'New Feature: Global Search',
        message: 'You can now search across all calls and reports.',
        type: 'success',
        targetAudience: 'global',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        read: true
    }
];

const NotificationCenter: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative"
            >
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                )}
                <Bell className="w-6 h-6" />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-fade-in">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm">
                                    No notifications
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-slate-50 transition-colors relative group ${notification.read ? 'opacity-75' : 'bg-blue-50/30'}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`mt-1 shrink-0 ${notification.type === 'warning' ? 'text-amber-500' :
                                                        notification.type === 'success' ? 'text-green-500' :
                                                            notification.type === 'error' ? 'text-red-500' :
                                                                'text-blue-500'
                                                    }`}>
                                                    {notification.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                                                    {notification.type === 'success' && <CheckCircle className="w-4 h-4" />}
                                                    {notification.type === 'error' && <AlertTriangle className="w-4 h-4" />}
                                                    {notification.type === 'info' && <Info className="w-4 h-4" />}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className={`text-sm font-medium ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 mt-2">
                                                        {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="absolute top-4 right-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Mark as read"
                                                    >
                                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationCenter;
