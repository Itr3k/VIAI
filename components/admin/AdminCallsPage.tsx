import React from 'react';
import { Phone, Search, Filter, Download } from 'lucide-react';

const AdminCallsPage: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Global Call Logs</h2>
                    <p className="text-slate-500 mt-1">View and audit calls across all agencies.</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                </button>
            </div>

            <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Phone className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Call Logs Unavailable</h3>
                <p className="text-slate-500 max-w-md">
                    Global call logging is currently being indexed. Please check back later or view individual agency logs.
                </p>
            </div>
        </div>
    );
};

export default AdminCallsPage;
