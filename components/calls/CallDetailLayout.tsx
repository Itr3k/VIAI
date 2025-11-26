
import React from 'react';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';

interface CallDetailLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  onBack: () => void;
}

export const CallDetailLayout: React.FC<CallDetailLayoutProps> = ({ children, title, subtitle, onBack }) => {
  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
           <button 
             onClick={onBack}
             className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
           >
             <ArrowLeft className="w-5 h-5" />
           </button>
           <div>
              <h1 className="text-xl font-bold text-slate-900">{title}</h1>
              <p className="text-sm text-slate-500">{subtitle}</p>
           </div>
        </div>
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
           <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      
      {/* Main Grid Content */}
      <div className="flex-1 overflow-y-auto">
         {children}
      </div>
    </div>
  );
};
