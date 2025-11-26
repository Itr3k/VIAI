import React from 'react';
import { CallData } from '../../types';

interface CallsPageProps {
    calls: CallData[];
    onSelectCall: (call: CallData) => void;
}

const CallsPage: React.FC<CallsPageProps> = ({ calls, onSelectCall }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Call Logs</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search calls..."
                        className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>
            </div>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                        <th className="px-6 py-4">Client</th>
                        <th className="px-6 py-4">Agent</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Sentiment</th>
                        <th className="px-6 py-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                    {calls.map(call => (
                        <tr key={call.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">{call.clientName}</td>
                            <td className="px-6 py-4 text-slate-600">{call.agentName}</td>
                            <td className="px-6 py-4 text-slate-500">{new Date(call.timestamp).toLocaleString()}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${call.status === 'processed' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                                    }`}>
                                    {call.status}
                                </span>
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
                                ) : <span className="text-slate-400">-</span>}
                            </td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => onSelectCall(call)}
                                    className="text-brand-600 font-medium hover:text-brand-800 hover:underline"
                                >
                                    View Details
                                </button>
                            </td>
                        </tr>
                    ))}
                    {calls.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                No calls found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CallsPage;
