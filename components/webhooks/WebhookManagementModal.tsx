import React, { useState } from 'react';
import { X, Plus, Trash2, Globe, Shield, Check } from 'lucide-react';

interface Webhook {
    id: string;
    url: string;
    events: string[];
    secret: string;
    isActive: boolean;
}

interface WebhookManagementModalProps {
    clientName: string;
    onClose: () => void;
}

const WebhookManagementModal: React.FC<WebhookManagementModalProps> = ({ clientName, onClose }) => {
    const [webhooks, setWebhooks] = useState<Webhook[]>([
        { id: 'wh_1', url: 'https://api.client.com/webhooks/calls', events: ['call.completed'], secret: 'whsec_...', isActive: true }
    ]);
    const [isAdding, setIsAdding] = useState(false);
    const [newUrl, setNewUrl] = useState('');
    const [selectedEvents, setSelectedEvents] = useState<string[]>(['call.completed']);

    const availableEvents = [
        { id: 'call.started', label: 'Call Started' },
        { id: 'call.completed', label: 'Call Completed' },
        { id: 'call.failed', label: 'Call Failed' },
        { id: 'analysis.ready', label: 'Analysis Ready' },
        { id: 'crm.action', label: 'CRM Action Triggered' }
    ];

    const handleAddWebhook = () => {
        if (!newUrl) return;
        const newWebhook: Webhook = {
            id: `wh_${Date.now()}`,
            url: newUrl,
            events: selectedEvents,
            secret: `whsec_${Math.random().toString(36).substring(7)}`,
            isActive: true
        };
        setWebhooks([...webhooks, newWebhook]);
        setIsAdding(false);
        setNewUrl('');
        setSelectedEvents(['call.completed']);
    };

    const handleDelete = (id: string) => {
        setWebhooks(webhooks.filter(wh => wh.id !== id));
    };

    const toggleEvent = (eventId: string) => {
        if (selectedEvents.includes(eventId)) {
            setSelectedEvents(selectedEvents.filter(e => e !== eventId));
        } else {
            setSelectedEvents([...selectedEvents, eventId]);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">Manage Webhooks</h3>
                        <p className="text-sm text-slate-500">Configure webhooks for {clientName}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {/* Webhook List */}
                    <div className="space-y-4">
                        {webhooks.map(webhook => (
                            <div key={webhook.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors bg-white shadow-sm">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-mono text-sm text-slate-700 font-medium break-all">{webhook.url}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${webhook.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                                                    {webhook.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                                <span className="text-xs text-slate-400">•</span>
                                                <span className="text-xs text-slate-500 font-mono">Secret: {webhook.secret.substring(0, 8)}...</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(webhook.id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {webhook.events.map(event => (
                                        <span key={event} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">
                                            {event}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {webhooks.length === 0 && !isAdding && (
                            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                <Globe className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                <p>No webhooks configured.</p>
                            </div>
                        )}
                    </div>

                    {/* Add New Form */}
                    {isAdding ? (
                        <div className="mt-6 border border-blue-100 bg-blue-50/50 rounded-xl p-5 animate-in slide-in-from-bottom-2">
                            <h4 className="font-bold text-slate-900 mb-4 text-sm">Add New Endpoint</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Endpoint URL</label>
                                    <input
                                        type="url"
                                        value={newUrl}
                                        onChange={e => setNewUrl(e.target.value)}
                                        placeholder="https://api.yoursystem.com/webhook"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Trigger Events</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {availableEvents.map(event => (
                                            <label key={event.id} className={`flex items-center p-2 rounded border cursor-pointer transition-all ${selectedEvents.includes(event.id) ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={selectedEvents.includes(event.id)}
                                                    onChange={() => toggleEvent(event.id)}
                                                />
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center mr-2 ${selectedEvents.includes(event.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                                                    {selectedEvents.includes(event.id) && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                <span className="text-xs font-medium">{event.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        onClick={() => setIsAdding(false)}
                                        className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddWebhook}
                                        disabled={!newUrl || selectedEvents.length === 0}
                                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Create Webhook
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="mt-6 w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Webhook Endpoint
                        </button>
                    )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Webhooks are signed with a secret key for security.
                </div>
            </div>
        </div>
    );
};

export default WebhookManagementModal;
