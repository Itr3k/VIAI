import React, { useState } from 'react';
import { UserPlus, Building, CheckCircle, ArrowRight, Mail, Shield, Globe } from 'lucide-react';

const SuperAdminOnboardingPage: React.FC = () => {
    const [activeStep, setActiveStep] = useState<'select' | 'agency-form' | 'client-form' | 'success'>('select');
    const [successMessage, setSuccessMessage] = useState('');

    const handleCreateAgency = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage('New Agency Tenant created successfully.');
        setActiveStep('success');
    };

    const handleCreateClient = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage('New Client Account created successfully.');
        setActiveStep('success');
    };

    const resetForm = () => {
        setActiveStep('select');
        setSuccessMessage('');
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Global Onboarding</h2>
                <p className="text-slate-500 mt-1">Provision new tenants and accounts across the platform.</p>
            </div>

            {activeStep === 'select' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* Option 1: New Agency */}
                    <button
                        onClick={() => setActiveStep('agency-form')}
                        className="group relative bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-500/50 transition-all text-left"
                    >
                        <div className="absolute top-6 right-6 p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                            <Building className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">New Agency Tenant</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Provision a new white-label agency environment. Includes subdomain setup, admin account, and billing configuration.
                        </p>
                    </button>

                    {/* Option 2: New Client */}
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
                            Add a client to an existing agency. Useful for manual provisioning or support requests.
                        </p>
                    </button>
                </div>
            )}

            {activeStep === 'agency-form' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-slate-900">Provision New Agency</h3>
                            <p className="text-sm text-slate-500">Set up a new tenant environment.</p>
                        </div>
                        <button onClick={() => setActiveStep('select')} className="text-sm text-slate-500 hover:text-slate-900">
                            Cancel
                        </button>
                    </div>

                    <form onSubmit={handleCreateAgency} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Agency Name</label>
                                <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g. Elite Marketing" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subdomain</label>
                                <div className="flex">
                                    <input type="text" required className="flex-1 px-4 py-2 border border-r-0 border-slate-300 rounded-l-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="elite" />
                                    <span className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-r-lg text-slate-500 text-sm flex items-center">.viai.com</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Admin Email</label>
                                <input type="email" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="admin@agency.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Plan</label>
                                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                                    <option value="pro">Pro Plan</option>
                                    <option value="enterprise">Enterprise Plan</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={() => setActiveStep('select')} className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50">Back</button>
                            <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 shadow-sm flex items-center gap-2">
                                <Building className="w-4 h-4" /> Provision Tenant
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeStep === 'client-form' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-slate-900">Add Global Client</h3>
                            <p className="text-sm text-slate-500">Add a client to any agency.</p>
                        </div>
                        <button onClick={() => setActiveStep('select')} className="text-sm text-slate-500 hover:text-slate-900">
                            Cancel
                        </button>
                    </div>

                    <form onSubmit={handleCreateClient} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Assign to Agency</label>
                                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="">Select an Agency...</option>
                                    <option value="1">Voice Intelligence Ltd</option>
                                    <option value="2">Growth Partners</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
                                <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Northside Dental" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                                <input type="email" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="contact@northside.com" />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={() => setActiveStep('select')} className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50">Back</button>
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-sm flex items-center gap-2">
                                <UserPlus className="w-4 h-4" /> Create Client
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
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Success!</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                        {successMessage}
                    </p>
                    <button
                        onClick={resetForm}
                        className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm"
                    >
                        Return to Onboarding
                    </button>
                </div>
            )}
        </div>
    );
};

export default SuperAdminOnboardingPage;
