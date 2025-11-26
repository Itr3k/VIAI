import React, { useState } from 'react';
import { Ticket, UserRole, Message } from '../../types';
import { MessageSquare, Send, AlertTriangle, CheckCircle, Plus, User, Shield, ShieldAlert } from 'lucide-react';

interface SupportPageProps {
    currentUserRole?: UserRole;
    agencyId?: string;
}

const MOCK_TICKETS: Ticket[] = [
    {
        id: 't-1',
        subject: 'Billing Discrepancy',
        status: 'open',
        priority: 'high',
        agencyId: 'agency-1',
        clientId: 'client-1',
        clientName: 'TechFlow Inc.',
        isEscalated: false,
        createdAt: '2023-11-20T10:00:00Z',
        updatedAt: '2023-11-20T10:30:00Z',
        messages: [
            {
                id: 'm-1',
                senderId: 'client-1',
                senderName: 'John Client',
                role: 'client',
                content: 'Hi, I noticed a charge on my invoice that I don\'t recognize. Can you please explain?',
                timestamp: '2023-11-20T10:00:00Z'
            },
            {
                id: 'm-2',
                senderId: 'admin-1',
                senderName: 'Sarah Admin',
                role: 'admin',
                content: 'Hello John, I\'m looking into this for you right now. Give me a moment.',
                timestamp: '2023-11-20T10:30:00Z'
            }
        ]
    },
    {
        id: 't-2',
        subject: 'API Integration Issue',
        status: 'open',
        priority: 'medium',
        agencyId: 'agency-1',
        clientId: 'client-2',
        clientName: 'Global Corp',
        isEscalated: true,
        createdAt: '2023-11-21T14:00:00Z',
        updatedAt: '2023-11-21T14:05:00Z',
        messages: [
            {
                id: 'm-3',
                senderId: 'client-2',
                senderName: 'Mike Dev',
                role: 'client',
                content: 'We are getting 500 errors when trying to sync contacts via the HubSpot integration.',
                timestamp: '2023-11-21T14:00:00Z'
            },
            {
                id: 'm-4',
                senderId: 'admin-1',
                senderName: 'Sarah Admin',
                role: 'admin',
                content: 'This looks like a system-wide issue. I am escalating this to our engineering team.',
                timestamp: '2023-11-21T14:05:00Z'
            }
        ]
    }
];

