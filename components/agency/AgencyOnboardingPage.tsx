import React, { useState } from 'react';
import { UserPlus, Building, CheckCircle, ArrowRight, Mail, Zap, Globe } from 'lucide-react';

const AgencyOnboardingPage: React.FC = () => {
    const [activeStep, setActiveStep] = useState<'select' | 'client-form' | 'webhook-setup' | 'success'>('select');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        korraEnabled: true,
        webhookUrl: ''
    });

    const handleClientFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setActiveStep('webhook-setup');
    };

    const handleWebhookSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would make an API call
        setTimeout(() => {
            setActiveStep('success');
        }, 1000);
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', korraEnabled: true, webhookUrl: '' });
        setActiveStep('select');
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Onboarding Center</h2>
                <p className="text-slate-500 mt-1">Setup new accounts and manage client access.</p>
            </div>

            {activeStep === 'select' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <button
                        onClick={() => setActiveStep('client-form')}
                        className="group relative bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all text-left"
                    >
                        <div className="absolute top-6 right-6 p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">New Client Account</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Create a new client workspace. Set up their profile, configure Korra AI access, and send an invitation email.
                        </p>
                    </button>

                    <div className="relative bg-slate-50 p-8 rounded-2xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-center opacity-75">
                        <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 mb-4">
                            <Building className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-400 mb-1">New Sub-Agency</h3>
                        <p className="text-slate-400 text-sm">Available on Enterprise Plan</p>
                    </div>
                </div>
            )}

            {activeStep === 'client-form' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-slate-900">New Client Details</h3>
                            <p className="text-sm text-slate-500">Step 1 of 2: Basic Information</p>
                        </div>
                        <button onClick={() => setActiveStep('select')} className="text-sm text-slate-500 hover:text-slate-900">
                            Cancel
                        </button>
                    </div>

                    <form onSubmit={handleClientFormSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Client / Business Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g. Acme Dental Studio"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Contact Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="contact@acme.com"
                                />
                            </div>
                        </div>

                        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-indigo-900">Korra AI Configuration</h4>
                                    <p className="text-xs text-indigo-700 mt-1 mb-3">
                                        Enable the AI voice assistant for this client immediately upon creation.
                                    </p>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.korraEnabled}
                                            onChange={(e) => setFormData({ ...formData, korraEnabled: e.target.checked })}
                                            className="w-4 h-4 text-indigo-600 rounded border-indigo-300 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm font-medium text-indigo-900">Enable Korra AI Agent</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setActiveStep('select')}
                                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                            >
                                Next: Webhook Setup
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeStep === 'webhook-setup' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-slate-900">Webhook Configuration</h3>
                            <p className="text-sm text-slate-500">Step 2 of 2: Optional Integration Setup</p>
                        </div>
                        <button onClick={() => setActiveStep('select')} className="text-sm text-slate-500 hover:text-slate-900">
                            Cancel
                        </button>
                    </div>

                    <form onSubmit={handleWebhookSubmit} className="p-8 space-y-6">
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-blue-900">Primary Webhook Endpoint</h4>
                                    <p className="text-xs text-blue-700 mt-1 mb-3">
                                        Configure a webhook to receive real-time updates for call events (started, completed, failed).
                                    </p>
                                    <input
                                        type="url"
                                        value={formData.webhookUrl}
                                        onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                                        className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                                        placeholder="https://api.client-system.com/webhooks/calls"
                                    />
                                    <p className="text-xs text-blue-500 mt-2">Leave blank to skip webhook configuration.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setActiveStep('client-form')}
                                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                            >
                                <Mail className="w-4 h-4" />
                                Create & Send Invite
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeStep === 'success' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Client Onboarded Successfully!</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                        An invitation email has been sent to <strong>{formData.email}</strong>. They can now log in and access their portal.
                        {formData.webhookUrl && (
                            <span className="block mt-2 text-sm text-blue-600">Webhook configured: {formData.webhookUrl}</span>
                        )}
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={resetForm}
                            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                        >
                            Onboard Another
                        </button>
                        <button
                            onClick={() => resetForm()} // In real app, navigate to client list
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            View Client List
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgencyOnboardingPage;
