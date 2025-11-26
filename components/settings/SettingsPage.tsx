import React, { useState } from 'react';
import { Save, Globe, CheckCircle, AlertTriangle, Loader2, Image as ImageIcon } from 'lucide-react';
import { AgencySettings } from '../../types';

interface SettingsPageProps {
    settings?: AgencySettings;
    onUpdate?: (settings: AgencySettings) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onUpdate }) => {
    // Local state for immediate feedback, but should ideally sync with props
    const [localSettings, setLocalSettings] = useState<AgencySettings>(settings || {
        name: 'Acme Agency',
        nangoConnected: false,
        logoUrl: '',
        customDomain: '',
        domainStatus: null,
        korraEnabled: true
    });

    const [isVerifyingDomain, setIsVerifyingDomain] = useState(false);

    const updateSetting = (key: keyof AgencySettings, value: any) => {
        const newSettings = { ...localSettings, [key]: value };
        setLocalSettings(newSettings);
        if (onUpdate) onUpdate(newSettings);
    };

    const handleVerifyDomain = () => {
        if (!localSettings.customDomain) return;
        setIsVerifyingDomain(true);
        // Mock DNS Check
        setTimeout(() => {
            setIsVerifyingDomain(false);
            updateSetting('domainStatus', 'active');
        }, 2000);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Global Settings</h2>
                <p className="text-slate-500 mt-1">Manage system-wide configurations and preferences.</p>
            </div>

            {/* Branding Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-slate-400" />
                    Branding & White Labeling
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Agency Logo URL</label>
                        <input
                            type="url"
                            value={localSettings.logoUrl || ''}
                            onChange={e => updateSetting('logoUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                            placeholder="https://example.com/logo.png"
                        />
                        <p className="text-xs text-slate-500 mt-1">Recommended size: 200x50px (PNG or SVG)</p>
                    </div>
                    <div className="flex items-center justify-center bg-slate-50 border border-dashed border-slate-300 rounded-lg h-24">
                        {localSettings.logoUrl ? (
                            <img src={localSettings.logoUrl} alt="Preview" className="max-h-16 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        ) : (
                            <span className="text-xs text-slate-400">Logo Preview</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Domain Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-slate-400" />
                    Custom Domain
                </h3>
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Domain Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={localSettings.customDomain || ''}
                                onChange={e => updateSetting('customDomain', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm ${localSettings.domainStatus === 'active' ? 'border-green-500 pr-10' : 'border-slate-300'
                                    }`}
                                placeholder="voice.youragency.com"
                            />
                            {localSettings.domainStatus === 'active' && (
                                <CheckCircle className="w-5 h-5 text-green-500 absolute right-3 top-2.5" />
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleVerifyDomain}
                        disabled={isVerifyingDomain || !localSettings.customDomain || localSettings.domainStatus === 'active'}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all min-w-[100px] ${localSettings.domainStatus === 'active'
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        {isVerifyingDomain ? (
                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        ) : localSettings.domainStatus === 'active' ? (
                            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Verified</span>
                        ) : 'Verify DNS'}
                    </button>
                </div>
                {localSettings.domainStatus === 'active' && (
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Domain active and SSL certificate provisioned.
                    </p>
                )}
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                        <div className="text-xs text-slate-600">
                            <p className="font-medium">DNS Configuration Required</p>
                            <p className="mt-1">Create a CNAME record pointing to <code className="bg-slate-200 px-1 py-0.5 rounded">cname.viai.app</code></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* General Preferences */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">General Preferences</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-900">Maintenance Mode</p>
                            <p className="text-sm text-slate-500">Disable access for non-admin users</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-900">Korra AI Assistant</p>
                            <p className="text-sm text-slate-500">Enable voice/chat AI assistant for all users</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={localSettings.korraEnabled ?? true}
                                onChange={(e) => updateSetting('korraEnabled', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
