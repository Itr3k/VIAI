import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, User as UserIcon, Shield, Mail, Building } from 'lucide-react';
import { User, UserRole } from '../../types';
import UserManagementModal from './UserManagementModal';

// Mock Data adapted to match User interface
const MOCK_USERS: User[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@acme.com',
        role: 'admin',
        agencyId: 'a-1',
        status: 'active',
        lastLogin: '2023-11-27T10:00:00Z',
        usageStats: { averageCallsPerDay: 15, totalMinutesUsed: 520, lastActiveDate: '2023-11-27' }
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@global.com',
        role: 'user',
        agencyId: 'a-2',
        status: 'active',
        lastLogin: '2023-11-26T14:00:00Z',
        usageStats: { averageCallsPerDay: 4, totalMinutesUsed: 120, lastActiveDate: '2023-11-26' }
    },
    {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@stark.com',
        role: 'admin',
        agencyId: 'a-3',
        status: 'active',
        lastLogin: '2023-11-27T12:15:00Z',
        usageStats: { averageCallsPerDay: 25, totalMinutesUsed: 890, lastActiveDate: '2023-11-27' }
    },
    {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah@wayne.com',
        role: 'user',
        agencyId: 'a-4',
        status: 'inactive',
        lastLogin: '2023-11-10T09:00:00Z'
    },
    {
        id: '5',
        name: 'Admin User',
        email: 'admin@viai.app',
        role: 'super_admin',
        agencyId: 'system',
        status: 'active',
        lastLogin: '2023-11-27T12:20:00Z'
    },
];

const GlobalUsersPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUpdateUser = (updatedUser: User) => {
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        setSelectedUser(null);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Global Users</h2>
                    <p className="text-slate-500 mt-1">Manage all users across the platform.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                        Export Users
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                        Invite User
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search users, emails, or agencies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 outline-none focus:border-blue-500">
                        <option>All Roles</option>
                        <option>Super Admin</option>
                        <option>Agency Admin</option>
                        <option>User</option>
                    </select>
                    <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 outline-none focus:border-blue-500">
                        <option>All Statuses</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3 font-medium">User</th>
                                <th className="px-6 py-3 font-medium">Role</th>
                                <th className="px-6 py-3 font-medium">Agency</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Last Login</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors relative">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                <UserIcon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{user.name}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${user.role === 'super_admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                user.role === 'admin' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    'bg-slate-50 text-slate-700 border-slate-200'
                                            }`}>
                                            {user.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Building className="w-3 h-3 text-slate-400" />
                                            {user.agencyId === 'system' ? 'VIAI Platform' :
                                                user.agencyId === 'a-1' ? 'Acme Agency' :
                                                    user.agencyId === 'a-2' ? 'Global Corp' : 'Unknown Agency'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td className="px-6 py-4 text-right relative">
                                        <button
                                            onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                                            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {activeDropdown === user.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 z-10 py-1 text-left animate-in fade-in zoom-in duration-200">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setActiveDropdown(null);
                                                    }}
                                                    className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                                >
                                                    <UserIcon className="w-4 h-4 text-slate-400" />
                                                    Manage User
                                                </button>
                                                <button className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-slate-400" />
                                                    Send Email
                                                </button>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                    <Shield className="w-4 h-4" />
                                                    Suspend Access
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Management Modal */}
            {selectedUser && (
                <UserManagementModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onUpdate={handleUpdateUser}
                    currentUserRole="super_admin"
                />
            )}
        </div>
    );
};

export default GlobalUsersPage;
