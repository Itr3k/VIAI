import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  LineChart, Line
} from 'recharts';
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
                tick={{fill: '#475569', fontSize: 12}} 
                axisLine={false}
                tickLine={false}
              />
              <RechartsTooltip 
                cursor={{fill: '#f1f5f9'}}
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
                tick={{fill: '#94a3b8', fontSize: 11}} 
                axisLine={false} 
                tickLine={false}
                minTickGap={30}
              />
              <YAxis 
                tick={{fill: '#94a3b8', fontSize: 11}} 
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