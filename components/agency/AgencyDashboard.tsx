import React from 'react';
import { Phone, AlertTriangle, XCircle, Clock, Headphones, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { TopClientsWidget, CallVolumeGraph, AgentPerformanceGraph } from '../dashboard/DashboardWidgets';
import { CallVolumeMetric, AgentPerformanceMetric } from '../../types';

// Mock Data for Graphs
const MOCK_VOLUME_DATA: CallVolumeMetric[] = [
    { date: 'Oct 30', volume: 2 },
    { date: 'Nov 02', volume: 6 },
    { date: 'Nov 05', volume: 3 },
    { date: 'Nov 08', volume: 8 },
    { date: 'Nov 11', volume: 4 },
    { date: 'Nov 14', volume: 12 },
    { date: 'Nov 17', volume: 5 },
    { date: 'Nov 20', volume: 9 },
    { date: 'Nov 23', volume: 7 },
    { date: 'Nov 27', volume: 14 },
];

const MOCK_AGENT_DATA: AgentPerformanceMetric[] = [
    { agentName: 'CDW Messaging Agent', calls: 320, sentiment: 85, avgDuration: 120 },
    { agentName: 'Korra', calls: 45, sentiment: 92, avgDuration: 180 },
    { agentName: 'Deluxe Windows', calls: 38, sentiment: 78, avgDuration: 240 },
    { agentName: 'Restaurant Agent', calls: 25, sentiment: 88, avgDuration: 150 },
    { agentName: 'Point H Call Agent', calls: 18, sentiment: 90, avgDuration: 110 },
    { agentName: 'Ava Sales Agent', calls: 12, sentiment: 75, avgDuration: 300 },
    { agentName: 'Eleven', calls: 5, sentiment: 95, avgDuration: 90 },
];

const StatCard: React.FC<{ title: string; value: string | number; subtext: string; icon: React.ReactNode; trend?: 'up' | 'down'; trendValue?: string; color: string }> = ({ title, value, subtext, icon, trend, trendValue, color }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
                {icon}
            </div>
        </div>
        <div className="mt-4 flex items-center text-xs">
            {trend && (
                <span className={`flex items-center font-medium mr-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {trendValue}
                </span>
            )}
            <span className="text-slate-500">{subtext}</span>
        </div>
    </div>
);

const AgencyDashboard: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats Grid */}
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard
                    title="Total Calls"
                    value="364"
                    subtext="180 Inbound • 184 Outbound"
                    icon={<Phone className="w-6 h-6 text-indigo-600" />}
                    color="bg-indigo-50 text-indigo-600"
                />
                <StatCard
                    title="Outbound Mins"
                    value="145"
                    subtext="Avg duration: 2m 10s"
                    icon={<ArrowUpRight className="w-6 h-6 text-blue-600" />}
                    color="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Problem Calls"
                    value="28"
                    subtext="Negative sentiment detected"
                    icon={<AlertTriangle className="w-6 h-6 text-amber-600" />}
                    color="bg-amber-50 text-amber-600"
                />
                <StatCard
                    title="Failed Calls"
                    value="14"
                    subtext="System or connection errors"
                    icon={<XCircle className="w-6 h-6 text-red-600" />}
                    color="bg-red-50 text-red-600"
                />
                <StatCard
                    title="Total Minutes"
                    value="351"
                    subtext="Total conversation time"
                    icon={<Clock className="w-6 h-6 text-purple-600" />}
                    color="bg-purple-50 text-purple-600"
                />
                <StatCard
                    title="Active Agents"
                    value="8"
                    subtext="Unique agents in use"
                    icon={<Headphones className="w-6 h-6 text-emerald-600" />}
                    color="bg-emerald-50 text-emerald-600"
                />
            </div>

            {/* Graphs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[400px]">
                    <CallVolumeGraph data={MOCK_VOLUME_DATA} />
                </div>
                <div className="h-[400px]">
                    <AgentPerformanceGraph data={MOCK_AGENT_DATA} />
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {/* Placeholder for Recent Calls or other widgets */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
                        <p className="text-slate-500 text-sm">Activity feed coming soon...</p>
                    </div>
                </div>
                <div>
                    <TopClientsWidget />
                </div>
            </div>
        </div>
    );
};

export default AgencyDashboard;
