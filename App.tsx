
import React, { useState } from 'react';
import { CallData, AgencySettings, SentimentTrend, UserRole, ViewState } from './types';
import { MOCK_CALLS, MOCK_TRENDS, MOCK_AGENT_PERFORMANCE, MOCK_CALL_VOLUME } from './services/mockData';
import { analyzeCallTranscript } from './services/geminiService';
import WordCloud from './components/WordCloud';
import SentimentChart from './components/Charts';
import ConnectOutlook from './components/ConnectOutlook';
import UsersPage from './components/admin/UsersPage';
import AgenciesPage, { MOCK_AGENCIES } from './components/admin/AgenciesPage';
import IntegrationsPage from './components/settings/IntegrationsPage';
import SyncPage from './components/settings/SyncPage';
import ReportingPage from './components/reporting/ReportingPage';
import ClientLayout from './components/layouts/ClientLayout';
import ClientDashboard from './components/portal/ClientDashboard';
import ClientCallsPage from './components/portal/ClientCallsPage';
import { MinutesUsageCard, ToolHealthCard, AgentPerformanceGraph, CallVolumeGraph } from './components/dashboard/DashboardWidgets';
// Using default import for the page component
import CallDetailPage from './components/calls/CallDetailPage';
import SuperAdminPage from './components/admin/SuperAdminPage';
import { useImpersonation } from './hooks/useImpersonation';

