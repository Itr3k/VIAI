import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { Search, Plus, Filter, MoreHorizontal, Mail, Shield, Zap, CheckCircle, XCircle, User as UserIcon, Settings, Globe } from 'lucide-react';
import UserManagementModal from '../admin/UserManagementModal';
import WebhookManagementModal from '../webhooks/WebhookManagementModal';

// Mock Data
const MOCK_CLIENTS: User[] = [
    {
        id: 'u-101',
        name: 'Dr. Smith Dental',
        email: 'contact@smithdental.com',
        role: 'client',
        status: 'active',
        agencyId: 'a-1',
        lastLogin: '2023-11-25T10:30:00Z',
        clientSettings: {
            korraEnabled: true
        },
        usageStats: { averageCallsPerDay: 8, totalMinutesUsed: 240, lastActiveDate: '2023-11-25' }
    },
    {
        id: 'u-102',
        name: 'Legal Partners LLC',
        email: 'info@legalpartners.com',
        role: 'client',
        status: 'active',
        agencyId: 'a-1',
        lastLogin: '2023-11-20T14:15:00Z',
        clientSettings: {
            korraEnabled: false
        },
        usageStats: { averageCallsPerDay: 2, totalMinutesUsed: 45, lastActiveDate: '2023-11-20' }
    }
];

interface AgencyClientsPageProps {
    onImpersonate?: (client: User) => void;
}

const AgencyClientsPage: React.FC<AgencyClientsPageProps> = ({ onImpersonate }) => {
    const [clients, setClients] = useState<User[]>(MOCK_CLIENTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState<User | null>(null);
    const [webhookClient, setWebhookClient] = useState<User | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [korraEnabled, setKorraEnabled] = useState(false);

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const newClient: User = {
            id: `u-${Date.now()}`,
            name,
            email,
            role: 'client',
            status: 'invited',
            agencyId: 'a-1', // Mock current agency
            clientSettings: {
                korraEnabled
            }
        };
        setClients([...clients, newClient]);
        setIsModalOpen(false);
        setName('');
        setEmail('');
        setKorraEnabled(false);
    };

    const handleUpdateClient = (updatedClient: User) => {
        setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
        setSelectedClient(null);
    };

    const toggleKorra = (clientId: string) => {
        setClients(clients.map(client => {
            if (client.id === clientId) {
                return {
                    ...client,
                    clientSettings: {
                        ...client.clientSettings,
                        korraEnabled: !client.clientSettings?.korraEnabled
                    }
                };
            }
            return client;
        }));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Client Management</h2>
                    <p className="text-slate-500 mt-1">Manage your client accounts.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    New Client
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
                <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[300px]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Client Name</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Korra AI Agent</th>
                            <th className="px-6 py-4">Last Login</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredClients.map(client => (
                            <tr key={client.id} className="hover:bg-slate-50 transition-colors relative">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                            {client.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{client.name}</p>
                                            <p className="text-slate-500 text-xs">{client.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                        {client.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleKorra(client.id)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${client.clientSettings?.korraEnabled ? 'bg-blue-600' : 'bg-slate-200'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${client.clientSettings?.korraEnabled ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                        <span className="text-xs text-slate-500 ml-2">
                                            {client.clientSettings?.korraEnabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {client.lastLogin ? new Date(client.lastLogin).toLocaleDateString() : 'Never'}
                                </td>
                                <td className="px-6 py-4 text-right relative">
                                    <button
                                        onClick={() => setActiveDropdown(activeDropdown === client.id ? null : client.id)}
                                        className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors"
                                    >
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {activeDropdown === client.id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 z-10 py-1 text-left animate-in fade-in zoom-in duration-200">
                                            <button
                                                onClick={() => {
                                                    if (onImpersonate) onImpersonate(client);
                                                    setActiveDropdown(null);
                                                }}
                                                className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                            >
                                                <UserIcon className="w-4 h-4 text-slate-400" />
                                                Login as Client
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedClient(client);
                                                    setActiveDropdown(null);
                                                }}
                                                className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                            >
                                                <Settings className="w-4 h-4 text-slate-400" />
                                                Manage Client
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setWebhookClient(client);
                                                    setActiveDropdown(null);
                                                }}
                                                className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                            >
                                                <Globe className="w-4 h-4 text-slate-400" />
                                                Manage Webhooks
                                            </button>
                                            <button className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-slate-400" />
                                                Send Email
                                            </button>
                                            <div className="border-t border-slate-100 my-1"></div>
                                            <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                <Shield className="w-4 h-4" />
                                                Suspend Account
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Onboard Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 text-lg">Onboard New Client</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="e.g. Dr. Smith Dental"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="client@example.com"
                                />
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-amber-500" />
                                            Enable Korra AI
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1">Give this client access to the Korra AI agent.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setKorraEnabled(!korraEnabled)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${korraEnabled ? 'bg-blue-600' : 'bg-slate-200'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${korraEnabled ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Onboard Client
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* User Management Modal */}
            {selectedClient && (
                <UserManagementModal
                    user={selectedClient}
                    onClose={() => setSelectedClient(null)}
                    onUpdate={handleUpdateClient}
                    currentUserRole="admin"
                />
            )}

            {/* Webhook Management Modal */}
            {webhookClient && (
                <WebhookManagementModal
                    clientName={webhookClient.name}
                    onClose={() => setWebhookClient(null)}
                />
            )}
        </div>
    );
};

export default AgencyClientsPage;
