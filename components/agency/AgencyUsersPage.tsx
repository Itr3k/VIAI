import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { Search, Plus, Filter, MoreHorizontal, Mail, Shield, Trash2, User as UserIcon } from 'lucide-react';
import UserManagementModal from '../admin/UserManagementModal';

// Mock Data
const MOCK_USERS: User[] = [
    {
        id: 'u-1',
        name: 'John Doe',
        email: 'john@acme-agency.com',
        role: 'admin',
        status: 'active',
        agencyId: 'a-1',
        lastLogin: '2023-11-27T09:00:00Z',
        usageStats: { averageCallsPerDay: 12, totalMinutesUsed: 340, lastActiveDate: '2023-11-27' }
    },
    {
        id: 'u-2',
        name: 'Sarah Connor',
        email: 'sarah@acme-agency.com',
        role: 'user',
        status: 'active',
        agencyId: 'a-1',
        lastLogin: '2023-11-26T16:20:00Z',
        usageStats: { averageCallsPerDay: 5, totalMinutesUsed: 150, lastActiveDate: '2023-11-26' }
    }
];

const AgencyUsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>('user');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const newUser: User = {
            id: `u-${Date.now()}`,
            name,
            email,
            role,
            status: 'invited',
            agencyId: 'a-1', // Mock current agency
        };
        setUsers([...users, newUser]);
        setIsModalOpen(false);
        setName('');
        setEmail('');
        setRole('user');
    };

    const handleUpdateUser = (updatedUser: User) => {
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        setSelectedUser(null);
    };

    const handleDelete = (userId: string) => {
        if (confirm('Are you sure you want to remove this user?')) {
            setUsers(users.filter(u => u.id !== userId));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Team Management</h2>
                    <p className="text-slate-500 mt-1">Manage your agency's internal users and permissions.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Team Member
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                        type="text"
                        placeholder="Search team members..."
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

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[300px]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Last Login</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors relative">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                            {user.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{user.name}</p>
                                            <p className="text-slate-500 text-xs">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {user.role === 'admin' ? <Shield className="w-3 h-3 text-purple-500" /> : <Mail className="w-3 h-3 text-slate-400" />}
                                        <span className="capitalize text-slate-700">{user.role}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            className="text-slate-400 hover:text-blue-600 font-medium text-sm transition-colors px-2 py-1 rounded hover:bg-blue-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                                            title="Remove User"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 text-lg">Add Team Member</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="e.g. Jane Doe"
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
                                    placeholder="jane@agency.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                <select
                                    value={role}
                                    onChange={e => setRole(e.target.value as UserRole)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="user">User (Standard Access)</option>
                                    <option value="admin">Admin (Full Access)</option>
                                </select>
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
                                    Add Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* User Management Modal */}
            {selectedUser && (
                <UserManagementModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onUpdate={handleUpdateUser}
                    currentUserRole="admin"
                />
            )}
        </div>
    );
};

export default AgencyUsersPage;
