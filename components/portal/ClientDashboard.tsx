import React from 'react';
import { CallData } from '../../types';
import { Play, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface ClientDashboardProps {
  calls: CallData[];
  onPlayCall: (call: CallData) => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ calls, onPlayCall }) => {
  
  // Calculate KPIs
  const totalCalls = calls.length;
  const processedCalls = calls.filter(c => c.analysis);
  const avgSentiment = processedCalls.length 
    ? Math.round(processedCalls.reduce((acc, c) => acc + (c.analysis?.sentimentScore || 0), 0) / processedCalls.length) 
    : 0;
  const missedOpps = processedCalls.filter(c => c.analysis?.missedEmailOpportunity).length;

  // Filter "Action Needed" (Sentiment < 40 or specifically flagged)
  const actionNeededCalls = calls
    .filter(c => (c.analysis?.sentimentScore || 100) < 40)
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Executive Overview</h2>
        <p className="text-slate-500 mt-1">Here is what happened with your calls in the last 7 days.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Calls */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">7 Days</span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-900">{totalCalls}</h3>
            <p className="text-sm text-slate-500 mt-1">Total Conversations</p>
          </div>
        </div>

        {/* Sentiment Gauge */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
             <div className={`p-2 rounded-lg ${avgSentiment > 50 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {avgSentiment > 50 ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
             </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-slate-900">{avgSentiment}</h3>
              <span className="text-sm text-slate-400">/ 100</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">Average Sentiment Score</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4">
            <div className={`h-1.5 rounded-full ${avgSentiment > 50 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${avgSentiment}%` }}></div>
          </div>
        </div>

        {/* Missed Opportunities */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-900">{missedOpps}</h3>
            <p className="text-sm text-slate-500 mt-1">Missed Follow-up Opportunities</p>
          </div>
        </div>
      </div>

      {/* Action Needed Section */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <div className="w-2 h-6 bg-red-500 rounded-full"></div>
          Action Needed
          <span className="text-xs font-normal text-slate-500 ml-2 bg-slate-100 px-2 py-1 rounded-full">{actionNeededCalls.length} Alerts</span>
        </h3>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {actionNeededCalls.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {actionNeededCalls.map(call => (
                <div key={call.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                      {call.analysis?.sentimentScore}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{call.clientName}</p>
                      <p className="text-sm text-slate-500">Agent: {call.agentName} • {new Date(call.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded font-medium">Negative Sentiment</span>
                     <button 
                       onClick={() => onPlayCall(call)}
                       className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                     >
                       Review Call
                     </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              <CheckCircle className="w-12 h-12 mx-auto text-green-400 mb-3" />
              <p>Great job! No calls require immediate attention.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