const SupportPage: React.FC<SupportPageProps> = ({ currentUserRole = 'client', agencyId }) => {
    const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newSubject, setNewSubject] = useState('');
    const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [newInitialMessage, setNewInitialMessage] = useState('');

    // Filter tickets based on role
    const filteredTickets = tickets.filter(ticket => {
        if (currentUserRole === 'super_admin') {
            return ticket.isEscalated; // Super Admin only sees escalated tickets
        } else if (currentUserRole === 'admin') {
            return ticket.agencyId === agencyId; // Agency Admin sees all agency tickets
        } else {
            return ticket.clientId === 'client-1'; // Mock: Client sees only their own (hardcoded ID for demo)
        }
    });

    const selectedTicket = tickets.find(t => t.id === selectedTicketId);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedTicket) return;

        const message: Message = {
            id: `m-${Date.now()}`,
            senderId: currentUserRole === 'client' ? 'client-1' : 'admin-1', // Mock IDs
            senderName: currentUserRole === 'client' ? 'You' : 'Support Agent',
            role: currentUserRole as UserRole,
            content: newMessage,
            timestamp: new Date().toISOString()
        };

        const updatedTickets = tickets.map(t => {
            if (t.id === selectedTicket.id) {
                return {
                    ...t,
                    messages: [...t.messages, message],
                    updatedAt: new Date().toISOString()
                };
            }
            return t;
        });

        setTickets(updatedTickets);
        setNewMessage('');
    };

    const handleCreateTicket = (e: React.FormEvent) => {
        e.preventDefault();
        const newTicket: Ticket = {
            id: `t-${Date.now()}`,
            subject: newSubject,
            status: 'open',
            priority: newPriority,
            agencyId: agencyId || 'agency-1',
            clientId: 'client-1',
            clientName: 'My Company',
            isEscalated: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [
                {
                    id: `m-${Date.now()}`,
                    senderId: 'client-1',
                    senderName: 'You',
                    role: 'client',
                    content: newInitialMessage,
                    timestamp: new Date().toISOString()
                }
            ]
        };

        setTickets([newTicket, ...tickets]);
        setIsCreateModalOpen(false);
        setNewSubject('');
        setNewInitialMessage('');
        setSelectedTicketId(newTicket.id);
    };

    const handleEscalate = () => {
        if (!selectedTicket) return;
        const updatedTickets = tickets.map(t => {
            if (t.id === selectedTicket.id) {
                return { ...t, isEscalated: true };
            }
            return t;
        });
        setTickets(updatedTickets);
        alert('Ticket escalated to Super Admin.');
    };

    return (
        <div className="flex h-[calc(100vh-2rem)] gap-6 animate-fade-in">
            {/* Ticket List Sidebar */}
            <div className="w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800">Support Tickets</h3>
                    {currentUserRole === 'client' && (
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
                            title="New Ticket"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredTickets.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">
                            No tickets found.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredTickets.map(ticket => (
                                <button
                                    key={ticket.id}
                                    onClick={() => setSelectedTicketId(ticket.id)}
                                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${selectedTicketId === ticket.id ? 'bg-slate-50 border-l-4 border-brand-500' : 'border-l-4 border-transparent'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                                            ticket.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {ticket.priority}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {new Date(ticket.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h4 className="font-medium text-slate-900 truncate">{ticket.subject}</h4>
                                    <p className="text-xs text-slate-500 truncate mt-1">
                                        {ticket.messages[ticket.messages.length - 1].content}
                                    </p>
                                    {ticket.isEscalated && (
                                        <div className="mt-2 flex items-center gap-1 text-xs text-red-600 font-medium">
                                            <ShieldAlert className="w-3 h-3" /> Escalated
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                {selectedTicket ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    {selectedTicket.subject}
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${selectedTicket.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                                        }`}>
                                        {selectedTicket.status}
                                    </span>
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Ticket ID: {selectedTicket.id} • Client: {selectedTicket.clientName}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {currentUserRole === 'admin' && !selectedTicket.isEscalated && (
                                    <button
                                        onClick={handleEscalate}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors"
                                    >
                                        <ShieldAlert className="w-3 h-3" /> Escalate to Super Admin
                                    </button>
                                )}
                                {selectedTicket.isEscalated && (
                                    <span className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-medium">
                                        <Shield className="w-3 h-3" /> Escalated
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                            {selectedTicket.messages.map(msg => {
                                const isMe = (currentUserRole === 'client' && msg.role === 'client') ||
                                    (currentUserRole !== 'client' && msg.role !== 'client');

                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] ${isMe ? 'order-2' : 'order-1'}`}>
                                            <div className={`flex items-center gap-2 mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <span className="text-xs font-medium text-slate-700">{msg.senderName}</span>
                                                <span className="text-[10px] text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className={`p-3 rounded-xl text-sm ${isMe
                                                ? 'bg-slate-900 text-white rounded-tr-none'
                                                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                        <p>Select a ticket to view conversation</p>
                    </div>
                )}
            </div>

            {/* Create Ticket Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 text-lg">Create Support Ticket</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={newSubject}
                                    onChange={e => setNewSubject(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                                    placeholder="Brief description of the issue"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                                <select
                                    value={newPriority}
                                    onChange={e => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-white"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                <textarea
                                    required
                                    value={newInitialMessage}
                                    onChange={e => setNewInitialMessage(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm resize-none"
                                    placeholder="Describe your issue in detail..."
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
                                >
                                    Submit Ticket
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportPage;
