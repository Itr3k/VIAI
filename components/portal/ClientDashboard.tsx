import React from 'react';
import { CallData } from '../../types';
import { Play, TrendingUp, AlertTriangle, CheckCircle, PhoneOutgoing, PhoneIncoming, Voicemail, PhoneMissed, Database } from 'lucide-react';
import WordCloud from '../WordCloud';
import { CallVolumeGraph } from '../dashboard/DashboardWidgets';
import ConnectOutlook from '../ConnectOutlook';

interface ClientDashboardProps {
  calls: CallData[];
  onPlayCall: (call: CallData) => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ calls, onPlayCall }) => {

  // Calculate KPIs
  const totalCalls = calls.length;
  const inboundCalls = calls.filter(c => c.direction === 'inbound').length;
  const outboundCalls = calls.filter(c => c.direction === 'outbound').length;

  // Mock minutes calculation (parsing "2m 30s")
  const parseDuration = (dur: string) => {
    const parts = dur.split(' ');
    let minutes = 0;
    parts.forEach(p => {
      if (p.includes('m')) minutes += parseInt(p);
      if (p.includes('s')) minutes += parseInt(p) / 60;
    });
    return minutes;
  };

  const outboundMinutes = Math.round(calls
    .filter(c => c.direction === 'outbound')
    .reduce((acc, c) => acc + parseDuration(c.duration), 0));

  const processedCalls = calls.filter(c => c.analysis);
  const avgSentiment = processedCalls.length
    ? Math.round(processedCalls.reduce((acc, c) => acc + (c.analysis?.sentimentScore || 0), 0) / processedCalls.length)
    : 0;

  // Outcome Breakdown
  const answered = calls.filter(c => c.outcome === 'answered').length;
  const voicemails = calls.filter(c => c.outcome === 'voicemail').length;
  const hangups = calls.filter(c => c.outcome === 'hangup').length;

  // CRM Actions
  const crmActions = calls
    .flatMap(c => c.crmActions || [])
    .slice(0, 5); // Last 5 actions

  // Filter "Action Needed" (Sentiment < 40 or specifically flagged)
  const actionNeededCalls = calls
    .filter(c => (c.analysis?.sentimentScore || 100) < 40)
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Executive Overview</h2>
          <p className="text-slate-500 mt-1">Here is what happened with your calls in the last 7 days.</p>
        </div>
        <ConnectOutlook isConnected={false} onConnect={() => alert('Nango integration coming soon for clients!')} />
      </div>

      {/* KPI Row 1: Volume & Sentiment */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Total Calls Split */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-1 md:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">7 Days</span>
          </div>
          <div className="flex gap-8">
            <div>
              <h3 className="text-3xl font-bold text-slate-900">{totalCalls}</h3>
              <p className="text-sm text-slate-500 mt-1">Total Calls</p>
            </div>
            <div className="h-12 w-px bg-slate-100"></div>
            <div className="flex flex-col justify-center gap-1">
              <div className="flex items-center text-sm text-slate-600">
                <PhoneIncoming className="w-3 h-3 mr-2 text-indigo-500" />
                {inboundCalls} Inbound
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <PhoneOutgoing className="w-3 h-3 mr-2 text-emerald-500" />
                {outboundCalls} Outbound
              </div>
            </div>
          </div>
        </div>

        {/* Outbound Minutes */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <PhoneOutgoing className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-900">{outboundMinutes}m</h3>
            <p className="text-sm text-slate-500 mt-1">Outbound Duration</p>
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
            <p className="text-sm text-slate-500 mt-1">Avg Sentiment</p>
          </div>
        </div>
      </div>

      {/* KPI Row 2: Outcomes & CRM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Call Outcomes */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Call Outcomes</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-slate-600">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Answered
              </div>
              <span className="font-medium">{answered}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-slate-600">
                <Voicemail className="w-4 h-4 mr-2 text-amber-500" /> Voicemail
              </div>
              <span className="font-medium">{voicemails}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-slate-600">
                <PhoneMissed className="w-4 h-4 mr-2 text-red-500" /> Hangup/Missed
              </div>
              <span className="font-medium">{hangups}</span>
            </div>
          </div>
        </div>

        {/* Recent CRM Activity */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800">Recent AI CRM Actions</h3>
          </div>
          {crmActions.length > 0 ? (
            <div className="space-y-3">
              {crmActions.map((action, i) => (
                <div key={i} className="flex items-center text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                  {action}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">No CRM actions recorded recently.</p>
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Word Cloud */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-800">Trending Topics</h3>
            <p className="text-xs text-slate-500">Key themes extracted from your recent calls.</p>
          </div>
          <div className="flex-1">
            {/* Mocking keywords for client view since we don't have globalKeywords prop passed down yet */}
            <WordCloud words={[
              { text: 'appointment', value: 50 },
              { text: 'reschedule', value: 30 },
              { text: 'insurance', value: 25 },
              { text: 'cleaning', value: 40 },
              { text: 'pain', value: 15 },
            ]} height={260} />
          </div>
        </div>

        {/* Call Volume */}
        <CallVolumeGraph data={[{ date: '2023-11-01', volume: 12 }, { date: '2023-11-02', volume: 15 }, { date: '2023-11-03', volume: 8 }, { date: '2023-11-04', volume: 22 }]} />
      </div>

      {/* Action Needed Section */}
      <div>
        <a href="/portal/reports" className="group block">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
            <div className="w-2 h-6 bg-red-500 rounded-full"></div>
            Action Needed (Negative Sentiment)
            <span className="text-xs font-normal text-slate-500 ml-2 bg-slate-100 px-2 py-1 rounded-full">{actionNeededCalls.length} Alerts</span>
            <span className="text-xs text-indigo-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">View All Reports &rarr;</span>
          </h3>
        </a>

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