const App: React.FC = () => {
  const [calls, setCalls] = useState<CallData[]>(MOCK_CALLS);
  const [selectedCall, setSelectedCall] = useState<CallData | null>(null);
  const [settings, setSettings] = useState<AgencySettings>({ name: 'Acme Agency', nangoConnected: false });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [view, setView] = useState<ViewState>('dashboard');
  
  // Mock Auth State
  const [userRole, setUserRole] = useState<UserRole>('admin'); 
  
  // Impersonation Hook
  const { isImpersonating, impersonatedAgency, startImpersonation, stopImpersonation } = useImpersonation({
    setSettings,
    setUserRole
  });

  // Aggregated data for dashboard
  const totalCalls = calls.length;
  const avgSentiment = Math.round(calls.reduce((acc, c) => acc + (c.analysis?.sentimentScore || 0), 0) / (calls.filter(c => c.analysis).length || 1));
  
  // Aggregate all keywords for global word cloud
  const globalKeywords = calls
    .flatMap(c => c.analysis?.keywords || [])
    .reduce((acc, curr) => {
      const existing = acc.find(k => k.text === curr.text);
      if (existing) {
        existing.value += curr.value;
      } else {
        acc.push({ ...curr });
      }
      return acc;
    }, [] as { text: string; value: number }[])
    .sort((a, b) => b.value - a.value)
    .slice(0, 20);

  const handleRunAnalysis = async (callId: string) => {
    setIsAnalyzing(true);
    const callToAnalyze = calls.find(c => c.id === callId);
    
    if (callToAnalyze && callToAnalyze.transcript) {
      try {
        const analysis = await analyzeCallTranscript(callToAnalyze.transcript);
        
        setCalls(prev => prev.map(c => 
          c.id === callId ? { ...c, analysis, status: 'processed' } : c
        ));
        
        // Auto-select the updated call if we are looking at it
        if (selectedCall?.id === callId) {
          setSelectedCall({ ...callToAnalyze, analysis, status: 'processed' });
        }

      } catch (err) {
        console.error("Analysis Error", err);
        alert("Failed to analyze call. Check API Key in env.");
      }
    }
    setIsAnalyzing(false);
  };

  const handleSendEmail = () => {
    if (!settings.nangoConnected) {
      alert("Please connect Outlook first via the Dashboard.");
      return;
    }
    alert("Triggered Nango Proxy: Email draft created in Outlook Sent Items.");
  };

  // --- CLIENT PORTAL VIEW ---
  if (userRole === 'client') {
    return (
      <ClientLayout 
        view={view} 
        setView={setView} 
        clientName="Dr. Smith Dental" 
        onLogout={() => setUserRole('admin')} // Mock Logout
      >
        {/* If a call is selected, show the Detail Page (Phase 4 Template) */}
        {selectedCall ? (
          <CallDetailPage 
            call={selectedCall} 
            onBack={() => setSelectedCall(null)}
            onGenerateAnalysis={handleRunAnalysis}
            isAnalyzing={isAnalyzing}
          />
        ) : (
          <>
            {view === 'portal_dashboard' && <ClientDashboard calls={calls} onPlayCall={setSelectedCall} />}
            {view === 'portal_calls' && <ClientCallsPage calls={calls} onPlayCall={setSelectedCall} />}
            {view === 'portal_analytics' && (
              <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                <p>Advanced Analytics coming soon.</p>
              </div>
            )}
            {view === 'portal_settings' && (
              <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <p>Client Settings coming soon.</p>
              </div>
            )}
          </>
        )}
      </ClientLayout>
    );
  }

  // --- SUPER ADMIN VIEW ---
  // If role is super_admin AND not currently impersonating someone
  if (userRole === 'super_admin' && !isImpersonating) {
    return (
       <div className="min-h-screen flex bg-slate-50">
          {/* Simple Sidebar for Super Admin */}
          <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col fixed inset-y-0 z-10">
             <div className="p-6">
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 to-orange-500"></div>
                   VIAI
                </h1>
                <p className="text-xs text-red-400 mt-2 font-mono uppercase">System Owner</p>
             </div>
             <nav className="flex-1 px-4 mt-4">
                <button className="flex items-center w-full px-4 py-3 rounded-lg bg-red-900/30 text-white shadow-inner mb-2">
                   <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                   Global Dashboard
                </button>
             </nav>
             <div className="p-4 border-t border-slate-800">
               <button 
                  onClick={() => setUserRole('admin')}
                  className="w-full text-center text-xs text-slate-500 hover:text-white"
               >
                  Switch to Agency View (Demo)
               </button>
             </div>
          </aside>
          
          <main className="ml-0 md:ml-64 flex-1 p-8 overflow-y-auto h-screen">
             <SuperAdminPage 
                agencies={MOCK_AGENCIES}
                onImpersonate={(agency) => startImpersonation(agency, settings)}
             />
          </main>
       </div>
    );
  }

  // --- AGENCY ADMIN VIEW (Standard Dashboard) ---
  return (
    <div className="min-h-screen flex bg-slate-50 flex-col md:flex-row">
      
      {/* IMPERSONATION BANNER */}
      {isImpersonating && impersonatedAgency && (
         <div className="bg-red-600 text-white text-sm font-bold text-center py-2 fixed top-0 left-0 right-0 z-[60] shadow-lg flex items-center justify-center gap-4 animate-fade-in">
            <span>Viewing as: {impersonatedAgency.name} ({impersonatedAgency.slug})</span>
            <button 
               onClick={stopImpersonation}
               className="bg-white text-red-600 px-3 py-0.5 rounded text-xs hover:bg-red-50 transition-colors uppercase tracking-wide"
            >
               Exit View
            </button>
         </div>
      )}

      {/* Sidebar - Adjusted top margin if banner exists */}
      <aside className={`hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col fixed inset-y-0 z-10 transition-all duration-300 ${isImpersonating ? 'top-9' : 'top-0'}`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${userRole === 'super_admin' ? 'from-red-500 to-orange-500' : 'from-brand-500 to-indigo-500'}`}></div>
            VIAI
          </h1>
          <p className="text-xs text-slate-500 mt-2 font-mono">
            {userRole === 'super_admin' ? 'SYSTEM OWNER' : `AGENCY: ${settings.name.toUpperCase()}`}
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          
          {/* Agency Admin Links */}
          {userRole !== 'super_admin' && (
            <>
              <button 
                onClick={() => { setView('dashboard'); setSelectedCall(null); }}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${view === 'dashboard' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'hover:bg-slate-800'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                Dashboard
              </button>
              <button 
                onClick={() => { setView('calls'); setSelectedCall(null); }}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${view === 'calls' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'hover:bg-slate-800'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Call Logs
              </button>
              <button 
                onClick={() => { setView('reporting'); setSelectedCall(null); }}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${view === 'reporting' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'hover:bg-slate-800'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                Reporting Agent
              </button>
            </>
          )}

          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Administration</p>
          </div>

          <button 
            onClick={() => { setView('users'); setSelectedCall(null); }}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${view === 'users' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'hover:bg-slate-800'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Users & Roles
          </button>
          
          {userRole !== 'super_admin' && (
            <>
              <button 
                onClick={() => { setView('integrations'); setSelectedCall(null); }}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${view === 'integrations' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'hover:bg-slate-800'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
                Integrations
              </button>
              <button 
                onClick={() => { setView('sync'); setSelectedCall(null); }}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${view === 'sync' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'hover:bg-slate-800'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Sync Data
              </button>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
           {/* Mock Role Switcher for Demo Purposes */}
           {!isImpersonating && (
             <div className="flex flex-col gap-2">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                   {userRole === 'super_admin' ? 'SA' : 'AD'}
                 </div>
                 <div>
                   <p className="text-sm text-white">{userRole === 'super_admin' ? 'Super Admin' : 'Agency Admin'}</p>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => { setUserRole(r => r === 'super_admin' ? 'admin' : 'super_admin'); setSelectedCall(null); }}
                        className="text-xs text-brand-400 hover:text-brand-300 underline"
                      >
                        Switch Role
                      </button>
                      <button 
                        onClick={() => { setUserRole('client'); setView('portal_dashboard'); setSelectedCall(null); }}
                        className="text-xs text-brand-400 hover:text-brand-300 underline"
                      >
                        Client View
                      </button>
                   </div>
                 </div>
               </div>
             </div>
           )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`ml-0 md:ml-64 flex-1 p-8 overflow-y-auto h-screen ${isImpersonating ? 'mt-9' : ''}`}>
        
        {/* Header - Only show if not in specific views and NO selected call */}
        {view === 'calls' && !selectedCall && (
          <header className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Call Logs</h2>
              <p className="text-slate-500 mt-1">Real-time analysis from your agency clients.</p>
            </div>
            <ConnectOutlook 
              isConnected={settings.nangoConnected} 
              onConnect={() => setSettings(s => ({ ...s, nangoConnected: true }))} 
            />
          </header>
        )}

        {view === 'dashboard' && !selectedCall && (
          <>
            <header className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Voice Intelligence Overview</h2>
                <p className="text-slate-500 mt-1">Real-time analysis from your agency clients.</p>
              </div>
              <ConnectOutlook 
                isConnected={settings.nangoConnected} 
                onConnect={() => setSettings(s => ({ ...s, nangoConnected: true }))} 
              />
            </header>

            <div className="space-y-6">
              {/* Top Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MinutesUsageCard />
                
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Total Calls</p>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">Last 30 Days</span>
                    <p className="text-4xl font-bold text-slate-900 mt-4">{totalCalls}</p>
                  </div>
                  <div className="mt-2 text-green-600 text-sm font-medium flex items-center">
                    <span className="bg-green-100 px-1.5 py-0.5 rounded mr-2">↑ 12%</span> vs last month
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Avg Sentiment</p>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">Live</span>
                    <div className="flex items-center gap-2 mt-4">
                      <p className="text-4xl font-bold text-slate-900">{avgSentiment}</p>
                      <div className="h-2 w-24 bg-slate-100 rounded-full">
                         <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${avgSentiment}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <ToolHealthCard />
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                <AgentPerformanceGraph data={MOCK_AGENT_PERFORMANCE} />
                <CallVolumeGraph data={MOCK_CALL_VOLUME} />
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sentiment Chart */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Sentiment Trend (7 Days)</h3>
                  <SentimentChart data={MOCK_TRENDS} />
                </div>

                {/* Word Cloud */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Trending Topics</h3>
                  <div className="flex-1">
                    <WordCloud words={globalKeywords} height={260} />
                  </div>
                </div>
              </div>

              {/* RECENT ACTIVITY TABLE (New Addition for Clickability) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800">Recent Call Activity</h3>
                  <button 
                    onClick={() => setView('calls')}
                    className="text-sm text-brand-600 font-medium hover:text-brand-800"
                  >
                    View All
                  </button>
                </div>
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {calls.slice(0, 3).map(call => (
                      <tr key={call.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedCall(call)}>
                        <td className="px-6 py-4 font-medium text-slate-900 w-1/4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                              {call.clientName.charAt(0)}
                            </div>
                            {call.clientName}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 w-1/4">{call.agentName}</td>
                        <td className="px-6 py-4 w-1/4">
                           {call.analysis ? (
                             <div className="flex items-center gap-2">
                               <div className={`w-2 h-2 rounded-full ${call.analysis.sentimentScore > 50 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                               <span className="text-xs font-medium">{call.analysis.sentimentScore}/100</span>
                             </div>
                           ) : <span className="text-xs text-slate-400">Processing...</span>}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-brand-600 font-medium text-xs">View Details →</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* View Routing */}
        {view === 'users' && !selectedCall && <UsersPage />}
        {view === 'agencies' && !selectedCall && <AgenciesPage />}
        {view === 'integrations' && !selectedCall && <IntegrationsPage />}
        {view === 'sync' && !selectedCall && <SyncPage />}
        {view === 'reporting' && !selectedCall && <ReportingPage />}

        {view === 'calls' && !selectedCall && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                         call.status === 'processed' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
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
                              style={{ width: `${call.analysis.sentimentScore}%`}}
                             ></div>
                           </div>
                           <span className="text-xs text-slate-600">{call.analysis.sentimentScore}</span>
                         </div>
                       ) : <span className="text-slate-400">-</span>}
                     </td>
                     <td className="px-6 py-4">
                       <button 
                        onClick={() => setSelectedCall(call)}
                        className="text-brand-600 font-medium hover:text-brand-800 hover:underline"
                       >
                         View Details
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}

        {/* Detailed Call View - Show whenever selectedCall is present! */}
        {selectedCall && (
           <CallDetailPage 
             call={selectedCall} 
             onBack={() => setSelectedCall(null)} 
             onGenerateAnalysis={handleRunAnalysis}
             isAnalyzing={isAnalyzing}
           />
        )}

      </main>
    </div>
  );
};

export default App;