import React, { useState } from 'react';
import { Ticket, UserRole } from '../../types';
import { Search, Plus, Filter, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';

// Mock Data
const MOCK_TICKETS: Ticket[] = [
    {
        id: 'T-101',
        subject: 'Integration with HubSpot failing',
        description: 'We are getting a 403 error when trying to sync contacts.',
        status: 'open',
        priority: 'high',
        requesterId: 'u1',
        requesterName: 'Dr. Smith Dental',
        requesterRole: 'client',
        agencyId: 'a1',
        assigneeRole: 'agency_admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
    },
    {
        id: 'T-102',
        subject: 'Request for new agent voice',
        description: 'Can we get a British accent for the receptionist?',
        status: 'in_progress',
        priority: 'medium',
        requesterId: 'u2',
        requesterName: 'Acme Corp',
        requesterRole: 'client',
        agencyId: 'a1',
        assigneeRole: 'agency_admin',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
    },
    {
        id: 'T-201',
        subject: 'Billing discrepancy for Agency Account',
        description: 'Our invoice shows 500 minutes but dashboard says 450.',
        status: 'open',
        priority: 'medium',
        requesterId: 'a1_admin',
        requesterName: 'Acme Agency Admin',
        requesterRole: 'admin',
        agencyId: 'a1',
        assigneeRole: 'super_admin',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
    }
];

interface HelpdeskPageProps {
    userRole: UserRole;
    currentUserId?: string;
    currentAgencyId?: string;
}

const HelpdeskPage: React.FC<HelpdeskPageProps> = ({ userRole, currentUserId, currentAgencyId }) => {
    const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
    const [viewMode, setViewMode] = useState<'list' | 'create' | 'detail'>('list');
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');

    // Filter logic based on role hierarchy
    const filteredTickets = tickets.filter(ticket => {
        if (userRole === 'super_admin') {
            // Super Admin sees everything assigned to super_admin (inbox) OR everything (all)
            if (activeTab === 'inbox') return ticket.assigneeRole === 'super_admin';
            return true; // "All Tickets" view
        }

        if (userRole === 'admin') { // Agency Admin
            if (activeTab === 'inbox') {
                // Tickets from MY clients assigned to ME
                return ticket.assigneeRole === 'agency_admin' && ticket.agencyId === 'a1'; // Mock agency ID check
            } else {
                // Tickets I sent to Super Admin
                return ticket.requesterRole === 'admin' && ticket.agencyId === 'a1';
            }
        }

        if (userRole === 'client') {
            // Clients only see their own tickets
            return ticket.requesterRole === 'client'; // In real app check requesterId
        }

        return false;
    });

    const handleCreateTicket = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock creation logic
        const newTicket: Ticket = {
            id: `T-${Math.floor(Math.random() * 1000)}`,
            subject: (e.target as any).subject.value,
            description: (e.target as any).description.value,
            status: 'open',
            priority: (e.target as any).priority.value,
            requesterId: 'current_user',
            requesterName: userRole === 'client' ? 'Current Client' : 'Current Agency',
            requesterRole: userRole,
            agencyId: 'a1',
            assigneeRole: userRole === 'client' ? 'agency_admin' : 'super_admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: []
        };
        setTickets([newTicket, ...tickets]);
        setViewMode('list');
    };

    return (
        <div className="space-y-6 animate-fade-in h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Helpdesk Support</h2>
                    <p className="text-slate-500 mt-1">
                        {userRole === 'super_admin' ? 'Manage platform-wide support requests.' :
                            userRole === 'admin' ? 'Support your clients and contact platform admins.' :
                                'Get help with your voice agents.'}
                    </p>
                </div>
                {viewMode === 'list' && (
                    <button
                        onClick={() => setViewMode('create')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Ticket
                    </button>
                )}
                {viewMode !== 'list' && (
                    <button
                        onClick={() => { setViewMode('list'); setSelectedTicket(null); }}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                    >
                        Back to List
                    </button>
                )}
            </div>

            {/* Tabs for Admins */}
            {viewMode === 'list' && userRole !== 'client' && (
                <div className="flex border-b border-slate-200 shrink-0">
                    <button
                        onClick={() => setActiveTab('inbox')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'inbox' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {userRole === 'super_admin' ? 'Agency Requests' : 'Client Requests'}
                    </button>
                    <button
                        onClick={() => setActiveTab('sent')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'sent' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {userRole === 'super_admin' ? 'All Tickets' : 'My Support Requests'}
                    </button>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">

                {/* LIST VIEW */}
                {viewMode === 'list' && (
                    <div className="overflow-y-auto flex-1">
                        {filteredTickets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                                <CheckCircle className="w-12 h-12 mb-4 text-slate-300" />
                                <p>No tickets found in this view.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4">Subject</th>
                                        <th className="px-6 py-4">Requester</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Priority</th>
                                        <th className="px-6 py-4">Created</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {filteredTickets.map(ticket => (
                                        <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-400 text-xs">#{ticket.id}</span>
                                                    {ticket.subject}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <div className="flex flex-col">
                                                    <span>{ticket.requesterName}</span>
                                                    <span className="text-xs text-slate-400 capitalize">{ticket.requesterRole.replace('_', ' ')}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                                                        ticket.status === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                                                            'bg-green-100 text-green-800'
                                                    }`}>
                                                    {ticket.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 text-xs font-medium uppercase ${ticket.priority === 'urgent' ? 'text-red-600' :
                                                        ticket.priority === 'high' ? 'text-orange-600' :
                                                            'text-slate-500'
                                                    }`}>
                                                    <AlertCircle className="w-3 h-3" />
                                                    {ticket.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-xs">
                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => { setSelectedTicket(ticket); setViewMode('detail'); }}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* CREATE VIEW */}
                {viewMode === 'create' && (
                    <div className="p-8 max-w-2xl mx-auto w-full overflow-y-auto">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Create New Support Ticket</h3>
                        <form onSubmit={handleCreateTicket} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                                <input name="subject" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Brief summary of the issue" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                                    <select name="priority" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                    <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option>Technical Issue</option>
                                        <option>Billing</option>
                                        <option>Feature Request</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea name="description" required rows={6} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Please provide details..." />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setViewMode('list')} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Submit Ticket</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* DETAIL VIEW */}
                {viewMode === 'detail' && selectedTicket && (
                    <div className="flex flex-col h-full">
                        {/* Ticket Header */}
                        <div className="p-6 border-b border-slate-100 bg-slate-50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-sm font-mono text-slate-500">#{selectedTicket.id}</span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${selectedTicket.status === 'open' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {selectedTicket.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{selectedTicket.subject}</h3>
                                </div>
                                <div className="text-right text-sm text-slate-500">
                                    <p>Created by <span className="font-medium text-slate-900">{selectedTicket.requesterName}</span></p>
                                    <p>{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                            {/* Original Request */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                                    {selectedTicket.requesterName.charAt(0)}
                                </div>
                                <div className="bg-white p-4 rounded-lg rounded-tl-none shadow-sm border border-slate-200 max-w-3xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-slate-900">{selectedTicket.requesterName}</span>
                                        <span className="text-xs text-slate-400">Original Request</span>
                                    </div>
                                    <p className="text-slate-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                                </div>
                            </div>

                            {/* Mock Reply */}
                            <div className="flex gap-4 flex-row-reverse">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                    S
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg rounded-tr-none shadow-sm border border-blue-100 max-w-3xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-blue-900">Support Agent</span>
                                        <span className="text-xs text-blue-400">Just now</span>
                                    </div>
                                    <p className="text-blue-800">Thank you for reaching out. We are investigating this issue and will get back to you shortly.</p>
                                </div>
                            </div>
                        </div>

                        {/* Reply Input */}
                        <div className="p-4 bg-white border-t border-slate-200">
                            <div className="flex gap-4">
                                <textarea
                                    className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    rows={3}
                                    placeholder="Type your reply..."
                                ></textarea>
                                <button className="px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 self-end py-3">
                                    Send Reply
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default HelpdeskPage;
