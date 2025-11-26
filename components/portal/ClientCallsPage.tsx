import React, { useState } from 'react';
import { CallData } from '../../types';
import { Play, Search, Filter } from 'lucide-react';

interface ClientCallsPageProps {
  calls: CallData[];
  onPlayCall: (call: CallData) => void;
}

const ClientCallsPage: React.FC<ClientCallsPageProps> = ({ calls, onPlayCall }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [agentFilter, setAgentFilter] = useState('All Agents');

  // Unique Agents
  const agents = ['All Agents', ...Array.from(new Set(calls.map(c => c.agentName)))];

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          call.transcript.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgent = agentFilter === 'All Agents' || call.agentName === agentFilter;
    return matchesSearch && matchesAgent;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Call Logs</h2>
          <p className="text-slate-500 mt-1">Review audio and transcripts from your team.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search client or transcript..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
             <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
             <select 
               value={agentFilter}
               onChange={e => setAgentFilter(e.target.value)}
               className="pl-9 pr-8 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
             >
               {agents.map(a => <option key={a} value={a}>{a}</option>)}
             </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Agent</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Sentiment</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredCalls.map(call => (
              <tr key={call.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                  {new Date(call.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">{call.clientName}</td>
                <td className="px-6 py-4 text-slate-600">{call.agentName}</td>
                <td className="px-6 py-4 text-slate-500">{call.duration}</td>
                <td className="px-6 py-4">
                  {call.analysis ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      call.analysis.sentimentScore > 50 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {call.analysis.sentimentScore}% {call.analysis.sentimentScore > 50 ? 'Positive' : 'Negative'}
                    </span>
                  ) : <span className="text-slate-400">-</span>}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onPlayCall(call)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                  >
                    <Play className="w-4 h-4 ml-0.5" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredCalls.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No calls found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientCallsPage;
