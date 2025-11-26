import React, { useState } from 'react';
import { Agency, SystemNotification } from '../../types';
import { Activity, DollarSign, Users, LogIn, BarChart2, FileText, Download, Server, Database, Globe, AlertCircle, CheckCircle, Clock, Zap, Bell, TrendingUp, PieChart } from 'lucide-react';
import ClientsPage from './ClientsPage';

interface SuperAdminPageProps {
  agencies: Agency[];
  onImpersonate: (agency: Agency) => void;
  onUpdateNotification: (notification: SystemNotification | null) => void;
  currentNotification: SystemNotification | null;
}

type AdminTab = 'overview' | 'clients' | 'reports' | 'financials';

const SuperAdminPage: React.FC<SuperAdminPageProps> = ({ agencies, onImpersonate, onUpdateNotification, currentNotification }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'info' | 'warning' | 'error'>('info');

  // Mock Global Metrics
  const totalRevenue = agencies.reduce((acc, curr) => acc + (curr.plan === 'pro' ? 299 : curr.plan === 'enterprise' ? 999 : 0), 0);
  const totalMinutes = 142050; // Mocked global usage
  const totalClients = 124; // Mocked total clients across all agencies

  // Mock Report Generation
  const [reportType, setReportType] = useState('usage');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      alert(`Report (${reportType}) generated successfully! Check your downloads.`);
    }, 1500);
  };

  const handleSetNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notificationMessage.trim()) {
      onUpdateNotification(null);
      return;
    }
    const newNotification: SystemNotification = {
      id: `n-${Date.now()}`,
      message: notificationMessage,
      type: notificationType,
      active: true,
      createdAt: new Date().toISOString()
    };
    onUpdateNotification(newNotification);
    setNotificationMessage('');
    alert('System notification updated.');
  };

  const handleClearNotification = () => {
    onUpdateNotification(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">System Overview</h2>
          <p className="text-slate-500 mt-1">Super Admin Console • Global Metrics & Tenant Management</p>
        </div>

        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'clients'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            My Clients
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'reports'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            Reports
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'financials'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            Financials
          </button>
        </div>
      </div>

      {/* TAB CONTENT: OVERVIEW (COMMAND CENTER) */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

          {/* Row 1: System Health & Critical Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">API Status</p>
                  <p className="text-sm font-bold text-slate-900">Operational</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                <CheckCircle className="w-3 h-3" /> 99.99%
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Database</p>
                  <p className="text-sm font-bold text-slate-900">Healthy</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                <CheckCircle className="w-3 h-3" /> 24ms
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Integrations</p>
                  <p className="text-sm font-bold text-slate-900">Degraded</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-yellow-600 text-xs font-medium">
                <AlertCircle className="w-3 h-3" /> HubSpot
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Active Jobs</p>
                  <p className="text-sm font-bold text-slate-900">124 Processing</p>
                </div>
              </div>
              <div className="text-slate-400 text-xs">
                Peak: 450
              </div>
            </div>
          </div>

          {/* Row 2: Main Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Revenue Column */}
            <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-800 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <DollarSign className="w-32 h-32" />
              </div>
              <div className="relative z-10 space-y-6">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">Monthly Recurring Revenue</p>
                  <h3 className="text-4xl font-bold mt-1">${totalRevenue.toLocaleString()}</h3>
                  <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                    <Activity className="w-3 h-3" /> +14% vs last month
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div>
                    <p className="text-slate-500 text-xs uppercase">ARR</p>
                    <p className="text-lg font-bold">${(totalRevenue * 12).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase">Avg Revenue/User</p>
                    <p className="text-lg font-bold">${Math.round(totalRevenue / agencies.length)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Analytics */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900">System Usage</h3>
                <select className="text-xs border-slate-200 rounded-md text-slate-600">
                  <option>Last 24 Hours</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 uppercase font-semibold">API Calls</p>
                  <h4 className="text-2xl font-bold text-slate-900">2.4M</h4>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-slate-400">75% of monthly quota</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Processing Minutes</p>
                  <h4 className="text-2xl font-bold text-slate-900">{(totalMinutes / 1000).toFixed(1)}k</h4>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <p className="text-xs text-slate-400">45% capacity</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Storage</p>
                  <h4 className="text-2xl font-bold text-slate-900">4.2 TB</h4>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-xs text-slate-400">+120GB today</p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-4 gap-4 border-t border-slate-100 pt-6">
                <div>
                  <p className="text-xs text-slate-400">Total Clients</p>
                  <p className="text-lg font-bold text-slate-900">{totalClients}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">New (This Month)</p>
                  <p className="text-lg font-bold text-green-600">+12</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Churn Rate</p>
                  <p className="text-lg font-bold text-red-500">0.8%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Active Agencies</p>
                  <p className="text-lg font-bold text-slate-900">{agencies.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Activity Feed & Tenant Directory */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Live Activity Feed */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-500" /> Live Activity
                </h3>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {[
                  { time: '2m ago', event: 'New Agency Signup', detail: 'Beta Marketing', type: 'success' },
                  { time: '15m ago', event: 'High API Latency', detail: 'Europe Region', type: 'warning' },
                  { time: '42m ago', event: 'Subscription Upgrade', detail: 'Acme Corp -> Enterprise', type: 'success' },
                  { time: '1h ago', event: 'New Client Added', detail: 'TechFlow Inc.', type: 'info' },
                  { time: '2h ago', event: 'System Backup', detail: 'Completed successfully', type: 'info' },
                  { time: '3h ago', event: 'Failed Login Attempt', detail: 'IP 192.168.1.1', type: 'error' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${item.type === 'success' ? 'bg-green-500' :
                      item.type === 'warning' ? 'bg-yellow-500' :
                        item.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.event}</p>
                      <p className="text-xs text-slate-500">{item.detail}</p>
                    </div>
                    <span className="ml-auto text-xs text-slate-400 font-mono">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tenant Directory (Existing Table, now condensed or full width in col-span-2) */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Tenant Directory</h3>
                <button className="text-xs text-brand-600 hover:underline">View All</button>
              </div>
              <div className="overflow-y-auto">
                {/* Reusing existing table logic but ensuring it fits */}
                <table className="w-full text-left border-collapse">
                  {/* ... Table Header ... */}
                  <thead className="sticky top-0 bg-slate-50 z-10">
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                      <th className="px-6 py-3">Agency</th>
                      <th className="px-6 py-3">Plan</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {agencies.map(agency => (
                      <tr key={agency.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                              {agency.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{agency.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${agency.plan === 'pro'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : agency.plan === 'enterprise'
                              ? 'bg-slate-800 text-white border-slate-600'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                            {agency.plan}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${agency.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                            <span className="capitalize text-slate-700">{agency.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button
                            onClick={() => onImpersonate(agency)}
                            className="text-indigo-600 hover:text-indigo-800 font-medium text-xs border border-indigo-200 rounded px-2 py-1 bg-indigo-50"
                          >
                            Login
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MY CLIENTS */}
      {activeTab === 'clients' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ClientsPage agencyId="super_admin" />
        </div>
      )}

      {/* TAB CONTENT: REPORTS */}
      {activeTab === 'reports' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Generate System Reports</h3>
              <p className="text-slate-500 mt-2">Export data for analysis across all agencies and clients.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Report Type</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['usage', 'revenue', 'growth'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setReportType(type)}
                      className={`px-4 py-3 rounded-lg border text-sm font-medium capitalize transition-all ${reportType === type
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                    >
                      {type} Report
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
                <select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Last 30 Days</option>
                  <option>Last Quarter</option>
                  <option>Year to Date</option>
                  <option>All Time</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isGeneratingReport ? (
                    'Generating...'
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Report (CSV)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: FINANCIALS & NOTIFICATIONS */}
      {activeTab === 'financials' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

          {/* Notification Manager */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">System-Wide Notifications</h3>
                <p className="text-sm text-slate-500">Broadcast messages to all users (Maintenance, Outages, etc.)</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Current Active Notification</p>
              {currentNotification ? (
                <div className="flex justify-between items-center">
                  <div className={`flex items-center gap-2 text-sm font-medium ${currentNotification.type === 'error' ? 'text-red-700' :
                    currentNotification.type === 'warning' ? 'text-amber-700' : 'text-blue-700'
                    }`}>
                    <AlertCircle className="w-4 h-4" />
                    {currentNotification.message}
                  </div>
                  <button onClick={handleClearNotification} id="clear-notification-btn" className="text-xs text-red-600 hover:underline">Clear</button>
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No active notifications.</p>
              )}
            </div>

            <form onSubmit={handleSetNotification} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">New Notification Message</label>
                <input
                  id="notification-message-input"
                  type="text"
                  value={notificationMessage}
                  onChange={e => setNotificationMessage(e.target.value)}
                  placeholder="e.g., System maintenance scheduled for Saturday at 3 AM EST."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  id="notification-type-select"
                  value={notificationType}
                  onChange={e => setNotificationType(e.target.value as any)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Critical</option>
                </select>
              </div>
              <button
                id="broadcast-notification-btn"
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Broadcast
              </button>
            </form>
          </div>

          {/* Cost & Usage Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cost Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-slate-500" /> Cost Breakdown
                </h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Last 30 Days</span>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'AI Model Usage (LLM)', value: '$4,250.00', percent: 45, color: 'bg-blue-500' },
                  { label: 'Voice Synthesis (ElevenLabs)', value: '$3,120.50', percent: 33, color: 'bg-purple-500' },
                  { label: 'Intelligence Analysis', value: '$1,450.25', percent: 15, color: 'bg-green-500' },
                  { label: 'Storage & Infrastructure', value: '$680.00', percent: 7, color: 'bg-orange-500' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-bold text-slate-900">{item.value}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percent}%` }}></div>
                    </div>
                  </div>
                ))}
                <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-700">Total Operational Cost</span>
                  <span className="text-xl font-bold text-slate-900">$9,500.75</span>
                </div>
              </div>
            </div>

            {/* Tool Usage & Failures */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-slate-500" /> Tool Usage Stats
                </h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Failure Rate</span>
              </div>

              <div className="overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs uppercase text-slate-500 border-b border-slate-100">
                      <th className="pb-2 font-semibold">Tool Name</th>
                      <th className="pb-2 font-semibold text-right">Calls</th>
                      <th className="pb-2 font-semibold text-right">Failures</th>
                      <th className="pb-2 font-semibold text-right">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {[
                      { name: 'ElevenLabs TTS', calls: '85.2k', failures: '12', rate: '0.01%' },
                      { name: 'OpenAI GPT-4', calls: '124.5k', failures: '45', rate: '0.04%' },
                      { name: 'HubSpot Sync', calls: '42.1k', failures: '1,205', rate: '2.86%', error: true },
                      { name: 'Nango Auth', calls: '12.8k', failures: '8', rate: '0.06%' },
                      { name: 'SendGrid Email', calls: '8.4k', failures: '0', rate: '0.00%' },
                    ].map((tool, i) => (
                      <tr key={i}>
                        <td className="py-3 font-medium text-slate-700">{tool.name}</td>
                        <td className="py-3 text-right text-slate-600">{tool.calls}</td>
                        <td className={`py-3 text-right ${tool.error ? 'text-red-600 font-bold' : 'text-slate-600'}`}>{tool.failures}</td>
                        <td className={`py-3 text-right ${tool.error ? 'text-red-600 font-bold' : 'text-green-600'}`}>{tool.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPage;