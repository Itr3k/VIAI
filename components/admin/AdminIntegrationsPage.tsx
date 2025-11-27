import React, { useState } from 'react';
import { Settings, Link, Shield, Globe, Key } from 'lucide-react';

const AdminIntegrationsPage: React.FC = () => {
    const [nangoPublicKey, setNangoPublicKey] = useState('');
    const [nangoSecretKey, setNangoSecretKey] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock save
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Global Integrations</h2>
                    <p className="text-slate-500 mt-1">Manage platform-level connections and API keys.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Nango Configuration */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                            <Link className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Nango.dev Configuration</h3>
                            <p className="text-sm text-slate-500">Unified API for integrations</p>
                        </div>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Public Key</label>
                                <div className="relative">
                                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                    <input
                                        type="text"
                                        value={nangoPublicKey}
                                        onChange={(e) => setNangoPublicKey(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono"
                                        placeholder="pk_test_..."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Secret Key</label>
                                <div className="relative">
                                    <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                    <input
                                        type="password"
                                        value={nangoSecretKey}
                                        onChange={(e) => setNangoSecretKey(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono"
                                        placeholder="sk_test_..."
                                    />
                                </div>
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${isSaved ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                                >
                                    {isSaved ? 'Configuration Saved' : 'Save Keys'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Global Webhook Settings */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Global Webhooks</h3>
                            <p className="text-sm text-slate-500">System-wide event notifications</p>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-medium text-slate-900">System Events</span>
                                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-medium">Active</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-3">
                                    Receive notifications for new agency signups, critical errors, and system alerts.
                                </p>
                                <input
                                    type="text"
                                    readOnly
                                    value="https://api.internal-monitor.com/webhooks/system"
                                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-600"
                                />
                            </div>
                            <button className="w-full py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                Configure Global Endpoints
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Settings className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Integrations Hub</h3>
                <p className="text-slate-500 max-w-md">
                    Configure global integrations for Twilio, ElevenLabs, and Vapi here. These settings will apply to all tenants unless overridden.
                </p>
            </div>
        </div>
    );
};

export default AdminIntegrationsPage;
