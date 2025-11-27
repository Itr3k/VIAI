import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  LineChart, Line
} from 'recharts';
import { Clock, Activity, TrendingUp, Phone, AlertTriangle, CheckCircle, Zap, Trophy } from 'lucide-react';
import { AgentPerformanceMetric, CallVolumeMetric } from '../../types';
import ClientOnly from '../ui/ClientOnly';

// --- METRIC CARDS ---

export const MinutesUsageCard: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Minutes Usage</p>
          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">MTD</span>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <h3 className="text-4xl font-bold text-slate-900">4,281</h3>
          <span className="text-slate-500 font-medium text-lg">min</span>
        </div>
        <div className="mt-2 flex gap-4 text-xs text-slate-500">
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-indigo-500 mr-1"></span> 2,100 Inbound</span>
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> 2,181 Outbound</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <p className="text-sm text-slate-500">Last Month: 4,450</p>
        <span className="text-red-500 text-sm font-bold flex items-center bg-red-50 px-2 py-0.5 rounded">
          ↓ 3.8%
        </span>
      </div>
    </div>
  );
};

export const ToolHealthCard: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">System Health</p>
        <span className="text-xs text-slate-400">Updated 2m ago</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-700 font-medium text-sm">ElevenLabs API</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Healthy</span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-700 font-medium text-sm">Gemini Analysis</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Healthy</span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-700 font-medium text-sm">Nango Integration</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">Degraded</span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- CHARTS ---

interface AgentPerformanceProps {
  data: AgentPerformanceMetric[];
}

export const AgentPerformanceGraph: React.FC<AgentPerformanceProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Top Agents by Volume</h3>
      <div className="flex justify-center items-center w-full bg-slate-50 rounded-lg p-2 overflow-hidden">
        <ClientOnly>
          <BarChart width={500} height={300} data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" hide />
            <YAxis
              dataKey="agentName"
              type="category"
              width={100}
              tick={{ fill: '#475569', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <RechartsTooltip
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="calls" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ClientOnly>
      </div>
    </div>
  );
};

interface CallVolumeProps {
  data: CallVolumeMetric[];
}

export const CallVolumeGraph: React.FC<CallVolumeProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Call Volume (30 Days)</h3>
      <div className="flex justify-center items-center w-full bg-slate-50 rounded-lg p-2 overflow-hidden">
        <ClientOnly>
          <LineChart width={500} height={300} data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              minTickGap={30}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <RechartsTooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px 0px rgb(0 0 0 / 0.05)' }}
            />
            <Line
              type="monotone"
              dataKey="volume"
              stroke="#6366f1"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ClientOnly>
      </div>
    </div>
  );
};

export const TopClientsWidget: React.FC = () => {
  const topClients = [
    { name: 'Dr. Smith Dental', calls: 145, sentiment: 88, trend: '+12%' },
    { name: 'Legal Partners LLP', calls: 98, sentiment: 72, trend: '+5%' },
    { name: 'TechSolutions Inc', calls: 82, sentiment: 91, trend: '+8%' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Top 3 Clients</h3>
      <div className="space-y-4">
        {topClients.map((client, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-slate-900 text-sm">{client.name}</p>
                <p className="text-xs text-slate-500">{client.calls} calls • {client.sentiment}% sentiment</p>
              </div>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              {client.trend}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SystemHealthPanel: React.FC = () => {
  const services = [
    { name: 'Gemini AI', status: 'operational', latency: '45ms' },
    { name: 'ElevenLabs Voice', status: 'operational', latency: '120ms' },
    { name: 'Twilio SIP', status: 'operational', latency: '25ms' },
    { name: 'Database', status: 'operational', latency: '12ms' },
    { name: 'Redis Cache', status: 'operational', latency: '5ms' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-blue-600" />
        System Health
      </h3>
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center">
              <div className={`w-2.5 h-2.5 rounded-full mr-3 ${service.status === 'operational' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <span className="font-medium text-slate-700">{service.name}</span>
            </div>
            <div className="flex items-center text-sm text-slate-500">
              <span className="mr-3">{service.status === 'operational' ? 'Operational' : 'Down'}</span>
              <span className="font-mono text-xs bg-white px-2 py-1 rounded border border-slate-200">{service.latency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ApiUsagePanel: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
        <Zap className="w-5 h-5 mr-2 text-amber-500" />
        Global API Usage (24h)
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Gemini Tokens</p>
          <p className="text-2xl font-bold text-slate-900">14.2M</p>
          <p className="text-xs text-emerald-600 mt-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +12%</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">ElevenLabs Char</p>
          <p className="text-2xl font-bold text-slate-900">4.8M</p>
          <p className="text-xs text-emerald-600 mt-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +8%</p>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600">Gemini Quota</span>
            <span className="text-slate-900 font-medium">65%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600">ElevenLabs Quota</span>
            <span className="text-slate-900 font-medium">82%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-amber-500 h-2 rounded-full" style={{ width: '82%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TopAgenciesWidget: React.FC = () => {
  const agencies = [
    { name: 'Acme Agency', clients: 12, revenue: '$4,200', growth: '+15%' },
    { name: 'Global Corp', clients: 8, revenue: '$3,100', growth: '+8%' },
    { name: 'Stark Industries', clients: 24, revenue: '$12,500', growth: '+22%' },
    { name: 'Wayne Ent', clients: 18, revenue: '$9,800', growth: '+12%' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
        <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
        Top Performing Agencies
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50">
            <tr>
              <th className="px-3 py-2 rounded-l-lg">Agency</th>
              <th className="px-3 py-2">Clients</th>
              <th className="px-3 py-2">Revenue</th>
              <th className="px-3 py-2 rounded-r-lg">Growth</th>
            </tr>
          </thead>
          <tbody>
            {agencies.map((agency) => (
              <tr key={agency.name} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                <td className="px-3 py-3 font-medium text-slate-900">{agency.name}</td>
                <td className="px-3 py-3 text-slate-600">{agency.clients}</td>
                <td className="px-3 py-3 text-slate-600">{agency.revenue}</td>
                <td className="px-3 py-3 text-emerald-600 font-medium">{agency.growth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};