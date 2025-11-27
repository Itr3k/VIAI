import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Phone, FileText, Settings, LogOut, Plus, Users, Building, Bot, RefreshCw, Shield, MessageSquare, UserPlus, Link } from 'lucide-react';
import { CallLog, Agency, Agent, User } from './types';
import { runAnalysis } from './utils/gemini';
import CallDetailPage from './components/calls/CallDetailPage';
import KorraAssistant from './components/KorraAssistant';
import ConnectOutlook from './components/ConnectOutlook';
import UsersPage from './components/admin/UsersPage';
import AgenciesPage, { MOCK_AGENCIES } from './components/admin/AgenciesPage';
import GlobalUsersPage from './components/admin/GlobalUsersPage';
import ElevenLabsAgentsPage from './components/admin/ElevenLabsAgentsPage';
import AdminCallsPage from './components/admin/AdminCallsPage';
import AdminReportingPage from './components/admin/AdminReportingPage';
import AdminIntegrationsPage from './components/admin/AdminIntegrationsPage';
import AdminSyncPage from './components/admin/AdminSyncPage';
import IntegrationsPage from './components/settings/IntegrationsPage';
import SyncPage from './components/settings/SyncPage';
import ReportingPage from './components/reporting/ReportingPage';
import SuperAdminPage from './components/admin/SuperAdminPage';
import ClientDashboard from './components/portal/ClientDashboard';
import ClientCallsPage from './components/portal/ClientCallsPage';
import ClientReportsPage from './components/portal/ClientReportsPage';
import ClientSettingsPage from './components/portal/ClientSettingsPage';
import KnowledgeBasePage from './components/knowledge/KnowledgeBasePage';
import HelpdeskPage from './components/helpdesk/HelpdeskPage';
import NotificationCenter from './components/notifications/NotificationCenter';
import NotificationManager from './components/notifications/NotificationManager';
import AgencyClientsPage from './components/agency/AgencyClientsPage';
import AgencyUsersPage from './components/agency/AgencyUsersPage';
import AgencyDashboard from './components/agency/AgencyDashboard';
import AgencyOnboardingPage from './components/agency/AgencyOnboardingPage';
import SuperAdminOnboardingPage from './components/admin/SuperAdminOnboardingPage';
import KorraSystemPage from './components/admin/KorraSystemPage';
import { TopClientsWidget } from './components/dashboard/DashboardWidgets';

// Mock Data
const MOCK_CALLS: CallLog[] = [
  { id: '1', clientName: 'John Doe', agentName: 'Receptionist AI', timestamp: new Date().toISOString(), duration: '2m 30s', status: 'processed', direction: 'inbound', outcome: 'answered', recordingUrl: '#', transcript: '...', analysis: { summary: 'Appointment scheduled', sentimentScore: 85, actionItems: ['Send confirmation'] } },
  { id: '2', clientName: 'Jane Smith', agentName: 'Sales Bot', timestamp: new Date(Date.now() - 3600000).toISOString(), duration: '5m 12s', status: 'flagged', direction: 'outbound', outcome: 'answered', recordingUrl: '#', transcript: '...', analysis: { summary: 'Customer upset about pricing', sentimentScore: 40, actionItems: ['Follow up call'] } },
  { id: '3', clientName: 'Mike Johnson', agentName: 'Support AI', timestamp: new Date(Date.now() - 7200000).toISOString(), duration: '1m 45s', status: 'processed', direction: 'inbound', outcome: 'voicemail', recordingUrl: '#', transcript: '...', analysis: { summary: 'Password reset', sentimentScore: 90, actionItems: [] } },
];

