import React from 'react';
import { IntegrationStatus } from '../../types';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

const MOCK_INTEGRATION_STATUSES: IntegrationStatus[] = [
    {
        agencyId: 'a-1',
        agencyName: 'Acme Agency',
        elevenLabsStatus: 'connected',
        nangoStatus: 'connected',
        hubSpotStatus: 'connected'
    },
    {
        agencyId: 'a-2',
        agencyName: 'Beta Marketing',
        elevenLabsStatus: 'connected',
        nangoStatus: 'disconnected',
        hubSpotStatus: 'error'
    },
    {
        agencyId: 'a-3',
        agencyName: 'Charlie Corp',
        elevenLabsStatus: 'disconnected',
        nangoStatus: 'disconnected',
        hubSpotStatus: 'disconnected'
    },
    {
        agencyId: 'a-4',
        agencyName: 'Delta Dynamics',
        elevenLabsStatus: 'error',
        nangoStatus: 'connected',
        hubSpotStatus: 'connected'
    }
];

const GlobalIntegrationsPage: React.FC = () => {
    const getStatusIcon = (status: 'connected' | 'disconnected' | 'error') => {
        switch (status) {
            case 'connected':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'disconnected':
                return <XCircle className="w-5 h-5 text-slate-300" />;
            case 'error':
                return <AlertTriangle className="w-5 h-5 text-red-500" />;
        }
    };

    const getStatusLabel = (status: 'connected' | 'disconnected' | 'error') => {
        switch (status) {
            case 'connected':
                return <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">Connected</span>;
            case 'disconnected':
                return <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Disconnected</span>;
            case 'error':
                return <span className="text-xs font-medium text-red-700 bg-red-50 px-2 py-1 rounded-full">Error</span>;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Global Integrations</h2>
                    <p className="text-slate-500 mt-1">Monitor integration health across all agencies.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    Refresh Status
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                            <th className="px-6 py-4">Agency</th>
                            <th className="px-6 py-4 text-center">ElevenLabs</th>
                            <th className="px-6 py-4 text-center">Nango (Unified API)</th>
                            <th className="px-6 py-4 text-center">HubSpot</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {MOCK_INTEGRATION_STATUSES.map((status) => (
                            <tr key={status.agencyId} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    {status.agencyName}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col items-center gap-1">
                                        {getStatusIcon(status.elevenLabsStatus)}
                                        {getStatusLabel(status.elevenLabsStatus)}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col items-center gap-1">
                                        {getStatusIcon(status.nangoStatus)}
                                        {getStatusLabel(status.nangoStatus)}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col items-center gap-1">
                                        {getStatusIcon(status.hubSpotStatus)}
                                        {getStatusLabel(status.hubSpotStatus)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GlobalIntegrationsPage;
