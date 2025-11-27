import React, { useState } from 'react';
import { Bot, Sliders, Volume2, Cpu, Zap, Save, CheckCircle, AlertTriangle } from 'lucide-react';

const KorraSystemPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'persona' | 'model' | 'voice' | 'features'>('persona');
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Bot className="w-8 h-8 text-indigo-600" />
                        Korra AI System Control
                    </h2>
                    <p className="text-slate-500 mt-1">Global configuration for the Korra AI agent across all tenants.</p>
                </div>
                <button
                    onClick={handleSave}
                    className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${isSaved ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'}`}
                >
                    {isSaved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                    {isSaved ? 'System Updated' : 'Save Global Changes'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('persona')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'persona' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Sliders className="w-4 h-4" />
                    Base Persona
                </button>
                <button
                    onClick={() => setActiveTab('model')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'model' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Cpu className="w-4 h-4" />
                    LLM Model
                </button>
                <button
                    onClick={() => setActiveTab('voice')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'voice' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Volume2 className="w-4 h-4" />
                    Voice & Audio
                </button>
                <button
                    onClick={() => setActiveTab('features')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'features' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Zap className="w-4 h-4" />
                    Feature Flags
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 min-h-[500px]">
                {activeTab === 'persona' && (
                    <div className="space-y-6 max-w-3xl">
                        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-start gap-3">
                            <Bot className="w-5 h-5 text-indigo-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-indigo-900 text-sm">System Prompt Override</h4>
                                <p className="text-xs text-indigo-700 mt-1">
                                    This prompt serves as the foundation for ALL Korra instances. Client-specific instructions are appended to this base.
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Base System Prompt</label>
                            <textarea
                                className="w-full h-64 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm leading-relaxed"
                                defaultValue={`You are Korra, an advanced AI voice assistant for business.
Your primary goal is to be helpful, professional, and concise.
You should always identify yourself as an AI assistant when asked.
Maintain a friendly but professional tone.
If you do not know the answer, admit it and offer to take a message.`}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Default Temperature</label>
                                <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full" />
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Precise (0.0)</span>
                                    <span>Creative (1.0)</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Max Tokens</label>
                                <input type="number" defaultValue="4096" className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'model' && (
                    <div className="space-y-6 max-w-3xl">
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
                            <Cpu className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm">Google Intelligence Core</h4>
                                <p className="text-xs text-blue-700 mt-1">
                                    Korra is powered by Google's Gemini models for multimodal reasoning and advanced context understanding.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['Google Gemini 1.5 Pro', 'Google Gemini 1.5 Flash', 'GPT-4o', 'Claude 3.5 Sonnet'].map((model) => (
                                <label key={model} className={`relative flex items-start p-4 cursor-pointer rounded-xl border transition-all ${model.includes('Gemini') ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-slate-200 hover:border-indigo-500 hover:bg-indigo-50'}`}>
                                    <input type="radio" name="model" className="mt-1 mr-3" defaultChecked={model === 'Google Gemini 1.5 Pro'} />
                                    <div>
                                        <h4 className="font-bold text-slate-900">{model}</h4>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {model.includes('Gemini') ? 'Recommended for best performance.' : 'Alternative model.'}
                                        </p>
                                    </div>
                                    {model === 'Google Gemini 1.5 Pro' && <span className="absolute top-4 right-4 text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Active</span>}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'voice' && (
                    <div className="space-y-8 max-w-3xl">
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Voice Synthesis Provider</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="border-2 border-indigo-600 bg-indigo-50 p-4 rounded-xl text-center">
                                    <div className="font-bold text-indigo-900">ElevenLabs</div>
                                    <div className="text-xs text-indigo-600 mt-1">Primary</div>
                                </div>
                                <div className="border border-slate-200 p-4 rounded-xl text-center opacity-50">
                                    <div className="font-bold text-slate-700">Deepgram</div>
                                    <div className="text-xs text-slate-500 mt-1">Disabled</div>
                                </div>
                                <div className="border border-slate-200 p-4 rounded-xl text-center opacity-50">
                                    <div className="font-bold text-slate-700">PlayHT</div>
                                    <div className="text-xs text-slate-500 mt-1">Disabled</div>
                                </div>
                            </div>
                        </div>

                        {/* Phone Provisioning - Super Admin Only */}
                        <div className="border-t border-slate-100 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h4 className="font-bold text-slate-900">Phone Number Provisioning</h4>
                                    <p className="text-xs text-slate-500">Assign numbers to Korra for outbound capabilities.</p>
                                </div>
                                <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                                    + Provision Number
                                </button>
                            </div>

                            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-100 text-slate-500 font-semibold">
                                        <tr>
                                            <th className="px-4 py-3">Number</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Assigned To</th>
                                            <th className="px-4 py-3">Capabilities</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-slate-700">+1 (555) 123-4567</td>
                                            <td className="px-4 py-3"><span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full">Active</span></td>
                                            <td className="px-4 py-3 text-slate-600">Global System (Korra)</td>
                                            <td className="px-4 py-3 text-xs text-slate-500">Voice, SMS</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-slate-700">+1 (555) 987-6543</td>
                                            <td className="px-4 py-3"><span className="text-amber-600 font-bold text-xs bg-amber-50 px-2 py-1 rounded-full">Provisioning</span></td>
                                            <td className="px-4 py-3 text-slate-600">-</td>
                                            <td className="px-4 py-3 text-xs text-slate-500">Voice</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'features' && (
                    <div className="space-y-4 max-w-3xl">
                        {[
                            { id: 'f1', name: 'Sentiment Analysis', desc: 'Real-time sentiment tracking during calls.', active: true },
                            { id: 'f2', name: 'Live Transcription', desc: 'Show live transcript to agents/clients.', active: true },
                            { id: 'f3', name: 'CRM Auto-Sync', desc: 'Automatically push call logs to connected CRMs.', active: true },
                            { id: 'f4', name: 'Advanced Reasoning', desc: 'Allow Korra to pause and "think" for complex queries.', active: false },
                            { id: 'f5', name: 'Multi-Language Support', desc: 'Auto-detect and switch languages.', active: false },
                        ].map(feature => (
                            <div key={feature.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
                                <div>
                                    <h4 className="font-bold text-slate-900">{feature.name}</h4>
                                    <p className="text-sm text-slate-500">{feature.desc}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked={feature.active} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KorraSystemPage;
