import React, { useState } from 'react';
import { Bot, Search, Plus, MoreHorizontal, Mic, Play, Settings } from 'lucide-react';

const MOCK_AGENTS = [
    { id: '1', name: 'Receptionist Sarah', voiceId: '21m00Tcm4TlvDq8ikWAM', type: 'Inbound', client: 'Dr. Smith Dental', status: 'Active', calls: 1240 },
    { id: '2', name: 'Sales Rep Mike', voiceId: 'AZnzlk1XvdvUeBnXml56', type: 'Outbound', client: 'Tech Solutions Inc', status: 'Active', calls: 850 },
    { id: '3', name: 'Support Agent Jen', voiceId: 'EXAVITQu4vr4xnSDxMaL', type: 'Inbound', client: 'Legal Partners LLP', status: 'Paused', calls: 320 },
    { id: '4', name: 'Appointment Setter', voiceId: 'ErXwobaYiN019PkySvjV', type: 'Outbound', client: 'Acme Agency', status: 'Active', calls: 2100 },
];

const ElevenLabsAgentsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAgents = MOCK_AGENTS.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.client.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">ElevenLabs Agents</h2>
                    <p className="text-slate-500 mt-1">Manage AI voice agents connected to client accounts.</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Agent
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search agents or clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 outline-none focus:border-blue-500">
                        <option>All Statuses</option>
                        <option>Active</option>
                        <option>Paused</option>
                    </select>
                    <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 outline-none focus:border-blue-500">
                        <option>All Types</option>
                        <option>Inbound</option>
                        <option>Outbound</option>
                    </select>
                </div>
            </div>

            {/* Agents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map((agent) => (
                    <div key={agent.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{agent.name}</h3>
                                    <p className="text-xs text-slate-500">{agent.type} Agent</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${agent.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {agent.status}
                            </span>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Client</span>
                                <span className="font-medium text-slate-900">{agent.client}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Voice ID</span>
                                <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{agent.voiceId}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Total Calls</span>
                                <span className="font-medium text-slate-900">{agent.calls.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-slate-100">
                            <button className="flex-1 flex items-center justify-center px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                                <Play className="w-4 h-4 mr-2" />
                                Test
                            </button>
                            <button className="flex-1 flex items-center justify-center px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                                <Settings className="w-4 h-4 mr-2" />
                                Config
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New Card Placeholder */}
                <button className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all group h-full min-h-[250px]">
                    <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center mb-3 transition-colors">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-medium">Deploy New Agent</span>
                </button>
            </div>
        </div>
    );
};

export default ElevenLabsAgentsPage;
