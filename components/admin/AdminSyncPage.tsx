import React from 'react';
import { RefreshCw, Database, Server } from 'lucide-react';

const AdminSyncPage: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Data Synchronization</h2>
                    <p className="text-slate-500 mt-1">Monitor and force sync data across the platform.</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync All Now
                </button>
            </div>

            <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <Database className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Sync Status: Healthy</h3>
                <p className="text-slate-500 max-w-md">
                    All nodes are currently synchronized. Last global sync completed 15 minutes ago.
                </p>
            </div>
        </div>
    );
};

export default AdminSyncPage;
