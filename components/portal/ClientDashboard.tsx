import React, { useState, useMemo } from 'react';
import { CallData, WordFrequency, SentimentTrend } from '../../types';
import { Play, TrendingUp, AlertTriangle, CheckCircle, Search, Download, Mail, Users, BarChart3 } from 'lucide-react';
import WordCloud from '../WordCloud';
import SentimentChart from '../SentimentChart';

interface ClientDashboardProps {
  calls: CallData[];
  onPlayCall: (call: CallData) => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ calls, onPlayCall }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Calls based on Search
  const filteredCalls = useMemo(() => {
    if (!searchQuery) return calls;
    const lowerQuery = searchQuery.toLowerCase();
    return calls.filter(call =>
      call.clientName.toLowerCase().includes(lowerQuery) ||
      call.agentName.toLowerCase().includes(lowerQuery) ||
      call.transcript.toLowerCase().includes(lowerQuery) ||
      (call.analysis?.summary || '').toLowerCase().includes(lowerQuery)
    );
  }, [calls, searchQuery]);

  // Calculate KPIs
  const totalCalls = filteredCalls.length;
  const processedCalls = filteredCalls.filter(c => c.analysis);

  const avgSentiment = processedCalls.length
    ? Math.round(processedCalls.reduce((acc, c) => acc + (c.analysis?.sentimentScore || 0), 0) / processedCalls.length)
    : 0;

  const missedOpps = processedCalls.filter(c => c.analysis?.missedEmailOpportunity).length;

  // Calculate Emails Sent
  const emailsSent = filteredCalls.reduce((acc, call) => {
    return acc + (call.toolExecutions?.filter(t => t.tool === 'viai_email_tool' && t.status === 'success').length || 0);
  }, 0);

  // Aggregate Word Cloud Data
  const wordCloudData = useMemo(() => {
    const wordMap = new Map<string, number>();
    processedCalls.forEach(call => {
      call.analysis?.keywords?.forEach(kw => {
        wordMap.set(kw.text, (wordMap.get(kw.text) || 0) + kw.value);
      });
    });
    return Array.from(wordMap.entries())
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 30); // Top 30 words
  }, [processedCalls]);

  // Aggregate Agent Performance
  const agentStats = useMemo(() => {
    const stats = new Map<string, { calls: number; totalSentiment: number; missed: number }>();

    filteredCalls.forEach(call => {
      const current = stats.get(call.agentName) || { calls: 0, totalSentiment: 0, missed: 0 };
      stats.set(call.agentName, {
        calls: current.calls + 1,
        totalSentiment: current.totalSentiment + (call.analysis?.sentimentScore || 0),
        missed: current.missed + (call.analysis?.missedEmailOpportunity ? 1 : 0)
      });
    });

    return Array.from(stats.entries()).map(([name, data]) => ({
      name,
      calls: data.calls,
      avgSentiment: Math.round(data.totalSentiment / data.calls),
      missed: data.missed
    })).sort((a, b) => b.calls - a.calls);
  }, [filteredCalls]);

  // Mock Sentiment Trend Data (In a real app, this would be aggregated by date from filteredCalls)
  // Generating dynamic trend based on filtered calls for demo purposes
  const sentimentTrendData: SentimentTrend[] = useMemo(() => {
    // Group by date (mocking last 7 days for demo if dates aren't diverse enough)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => ({
      date: day,
      score: Math.min(100, Math.max(20, avgSentiment + (Math.random() * 20 - 10))) // Variation around average
    }));
  }, [avgSentiment]);


  // Filter "Action Needed" (Sentiment < 40 or specifically flagged)
  const actionNeededCalls = filteredCalls
    .filter(c => (c.analysis?.sentimentScore || 100) < 40)
    .slice(0, 5);

  const handleExport = () => {
    const headers = ['ID', 'Client', 'Agent', 'Date', 'Duration', 'Sentiment', 'Summary'];
    const csvContent = [
      headers.join(','),
      ...filteredCalls.map(c => [
        c.id,
        `"${c.clientName}"`,
        `"${c.agentName}"`,
        c.timestamp,
        c.duration,
        c.analysis?.sentimentScore || 0,
        `"${(c.analysis?.summary || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `viai_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Executive Overview</h2>
          <p className="text-slate-500 mt-1">Insights and analytics for your agency's performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search calls, agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Total Calls */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">Filtered</span>
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
            <p className="text-sm text-slate-500 mt-1">Average Sentiment</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4">
            <div className={`h-1.5 rounded-full ${avgSentiment > 50 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${avgSentiment}%` }}></div>
          </div>
        </div>

        {/* Emails Sent */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Mail className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-900">{emailsSent}</h3>
            <p className="text-sm text-slate-500 mt-1">Emails Sent via AI</p>
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
            <p className="text-sm text-slate-500 mt-1">Missed Opportunities</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Trend */}
        <div className="lg:col-span-2">
          <SentimentChart data={sentimentTrendData} />
        </div>

        {/* Word Cloud */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Trending Topics</h3>
          <div className="flex-1 flex items-center justify-center">
            <WordCloud words={wordCloudData} height={200} />
          </div>
        </div>
      </div>

      {/* Agent Performance & Action Needed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Agent Performance Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400" />
              Agent Performance
            </h3>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-3">Agent</th>
                <th className="px-6 py-3 text-center">Calls</th>
                <th className="px-6 py-3 text-center">Sentiment</th>
                <th className="px-6 py-3 text-center">Missed Opps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agentStats.map((agent, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-slate-900">{agent.name}</td>
                  <td className="px-6 py-3 text-center text-slate-600">{agent.calls}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${agent.avgSentiment >= 70 ? 'bg-green-100 text-green-700' :
                        agent.avgSentiment >= 40 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                      }`}>
                      {agent.avgSentiment}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center text-slate-600">{agent.missed}</td>
                </tr>
              ))}
              {agentStats.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">No agent data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Action Needed Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Action Needed
              <span className="text-xs font-normal text-slate-500 ml-2 bg-slate-100 px-2 py-1 rounded-full">{actionNeededCalls.length} Alerts</span>
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[300px]">
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
                      <button
                        onClick={() => onPlayCall(call)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 h-full flex flex-col items-center justify-center">
                <CheckCircle className="w-12 h-12 mx-auto text-green-400 mb-3" />
                <p>Great job! No calls require immediate attention.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