type ViewState = 'dashboard' | 'clients' | 'reports' | 'settings' | 'integrations' | 'admin-integrations' | 'sync' | 'reporting' | 'admin_users' | 'admin_agents' | 'admin_calls' | 'admin_reporting' | 'admin_integrations' | 'admin_sync' | 'onboarding' | 'agency_clients' | 'calls' | 'korra_system' | 'users' | 'notifications' | 'helpdesk' | 'agencies' | 'agency_users' | 'knowledge_base';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const [calls, setCalls] = useState<CallLog[]>(MOCK_CALLS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userRole, setUserRole] = useState<'super_admin' | 'agency_admin' | 'client'>('super_admin');
  const [impersonatedClient, setImpersonatedClient] = useState<User | null>(null);

  // Settings State
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    apiKey: '',
    korraEnabled: true
  });

  const handleRunAnalysis = async (callId: string) => {
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      alert('Analysis re-run complete!');
    }, 2000);
  };

  const startImpersonation = (agency: Agency) => {
    console.log('Impersonating agency:', agency.name);
    setUserRole('agency_admin');
    setView('dashboard');
  };

  const startClientImpersonation = (client: User) => {
    console.log('Impersonating client:', client.name);
    setImpersonatedClient(client);
    setUserRole('client');
    setView('dashboard');
  };

  const stopImpersonation = () => {
    if (impersonatedClient) {
      setImpersonatedClient(null);
      // Return to Agency Admin view if we were impersonating a client
      // But wait, if a Super Admin impersonated a client directly (via AgencyClientsPage in Super Admin view), where should they go back to?
      // For now, let's assume Super Admin -> Agency Admin -> Client flow, or Super Admin -> Client flow.
      // If we were Super Admin originally, we might want to go back to Super Admin.
      // But simplifying: if we are in 'client' role and stop, go back to 'agency_admin' if we came from there?
      // Let's just default to 'super_admin' for safety, or 'agency_admin' if that was the previous state.
      // Since we don't track previous state stack, let's just go to 'agency_admin' as a safe fallback for now, or 'super_admin'.
      // Actually, let's check the current role.
      setUserRole('agency_admin'); // Fallback to Agency Admin usually
    } else {
      setUserRole('super_admin');
    }
    setView('dashboard');
  };

  // --- CLIENT PORTAL VIEW ---
  if (userRole === 'client') {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        {/* Impersonation Banner */}
        {impersonatedClient && (
          <div className="fixed top-0 left-0 right-0 bg-indigo-600 text-white px-4 py-2 text-sm font-medium z-50 flex justify-between items-center shadow-md">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Viewing as Client: {impersonatedClient.name}
            </div>
            <button
              onClick={stopImpersonation}
              className="bg-white text-indigo-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-indigo-50 transition-colors"
            >
              Exit Client View
            </button>
          </div>
        )}

        <aside className={`w-64 bg-white border-r border-slate-200 fixed inset-y-0 z-10 overflow-y-auto ${impersonatedClient ? 'top-10' : 'top-0'}`}>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-indigo-600 tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Building className="w-5 h-5" />
              </div>
              {impersonatedClient ? impersonatedClient.name : 'Acme Corp'}
            </h1>
            <p className="text-xs text-slate-500 mt-2 uppercase tracking-wider font-semibold">Client Portal</p>
          </div>
          <nav className="px-4 mt-4 space-y-1">
            <button onClick={() => setView('dashboard')} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
            </button>
            <button onClick={() => setView('calls')} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'calls' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Phone className="w-5 h-5 mr-3" /> My Calls
            </button>
            <button onClick={() => setView('reporting')} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'reporting' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <FileText className="w-5 h-5 mr-3" /> Reports
            </button>
            <button onClick={() => setView('knowledge_base')} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'knowledge_base' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Bot className="w-5 h-5 mr-3" /> Knowledge Base
            </button>
            <button onClick={() => setView('settings')} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'settings' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Settings className="w-5 h-5 mr-3" /> Settings
            </button>
            <button onClick={() => setView('integrations')} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'integrations' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Link className="w-5 h-5 mr-3" /> Integrations
            </button>
          </nav>
        </aside>
        <main className={`ml-64 flex-1 p-8 ${impersonatedClient ? 'mt-10' : 'mt-0'}`}>
          {view === 'dashboard' && <ClientDashboard calls={calls} onPlayCall={setSelectedCall} />}
          {view === 'reporting' && <ClientReportsPage />}
          {view === 'settings' && <ClientSettingsPage />}
          {view === 'integrations' && <IntegrationsPage />}
          {view === 'knowledge_base' && <KnowledgeBasePage />}
          {view === 'calls' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Call History</h2>
              <p className="text-slate-500">List of calls for this client account...</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  // --- SUPER ADMIN VIEW ---
  if (userRole === 'super_admin') {
    return (
      <div className="min-h-screen flex bg-slate-50">
        {/* Simple Sidebar for Super Admin */}
        <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col fixed inset-y-0 z-10 overflow-y-auto">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 to-orange-500"></div>
              VIAI
            </h1>
            <p className="text-xs text-red-400 mt-2 font-mono uppercase">System Owner</p>
          </div>
          <nav className="flex-1 px-4 mt-4 space-y-1">
            <button
              onClick={() => setView('dashboard')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </button>
            <button
              onClick={() => setView('onboarding')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'onboarding' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <UserPlus className="w-5 h-5 mr-3" />
              Onboarding
            </button>
            <button
              onClick={() => setView('admin_calls')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'admin_calls' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <Phone className="w-5 h-5 mr-3" />
              Call Logs
            </button>
            <button
              onClick={() => setView('admin_reporting')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'admin_reporting' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <FileText className="w-5 h-5 mr-3" />
              Reporting Agent
            </button>
            <button
              onClick={() => setView('korra_system')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'korra_system' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <Bot className="w-5 h-5 mr-3" />
              Korra AI
            </button>

            <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Administration
            </div>

            <button
              onClick={() => setView('agencies')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'agencies' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <Building className="w-5 h-5 mr-3" />
              Tenants
            </button>
            <button
              onClick={() => setView('admin_users')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'admin_users' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <Users className="w-5 h-5 mr-3" />
              Global Users
            </button>
            <button
              onClick={() => setView('agency_clients')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'agency_clients' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <Users className="w-5 h-5 mr-3" />
              Clients
            </button>
            <button
              onClick={() => setView('agency_users')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'agency_users' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <Shield className="w-5 h-5 mr-3" />
              Team
            </button>
            <button
              onClick={() => setView('admin_integrations')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'admin_integrations' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <Settings className="w-5 h-5 mr-3" />
              Integrations
            </button>
            <button
              onClick={() => setView('admin_sync')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'admin_sync' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <RefreshCw className="w-5 h-5 mr-3" />
              Sync Data
            </button>
            <button
              onClick={() => setView('admin_agents')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'admin_agents' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <Bot className="w-5 h-5 mr-3" />
              ElevenLabs Agents
            </button>
            <button
              onClick={() => setView('helpdesk')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'helpdesk' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <MessageSquare className="w-5 h-5 mr-3" />
              Helpdesk
            </button>
            <button
              onClick={() => setView('notifications')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'notifications' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <Shield className="w-5 h-5 mr-3" />
              Broadcasts
            </button>
          </nav>
        </aside>

        <div className="fixed top-4 right-8 z-50">
          <NotificationCenter />
        </div>

        <main className="ml-0 md:ml-64 flex-1 p-8 overflow-y-auto h-screen">
          {view === 'dashboard' && (
            <SuperAdminPage
              agencies={MOCK_AGENCIES}
              onImpersonate={(agency) => startImpersonation(agency)}
            />
          )}
          {view === 'onboarding' && <SuperAdminOnboardingPage />}
          {view === 'agencies' && <AgenciesPage onImpersonate={(agency) => startImpersonation(agency)} />}
          {view === 'admin_users' && <GlobalUsersPage />}
          {view === 'admin_agents' && <ElevenLabsAgentsPage />}
          {view === 'admin_calls' && <AdminCallsPage />}
          {view === 'admin_reporting' && <AdminReportingPage />}
          {view === 'korra_system' && <KorraSystemPage />}
          {view === 'admin_integrations' && <AdminIntegrationsPage />}
          {view === 'admin_sync' && <AdminSyncPage />}
          {view === 'call-detail' && <CallDetailPage onBack={() => setView('calls')} />}
          {view === 'agency_clients' && <AgencyClientsPage onImpersonate={startClientImpersonation} />}
          {view === 'agency_users' && <AgencyUsersPage />}
          {view === 'integrations' && <IntegrationsPage />}
          {view === 'helpdesk' && <HelpdeskPage userRole="super_admin" />}
          {view === 'notifications' && <NotificationManager userRole="super_admin" />}
        </main>
      </div>
    );
  }

  // --- AGENCY ADMIN VIEW (Default) ---
  const isImpersonating = userRole === 'agency_admin';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Impersonation Banner */}
      {isImpersonating && (
        <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white px-4 py-2 text-sm font-medium z-50 flex justify-between items-center shadow-md">
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Viewing as Agency Admin (Impersonation Mode)
          </div>
          <button
            onClick={stopImpersonation}
            className="bg-white text-amber-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-amber-50 transition-colors"
          >
            Exit Impersonation
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-slate-200 flex-col fixed inset-y-0 z-10 transition-all duration-300 overflow-y-auto ${isImpersonating ? 'top-10' : 'top-0'}`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-brand-600 tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-purple-600"></div>
            VIAI
          </h1>
          <p className="text-xs text-slate-500 mt-2 uppercase tracking-wider font-semibold">Agency Admin</p>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          <button
            onClick={() => setView('dashboard')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'dashboard' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </button>
          <button
            onClick={() => setView('onboarding')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'onboarding' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <UserPlus className="w-5 h-5 mr-3" />
            Onboarding
          </button>
          <button
            onClick={() => setView('calls')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'calls' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Phone className="w-5 h-5 mr-3" />
            Call Logs
          </button>
          <button
            onClick={() => setView('reporting')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'reporting' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <FileText className="w-5 h-5 mr-3" />
            Reporting
          </button>
          <button
            onClick={() => setView('agency_clients')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'agency_clients' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Users className="w-5 h-5 mr-3" />
            Clients
          </button>
          <button
            onClick={() => setView('users')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'users' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Shield className="w-5 h-5 mr-3" />
            Team
          </button>
          <button
            onClick={() => setView('integrations')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'integrations' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Settings className="w-5 h-5 mr-3" />
            Integrations
          </button>
          <button
            onClick={() => setView('sync')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${view === 'sync' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <RefreshCw className="w-5 h-5 mr-3" />
            Sync Data
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button className="flex items-center w-full px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`ml-64 flex-1 p-8 transition-all duration-300 ${isImpersonating ? 'mt-10' : 'mt-0'}`}>

        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {view === 'dashboard' && 'Dashboard'}
              {view === 'onboarding' && 'Onboarding Center'}
              {view === 'calls' && 'Call Logs'}
              {view === 'reporting' && 'Reporting'}
              {view === 'users' && 'Team Management'}
              {view === 'agency_clients' && 'Client Management'}
              {view === 'integrations' && 'Integrations'}
              {view === 'sync' && 'Data Sync'}
            </h2>
            <p className="text-slate-500 mt-1">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              <Settings className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold border-2 border-white shadow-sm">
              AD
            </div>
          </div>
        </header>

        {/* Views */}
        {view === 'dashboard' && <AgencyDashboard />}
        {view === 'onboarding' && <AgencyOnboardingPage />}

        {view === 'integrations' && <IntegrationsPage />}
        {view === 'sync' && <SyncPage />}
        {view === 'reporting' && <ReportingPage />}
        {view === 'users' && <AgencyUsersPage />}
        {view === 'agency_clients' && <AgencyClientsPage onImpersonate={startClientImpersonation} />}

        {view === 'calls' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Recent Calls</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100">Filter</button>
                  <button className="px-3 py-1.5 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700">Export</button>
                </div>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                  <tr>
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
      {settings.korraEnabled && <KorraAssistant />}
    </div>
  );
};

export default App;