import React, { useState } from 'react';
import { Agency } from '../../types';
import { SystemHealthPanel, ApiUsagePanel, TopAgenciesWidget, MinutesUsageCard } from '../dashboard/DashboardWidgets';
import { Key, Filter, Plus, Settings } from 'lucide-react';

interface SuperAdminPageProps {
  agencies: Agency[];
  onImpersonate: (agency: Agency) => void;
}

const SuperAdminPage: React.FC<SuperAdminPageProps> = ({ agencies, onImpersonate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [apiKeyGemini, setApiKeyGemini] = useState('');
  const [apiKeyElevenLabs, setApiKeyElevenLabs] = useState('');

  const filteredAgencies = agencies.filter(agency =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Platform Command Center</h2>
          <p className="text-slate-500 mt-1">Global system monitoring and administration.</p>
        </div>
        <div className="flex gap-3 mr-12">
          <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            Export Logs
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
            System Maintenance
          </button>
        </div>
      </div>

      {/* Command Center Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Row 1: High Level Metrics */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Global Revenue</p>
            <div className="mt-4 flex items-baseline gap-2">
              <h3 className="text-4xl font-bold text-slate-900">$42,850</h3>
              <span className="text-emerald-500 font-medium text-sm bg-emerald-50 px-2 py-0.5 rounded">+12.5%</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-500">
            Projected: $55,000
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Active Tenants</p>
            <div className="mt-4 flex items-baseline gap-2">
              <h3 className="text-4xl font-bold text-slate-900">{agencies.length}</h3>
              <span className="text-slate-500 font-medium text-sm">Agencies</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-500">
            Total Users: 142
          </div>
        </div>

        <MinutesUsageCard />

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Global Outcomes</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Answered</span>
                <span className="font-bold text-slate-900">45%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Voicemail</span>
                <span className="font-bold text-slate-900">35%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Hangup</span>
                <span className="font-bold text-slate-900">20%</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400 text-center">
            Based on last 30 days
          </div>
        </div>

        {/* Row 2: System Health & Usage */}
        <SystemHealthPanel />
        <ApiUsagePanel />
        <TopAgenciesWidget />
      </div>

      {/* System Settings (API Keys) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900 flex items-center">
            <Key className="w-5 h-5 mr-2 text-slate-500" />
            System Settings & API Keys
          </h3>
          <p className="text-sm text-slate-500 mt-1">Manage global API keys for Gemini and ElevenLabs.</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Global Gemini API Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKeyGemini}
                onChange={(e) => setApiKeyGemini(e.target.value)}
                placeholder="sk-..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <button className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-medium text-sm">Update</button>
            </div>
            <p className="text-xs text-slate-500 mt-1">Used for system-wide intelligence if agency keys are missing.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Global ElevenLabs API Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKeyElevenLabs}
                onChange={(e) => setApiKeyElevenLabs(e.target.value)}
                placeholder="xi-..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <button className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-medium text-sm">Update</button>
            </div>
            <p className="text-xs text-slate-500 mt-1">Fallback for voice synthesis.</p>
          </div>
        </div>
      </div>

      {/* Tenant Directory */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Tenant Directory</h3>
            <p className="text-sm text-slate-500">Manage all registered agencies and their status.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-medium text-sm flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Tenant
            </button>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Agency Name</th>
              <th className="px-6 py-4">Subdomain</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredAgencies.map((agency) => (
              <tr key={agency.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                      {agency.name.substring(0, 2).toUpperCase()}
                    </div>
                    {agency.name}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{agency.slug}.viai.com</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${agency.plan === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                    agency.plan === 'pro' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                    {agency.plan}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${agency.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {agency.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{new Date(agency.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onImpersonate(agency)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-xs mr-3"
                  >
                    Impersonate
                  </button>
                  <button className="text-slate-400 hover:text-slate-600">
                    <Settings className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminPage;