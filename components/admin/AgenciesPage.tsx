import React, { useState } from 'react';
import { Agency, PlanType } from '../../types';

export const MOCK_AGENCIES: Agency[] = [
  {
    id: 'a-1',
    name: 'Acme Agency',
    slug: 'acme',
    adminEmail: 'john@acme-agency.com',
    plan: 'pro',
    status: 'active',
    createdAt: '2023-01-15T00:00:00Z',
    logoUrl: 'AC'
  },
  {
    id: 'a-2',
    name: 'Beta Marketing',
    slug: 'beta',
    adminEmail: 'sarah@beta.com',
    plan: 'free',
    status: 'inactive',
    createdAt: '2023-03-10T00:00:00Z',
    logoUrl: 'BM'
  },
  {
    id: 'a-3',
    name: 'Delta Force Sales',
    slug: 'delta',
    adminEmail: 'ops@delta.com',
    plan: 'enterprise',
    status: 'active',
    createdAt: '2023-05-22T00:00:00Z',
    logoUrl: 'DF'
  }
];

interface AgenciesPageProps {
  onImpersonate?: (agency: Agency) => void;
}

const AgenciesPage: React.FC<AgenciesPageProps> = ({ onImpersonate }) => {
  const [agencies, setAgencies] = useState<Agency[]>(MOCK_AGENCIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [email, setEmail] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [plan, setPlan] = useState<PlanType>('free');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API Call
    setTimeout(() => {
      const newAgency: Agency = {
        id: `a-${Date.now()}`,
        name,
        slug,
        adminEmail: email,
        plan,
        status: 'active',
        createdAt: new Date().toISOString(),
        logoUrl: logoUrl || name.substring(0, 2).toUpperCase()
      };
      setAgencies([...agencies, newAgency]);
      setIsLoading(false);
      setIsModalOpen(false);
      resetForm();
    }, 1000);
  };

  const resetForm = () => {
    setName('');
    setSlug('');
    setEmail('');
    setLogoUrl('');
    setPlan('free');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Agency Management</h2>
          <p className="text-slate-500 mt-1">Super Admin Console: Monitor and manage tenants.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Create Agency
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <th className="px-6 py-4">Agency Name</th>
              <th className="px-6 py-4">Slug (Subdomain)</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {agencies.map(agency => (
              <tr key={agency.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {agency.logoUrl && agency.logoUrl.startsWith('http') ? (
                      <img src={agency.logoUrl} alt={agency.name} className="w-8 h-8 rounded-lg object-cover bg-slate-100" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                        {agency.logoUrl || agency.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-900">{agency.name}</p>
                      <p className="text-slate-500 text-xs">{agency.adminEmail}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 font-mono text-xs">{agency.slug}.viai.app</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${agency.plan === 'pro'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : agency.plan === 'enterprise'
                      ? 'bg-slate-800 text-white border-slate-600'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                    {agency.plan}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${agency.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                    <span className="capitalize text-slate-700">{agency.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {new Date(agency.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {/* Reuse the handler if provided, otherwise generic alert */}
                  <button
                    onClick={() => onImpersonate ? onImpersonate(agency) : alert('Impersonation disabled here.')}
                    className="text-brand-600 hover:text-brand-800 font-medium text-sm transition-colors border border-brand-200 hover:border-brand-300 rounded px-3 py-1 bg-brand-50"
                  >
                    Login As
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal - Kept same as before */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-lg">Register New Agency</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Agency Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  placeholder="e.g. Acme Corp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm font-mono bg-slate-50"
                  />
                  <span className="px-3 py-2 bg-slate-100 border border-l-0 border-slate-300 rounded-r-lg text-slate-500 text-sm text-nowrap">.viai.app</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  placeholder="admin@agency.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL (Optional)</label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Custom Domain</label>
                  <input
                    type="text"
                    placeholder="app.agency.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      className="h-9 w-9 p-1 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="#000000"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subscription Plan</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['free', 'pro', 'enterprise'] as PlanType[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlan(p)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border capitalize ${plan === p
                        ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
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
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating...' : 'Create Agency'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgenciesPage;