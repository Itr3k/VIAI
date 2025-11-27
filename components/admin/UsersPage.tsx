import React, { useState } from 'react';
import { User, UserRole } from '../../types';

const MOCK_USERS: User[] = [
  {
    id: 'u-1',
    name: 'John Manager',
    email: 'john@acme-agency.com',
    role: 'admin',
    status: 'active',
    agencyId: 'agency-1',
    lastLogin: '2023-10-28T09:15:00Z',
    avatarUrl: 'JM'
  },
  {
    id: 'u-2',
    name: 'Sarah Sales',
    email: 'sarah@acme-agency.com',
    role: 'user',
    status: 'active',
    agencyId: 'agency-1',
    lastLogin: '2023-10-27T16:45:00Z',
    avatarUrl: 'SS'
  },
  {
    id: 'u-3',
    name: 'Mike Support',
    email: 'mike@acme-agency.com',
    role: 'user',
    status: 'invited',
    agencyId: 'agency-1',
    avatarUrl: 'MS'
  }
];

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  // Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('user');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: 'invited',
      agencyId: 'agency-1',
      avatarUrl: inviteName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    };
    setUsers([...users, newUser]);
    setIsInviteModalOpen(false);
    setInviteEmail('');
    setInviteName('');
    setInviteRole('user');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-slate-500 mt-1">Manage access and roles for your agency members.</p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Invite User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Login</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                      {user.avatarUrl}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-slate-500 text-xs">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    user.role === 'admin' 
                      ? 'bg-slate-100 text-slate-800 border-slate-200' 
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}>
                    {user.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-amber-400'}`}></span>
                     <span className="capitalize text-slate-700">{user.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-600 font-medium text-sm transition-colors">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-lg">Invite New Member</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select 
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="user">User (View Calls only)</option>
                  <option value="admin">Admin (Manage Users & Settings)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsInviteModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;