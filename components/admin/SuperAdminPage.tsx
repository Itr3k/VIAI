import React from 'react';
import { Agency } from '../../types';
import { Activity, DollarSign, Users, LogIn } from 'lucide-react';

interface SuperAdminPageProps {
  agencies: Agency[];
  onImpersonate: (agency: Agency) => void;
}

const SuperAdminPage: React.FC<SuperAdminPageProps> = ({ agencies, onImpersonate }) => {
  
  // Mock Global Metrics
  const totalRevenue = agencies.reduce((acc, curr) => acc + (curr.plan === 'pro' ? 299 : curr.plan === 'enterprise' ? 999 : 0), 0);
  const totalMinutes = 142050; // Mocked global usage
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">System Overview</h2>
        <p className="text-slate-500 mt-1">Super Admin Console • Global Metrics & Tenant Management</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-800 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <DollarSign className="w-24 h-24" />
           </div>
           <div className="relative z-10">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wide">Monthly Revenue</p>
              <h3 className="text-3xl font-bold mt-2">${totalRevenue.toLocaleString()}</h3>
              <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                 <Activity className="w-3 h-3" /> +14% vs last month
              </p>
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Active Tenants</p>
                 <h3 className="text-3xl font-bold text-slate-900 mt-2">{agencies.length}</h3>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                 <Users className="w-6 h-6" />
              </div>
           </div>
           <p className="text-slate-400 text-xs mt-4">Across Free, Pro, and Enterprise plans</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Global Minutes</p>
                 <h3 className="text-3xl font-bold text-slate-900 mt-2">{(totalMinutes / 1000).toFixed(1)}k</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                 <Activity className="w-6 h-6" />
              </div>
           </div>
           <p className="text-slate-400 text-xs mt-4">Processed this month</p>
        </div>
      </div>

      {/* Agency Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Tenant Directory</h3>
          <div className="flex gap-2">
             <input 
               type="text" 
               placeholder="Search agencies..." 
               className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
             />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <th className="px-6 py-4">Agency</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Revenue</th>
              <th className="px-6 py-4 text-right">Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {agencies.map(agency => (
              <tr key={agency.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                      {agency.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{agency.name}</p>
                      <p className="text-slate-500 text-xs font-mono">{agency.slug}.viai.app</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${
                    agency.plan === 'pro' 
                      ? 'bg-purple-50 text-purple-700 border-purple-200' 
                      : agency.plan === 'enterprise'
                      ? 'bg-slate-800 text-white border-slate-600'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {agency.plan}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${agency.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                     <span className="capitalize text-slate-700">{agency.status}</span>
                   </div>
                </td>
                <td className="px-6 py-4 font-mono text-slate-600">
                   {agency.plan === 'free' ? '$0' : agency.plan === 'pro' ? '$299' : '$999'}
                   <span className="text-slate-400 text-xs">/mo</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onImpersonate(agency)}
                    className="group flex items-center gap-2 ml-auto text-indigo-600 hover:text-indigo-800 font-medium text-xs transition-colors border border-indigo-200 hover:border-indigo-300 rounded px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100"
                  >
                    <LogIn className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    Login As
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