import React, { useState } from 'react';
import { Send, Users, Globe, Building } from 'lucide-react';
import { UserRole } from '../../types';

interface NotificationManagerProps {
    userRole: UserRole;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ userRole }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [audience, setAudience] = useState<'global' | 'agency' | 'user'>('global');
    const [type, setType] = useState<'info' | 'warning' | 'success'>('info');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Notification Sent!\nTarget: ${audience}\nTitle: ${title}`);
        setTitle('');
        setMessage('');
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                    <Send className="w-5 h-5 mr-2 text-slate-500" />
                    Broadcast Notification
                </h3>
                <p className="text-sm text-slate-500 mt-1">Send system-wide or targeted alerts to users.</p>
            </div>

            <div className="p-6">
                <form onSubmit={handleSend} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
                            <div className="grid grid-cols-3 gap-3">
                                {userRole === 'super_admin' && (
                                    <button
                                        type="button"
                                        onClick={() => setAudience('global')}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border ${audience === 'global' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        <Globe className="w-5 h-5 mb-1" />
                                        <span className="text-xs font-medium">Global</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setAudience('agency')}
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg border ${audience === 'agency' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    <Building className="w-5 h-5 mb-1" />
                                    <span className="text-xs font-medium">{userRole === 'super_admin' ? 'Specific Agency' : 'My Agency'}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAudience('user')}
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg border ${audience === 'user' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    <Users className="w-5 h-5 mb-1" />
                                    <span className="text-xs font-medium">Specific User</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Alert Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as any)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="info">Information (Blue)</option>
                                <option value="success">Success (Green)</option>
                                <option value="warning">Warning (Orange)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g., System Maintenance"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                        <textarea
                            required
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter your message here..."
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Send Notification
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NotificationManager;
