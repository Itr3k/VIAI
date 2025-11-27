import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { X, User as UserIcon, Shield, Key, Activity, Mail, MessageSquare, Check, AlertTriangle } from 'lucide-react';

interface UserManagementModalProps {
    user: User;
    onClose: () => void;
    onUpdate: (updatedUser: User) => void;
    currentUserRole: UserRole; // To determine what actions are allowed
}

type Tab = 'overview' | 'profile' | 'security' | 'permissions';

const UserManagementModal: React.FC<UserManagementModalProps> = ({ user, onClose, onUpdate, currentUserRole }) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [isLoading, setIsLoading] = useState(false);
    const [messageSent, setMessageSent] = useState(false);

    // Editable State
    const [firstName, setFirstName] = useState(user.firstName || user.name.split(' ')[0]);
    const [lastName, setLastName] = useState(user.lastName || user.name.split(' ').slice(1).join(' '));
    const [email, setEmail] = useState(user.email);
    const [role, setRole] = useState<UserRole>(user.role);
    const [features, setFeatures] = useState(user.features || {
        korra: user.clientSettings?.korraEnabled || false,
        reporting: true,
        apiAccess: false
    });

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            onUpdate({
                ...user,
                name: `${firstName} ${lastName}`,
                firstName,
                lastName,
                email,
                role,
                features
            });
            setIsLoading(false);
            alert('Profile updated successfully');
        }, 800);
    };

    const handlePasswordReset = () => {
        if (confirm(`Are you sure you want to reset the password for ${user.email}?`)) {
            alert(`Password reset link sent to ${user.email}`);
        }
    };

    const handleSendMessage = () => {
        setMessageSent(true);
        setTimeout(() => setMessageSent(false), 3000);
        // In real app, this would open a chat or send an email
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl shadow-sm border-2 border-white">
                            {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                <Mail className="w-3 h-3" />
                                {user.email}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                                            'bg-slate-100 text-slate-700'
                                    }`}>
                                    {user.role.replace('_', ' ')}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {user.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 px-6">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Activity className="w-4 h-4" /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <UserIcon className="w-4 h-4" /> Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'security' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Key className="w-4 h-4" /> Security
                    </button>
                    <button
                        onClick={() => setActiveTab('permissions')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'permissions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Shield className="w-4 h-4" /> Permissions
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-white">

                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Agency</p>
                                    <p className="font-medium text-slate-900">{user.agencyId === 'a-1' ? 'Acme Agency' : 'Global Corp'}</p>
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={messageSent}
                                        className="mt-3 text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
                                    >
                                        {messageSent ? <Check className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                                        {messageSent ? 'Message Sent' : 'Message Agency Admin'}
                                    </button>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Last Active</p>
                                    <p className="font-medium text-slate-900">
                                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-slate-900 mb-3">Usage Statistics</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-3 border border-slate-200 rounded-lg text-center">
                                        <p className="text-2xl font-bold text-slate-900">{user.usageStats?.averageCallsPerDay || 12}</p>
                                        <p className="text-xs text-slate-500">Avg Calls / Day</p>
                                    </div>
                                    <div className="p-3 border border-slate-200 rounded-lg text-center">
                                        <p className="text-2xl font-bold text-slate-900">{user.usageStats?.totalMinutesUsed || 450}</p>
                                        <p className="text-xs text-slate-500">Total Minutes</p>
                                    </div>
                                    <div className="p-3 border border-slate-200 rounded-lg text-center">
                                        <p className="text-2xl font-bold text-green-600">98%</p>
                                        <p className="text-xs text-slate-500">Success Rate</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={e => setFirstName(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                />
                            </div>
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70"
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div className="p-4 border border-red-100 bg-red-50 rounded-lg flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-red-900">Password Reset</h4>
                                    <p className="text-xs text-red-700 mt-1">
                                        Send a password reset email to the user. They will be prompted to create a new password upon clicking the link.
                                    </p>
                                    <button
                                        onClick={handlePasswordReset}
                                        className="mt-3 px-3 py-1.5 bg-white border border-red-200 text-red-700 text-xs font-medium rounded hover:bg-red-50 transition-colors"
                                    >
                                        Send Reset Link
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 border border-slate-200 rounded-lg">
                                <h4 className="text-sm font-bold text-slate-900">Force Logout</h4>
                                <p className="text-xs text-slate-500 mt-1 mb-3">
                                    Sign this user out of all active sessions immediately.
                                </p>
                                <button className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-200 transition-colors">
                                    Revoke All Sessions
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PERMISSIONS TAB */}
                    {activeTab === 'permissions' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">User Role</label>
                                <select
                                    value={role}
                                    onChange={e => setRole(e.target.value as UserRole)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                    disabled={currentUserRole !== 'super_admin' && currentUserRole !== 'admin'}
                                >
                                    <option value="user">User</option>
                                    <option value="client">Client</option>
                                    <option value="admin">Agency Admin</option>
                                    {currentUserRole === 'super_admin' && <option value="super_admin">Super Admin</option>}
                                </select>
                                <p className="text-xs text-slate-500 mt-1">
                                    Changing the role will update the user's access permissions immediately.
                                </p>
                            </div>

                            <div className="border-t border-slate-100 pt-4">
                                <h4 className="text-sm font-bold text-slate-900 mb-3">Feature Access</h4>
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-100 rounded text-indigo-600">
                                                <Activity className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">Korra AI Agent</p>
                                                <p className="text-xs text-slate-500">Access to AI voice agent capabilities</p>
                                            </div>
                                        </div>
                                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${features.korra ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={features.korra}
                                                onChange={() => setFeatures({ ...features, korra: !features.korra })}
                                            />
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${features.korra ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </div>
                                    </label>

                                    <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-100 rounded text-emerald-600">
                                                <Activity className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">Advanced Reporting</p>
                                                <p className="text-xs text-slate-500">Access to detailed analytics and exports</p>
                                            </div>
                                        </div>
                                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${features.reporting ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={features.reporting}
                                                onChange={() => setFeatures({ ...features, reporting: !features.reporting })}
                                            />
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${features.reporting ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleSaveProfile}
                                    className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                                >
                                    Save Permissions
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserManagementModal;
