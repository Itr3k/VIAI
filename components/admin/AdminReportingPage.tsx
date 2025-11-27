import React, { useState } from 'react';
import SearchAndReporting from '../../components/reporting/SearchAndReporting';
import AIAnalyst from '../../components/reporting/AIAnalyst';
import { MessageSquare, Search } from 'lucide-react';

const AdminReportingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'chat' | 'search'>('search');

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('search')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'search' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Search className="w-4 h-4" />
                    Search & Reports
                </button>
                <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'chat' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <MessageSquare className="w-4 h-4" />
                    AI Analyst
                </button>
            </div>

            {activeTab === 'search' ? (
                <SearchAndReporting userRole="super_admin" />
            ) : (
                <AIAnalyst userRole="super_admin" />
            )}
        </div>
    );
};

export default AdminReportingPage;
