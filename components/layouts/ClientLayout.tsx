import React from 'react';
import { ViewState } from '../../types';
import { LayoutDashboard, Phone, BarChart2, Settings, LogOut, FileText, MessageSquare } from 'lucide-react';
import NotificationCenter from '../notifications/NotificationCenter';

interface ClientLayoutProps {
  children: React.ReactNode;
  view: ViewState;
  setView: (view: ViewState) => void;
  clientName: string; // e.g., "Dr. Smith Dental"
  onLogout: () => void;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({
  children,
  view,
  setView,
  clientName,
  onLogout
}) => {

  const navItems = [
    { id: 'portal_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'portal_calls', label: 'Call Logs', icon: Phone },
    { id: 'portal_reports', label: 'Reports', icon: FileText },
    { id: 'portal_analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'portal_settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-20">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {clientName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-sm leading-tight">{clientName}</h1>
              <p className="text-xs text-slate-500">Client Portal</p>
            </div>
          </div>

          {/* Global Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search calls, reports..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex justify-end">
            <NotificationCenter />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${view === item.id
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${view === item.id ? 'text-indigo-600' : 'text-slate-400'}`} />
              {item.label}
            </button>
          ))}
          <button
            onClick={() => setView('helpdesk')}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${view === 'helpdesk'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <MessageSquare className={`w-5 h-5 mr-3 ${view === 'helpdesk' ? 'text-indigo-600' : 'text-slate-400'}`} />
            Helpdesk
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ClientLayout;
