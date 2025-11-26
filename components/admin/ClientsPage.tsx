import React, { useState } from 'react';
import { User, UserRole } from '../../types';

// Mock data for clients - in a real app this would come from an API
const MOCK_CLIENTS: User[] = [
  {
    id: 'c-1',
    name: 'Dr. Smith Dental',
    email: 'dr.smith@dental.com',
    role: 'client',
    status: 'active',
    agencyId: 'agency-1',
    lastLogin: '2023-10-28T09:15:00Z',
    avatarUrl: 'DS'
  },
  {
    id: 'c-2',
    name: 'Legal Partners LLC',
    email: 'info@legalpartners.com',
    role: 'client',
    status: 'invited',
    agencyId: 'agency-1',
    avatarUrl: 'LP'
  }
];

interface ClientsPageProps {
  agencyId?: string;
}

const ClientsPage: React.FC<ClientsPageProps> = ({ agencyId }) => {
  // Filter initial clients if agencyId is provided, otherwise show all (or specific logic)
  // For this mock, if agencyId is 'super_admin', we might show specific clients, 
  // or if agencyId is provided, we filter by it.
  const initialClients = agencyId
    ? MOCK_CLIENTS.filter(c => c.agencyId === agencyId)
    : MOCK_CLIENTS;

  const [clients, setClients] = useState<User[]>(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: User = {
      id: `c-${Date.now()}`,
      name,
      email,
      role: 'client',
      status: 'invited',
      agencyId: agencyId || 'agency-1',
      avatarUrl: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    };
    setClients([...clients, newClient]);
    setIsModalOpen(false);
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Client Management</h2>
          <p className="text-slate-500 mt-1">Manage your agency clients and their access.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Client
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Login</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {clients.map(client => (
              <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                      {client.avatarUrl}
                    </div>
                    <span className="font-medium text-slate-900">{client.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{client.email}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${client.status === 'active' ? 'bg-green-500' : 'bg-amber-400'}`}></span>
                    <span className="capitalize text-slate-700">{client.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {client.lastLogin ? new Date(client.lastLogin).toLocaleString() : 'Never'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-brand-600 hover:text-brand-800 font-medium text-sm transition-colors">
                    Manage
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No clients found. Add your first client to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-lg">Add New Client</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client / Company Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  placeholder="e.g. Dr. Smith Dental"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  placeholder="contact@client.com"
                />
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
                  className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
