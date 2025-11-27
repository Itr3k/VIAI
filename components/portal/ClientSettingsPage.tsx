import React, { useState } from 'react';
import { PhoneOutgoing, Save, Shield, Volume2 } from 'lucide-react';

const ClientSettingsPage: React.FC = () => {
    const [outboundEnabled, setOutboundEnabled] = useState(false);
    const [outboundNumber, setOutboundNumber] = useState('+1 (555) 000-0000');
    const [voiceId, setVoiceId] = useState('rachel');

    const handleSave = () => {
        // Mock save
        alert('Settings saved successfully!');
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Account Settings</h2>
                    <p className="text-slate-500 mt-1">Manage your voice agent configuration and preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </button>
            </div>

            {/* Outbound Calling Settings */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center">
                        <PhoneOutgoing className="w-5 h-5 mr-2 text-indigo-600" />
                        Outbound Calling
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Configure automated outbound calls for appointment reminders and follow-ups.</p>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-slate-900">Enable Outbound Calls</label>
                            <p className="text-sm text-slate-500">Allow AI agents to initiate calls to your customers.</p>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input
                                type="checkbox"
                                name="toggle"
                                id="toggle"
                                checked={outboundEnabled}
                                onChange={(e) => setOutboundEnabled(e.target.checked)}
                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out checked:translate-x-6 checked:border-indigo-600"
                            />
                            <label
                                htmlFor="toggle"
                                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ${outboundEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                            ></label>
                        </div>
                    </div>

                    {outboundEnabled && (
                        <div className="space-y-4 pt-4 border-t border-slate-100 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Caller ID Number</label>
                                    <input
                                        type="text"
                                        value={outboundNumber}
                                        onChange={(e) => setOutboundNumber(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">The number that will appear on customer phones.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Daily Call Limit</label>
                                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                                        <option>50 calls / day</option>
                                        <option>100 calls / day</option>
                                        <option>500 calls / day</option>
                                        <option>Unlimited</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Allowed Call Types</label>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500 mr-2" />
                                        <span className="text-sm text-slate-700">Appointment Reminders (24h before)</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500 mr-2" />
                                        <span className="text-sm text-slate-700">Follow-up on Missed Inbound Calls</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 mr-2" />
                                        <span className="text-sm text-slate-700">Promotional / Sales Outreach</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Voice Configuration */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center">
                        <Volume2 className="w-5 h-5 mr-2 text-indigo-600" />
                        Voice Configuration
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Customize how your AI agent sounds.</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Agent Voice</label>
                            <select
                                value={voiceId}
                                onChange={(e) => setVoiceId(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            >
                                <option value="rachel">Rachel (American, Female, Calm)</option>
                                <option value="drew">Drew (American, Male, News)</option>
                                <option value="clyde">Clyde (American, Male, Deep)</option>
                                <option value="mimi">Mimi (Australian, Female, Child)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Speaking Rate</label>
                            <input type="range" min="0.5" max="2.0" step="0.1" defaultValue="1.0" className="w-full" />
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Slow</span>
                                <span>Normal</span>
                                <span>Fast</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientSettingsPage;
