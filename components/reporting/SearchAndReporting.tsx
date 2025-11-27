import React, { useState } from 'react';
import { Search, Filter, Download, FileText, Calendar, ChevronDown, RefreshCw } from 'lucide-react';
import { CallLog } from '../../types';

interface SearchAndReportingProps {
    userRole: 'super_admin' | 'agency_admin' | 'client';
    scope?: string; // agency_id or client_id
}

// Mock Data Generator based on role
const generateMockData = (role: string): CallLog[] => {
    const baseCalls: CallLog[] = [
        {
            id: '1', clientName: 'Acme Dental', agentName: 'Receptionist AI', timestamp: new Date().toISOString(), duration: '2m 30s', status: 'processed',
            direction: 'inbound', outcome: 'answered', transcript: 'Mock transcript...', crmActions: ['Booked appointment'],
            analysis: { sentimentScore: 85, summary: 'Appointment booking', actionItems: [] }
        },
        {
            id: '2', clientName: 'Legal Partners', agentName: 'Intake Bot', timestamp: new Date(Date.now() - 86400000).toISOString(), duration: '5m 12s', status: 'flagged',
            direction: 'inbound', outcome: 'answered', transcript: 'Mock transcript...', crmActions: [],
            analysis: { sentimentScore: 45, summary: 'Client upset about fees', actionItems: ['Manager review'] }
        },
        {
            id: '3', clientName: 'Tech Solutions', agentName: 'Support AI', timestamp: new Date(Date.now() - 172800000).toISOString(), duration: '1m 45s', status: 'processed',
            direction: 'outbound', outcome: 'voicemail', transcript: 'Mock transcript...', crmActions: ['Left voicemail'],
            analysis: { sentimentScore: 92, summary: 'Password reset success', actionItems: [] }
        },
        {
            id: '4', clientName: 'City Clinic', agentName: 'Appointment Bot', timestamp: new Date(Date.now() - 250000000).toISOString(), duration: '3m 10s', status: 'processed',
            direction: 'inbound', outcome: 'answered', transcript: 'Mock transcript...', crmActions: ['Rescheduled'],
            analysis: { sentimentScore: 78, summary: 'Rescheduling request', actionItems: [] }
        },
        {
            id: '5', clientName: 'Global Corp', agentName: 'Sales AI', timestamp: new Date(Date.now() - 300000).toISOString(), duration: '8m 20s', status: 'processed',
            direction: 'outbound', outcome: 'answered', transcript: 'Mock transcript...', crmActions: ['Updated deal stage', 'Sent contract'],
            analysis: { sentimentScore: 88, summary: 'Product demo scheduled', actionItems: ['Send contract'] }
        },
    ];

    if (role === 'client') {
        return baseCalls.slice(0, 3); // Clients see fewer (their own)
    }
    if (role === 'agency_admin') {
        return baseCalls; // Agencies see all their clients
    }
    return [...baseCalls, ...baseCalls]; // Super admins see everything
};

const SearchAndReporting: React.FC<SearchAndReportingProps> = ({ userRole }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState('7d');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportGenerated, setReportGenerated] = useState(false);

    const mockData = generateMockData(userRole);

    const filteredData = mockData.filter(call => {
        const matchesSearch =
            call.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            call.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (call.analysis?.summary || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || call.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleGenerateReport = () => {
        setIsGenerating(true);
        // Simulate generation
        setTimeout(() => {
            setIsGenerating(false);
            setReportGenerated(true);
            setTimeout(() => setReportGenerated(false), 3000);
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Search & Reporting</h2>
                    <p className="text-slate-500 mt-1">
                        {userRole === 'super_admin' ? 'Search across all agencies and generate system-wide reports.' :
                            userRole === 'agency_admin' ? 'Analyze data across all your client accounts.' :
                                'Search your call history and generate performance reports.'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleGenerateReport}
                        disabled={isGenerating}
                        className={`px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 ${isGenerating ? 'opacity-75 cursor-wait' : ''}`}
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <FileText className="w-4 h-4" />
                                Generate Report
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                            type="text"
                            placeholder="Search by client, agent, or keywords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto">
                        <div className="relative">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                            >
                                <option value="24h">Last 24 Hours</option>
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="custom">Custom Range</option>
                            </select>
                            <Calendar className="w-4 h-4 text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                        </div>

                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                            >
                                <option value="all">All Statuses</option>
                                <option value="processed">Processed</option>
                                <option value="flagged">Flagged</option>
                                <option value="failed">Failed</option>
                            </select>
                            <Filter className="w-4 h-4 text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-medium text-slate-500 py-1">Quick Actions:</span>
                    <button onClick={() => { setSearchTerm('appointment'); setStatusFilter('all'); }} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full transition-colors border border-slate-200">
                        Appointments
                    </button>
                    <button onClick={() => { setSearchTerm('upset'); setStatusFilter('flagged'); }} className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-full transition-colors border border-red-100">
                        Angry Customers
                    </button>
                    <button onClick={() => { setSearchTerm('sales'); setStatusFilter('processed'); }} className="text-xs bg-green-50 hover:bg-green-100 text-green-600 px-3 py-1 rounded-full transition-colors border border-green-100">
                        Sales Calls
                    </button>
                    <button onClick={() => { setSearchTerm(''); setStatusFilter('failed'); }} className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-600 px-3 py-1 rounded-full transition-colors border border-amber-100">
                        Failed Calls
                    </button>
                </div>
            </div>

            {/* Success Message */}
            {reportGenerated && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <Download className="w-5 h-5" />
                    <span className="font-medium">Report generated successfully! Download started.</span>
                </div>
            )}

            {/* Results Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Search Results <span className="text-slate-400 font-normal ml-1">({filteredData.length})</span></h3>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Agent</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Summary</th>
                                <th className="px-6 py-4">Sentiment</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {filteredData.length > 0 ? (
                                filteredData.map((call) => (
                                    <tr key={call.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{call.clientName}</td>
                                        <td className="px-6 py-4 text-slate-600">{call.agentName}</td>
                                        <td className="px-6 py-4 text-slate-500">{new Date(call.timestamp).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={call.analysis?.summary}>
                                            {call.analysis?.summary || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {call.analysis ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 bg-slate-200 rounded-full h-1.5">
                                                        <div
                                                            className={`h-1.5 rounded-full ${call.analysis.sentimentScore > 60 ? 'bg-green-500' : 'bg-red-500'}`}
                                                            style={{ width: `${call.analysis.sentimentScore}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs text-slate-600">{call.analysis.sentimentScore}</span>
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${call.status === 'processed' ? 'bg-green-100 text-green-800' :
                                                call.status === 'flagged' ? 'bg-red-100 text-red-800' :
                                                    'bg-slate-100 text-slate-800'
                                                }`}>
                                                {call.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No results found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SearchAndReporting;
