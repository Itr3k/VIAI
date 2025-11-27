
import React from 'react';
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, Activity, Mail, Copy, Wrench } from 'lucide-react';
import { CallData, ToolExecution } from '../../types';

interface InfoCardProps {
   call: CallData;
}

export const CallInfoCard: React.FC<InfoCardProps> = ({ call }) => {
   if (!call) return null;

   return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
         <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Phone className="w-4 h-4" /> Call Information
         </h3>

         <div className="space-y-4">
            <div className="flex justify-between items-center">
               <span className="text-sm text-slate-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Started
               </span>
               <span className="text-sm font-medium text-slate-900">
                  {call.timestamp ? new Date(call.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
               </span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-sm text-slate-500 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Ended
               </span>
               <span className="text-sm font-medium text-slate-900">
                  {/* Mock ended time by adding duration */}
                  {call.timestamp ? new Date(new Date(call.timestamp).getTime() + 1000 * 60 * 3).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
               </span>
            </div>
         </div>
      </div>
   );
};

export const CallerInfoCard: React.FC<InfoCardProps> = ({ call }) => {
   if (!call) return null;

   return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
         <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-6">
            <User className="w-4 h-4" /> Caller Information
         </h3>

         <div className="space-y-4">
            <div className="flex justify-between items-center">
               <span className="text-sm text-slate-500">Agent</span>
               <span className="text-sm font-medium text-slate-900">{call.agentName || 'Unknown Agent'}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
               <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm">
                  <Phone className="w-4 h-4" />
                  +1 (818) 349-5566
               </div>
               <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Copy className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>
   );
};

export const ToolActivityCard: React.FC<InfoCardProps> = ({ call }) => {
   const tools = call?.toolExecutions || [];
   const hasTools = tools.length > 0;

   return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
         <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Wrench className="w-4 h-4" /> Tool Activity
         </h3>

         <div className="flex-1 overflow-y-auto max-h-[200px] pr-2 custom-scrollbar">
            {hasTools ? (
               <div className="space-y-4">
                  {tools.map((tool, idx) => (
                     <ToolItem key={idx} execution={tool} />
                  ))}
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-slate-400 py-2">
                  <span className="text-sm italic">No automated actions taken</span>
               </div>
            )}
         </div>
      </div>
   );
};

const ToolItem: React.FC<{ execution: ToolExecution }> = ({ execution }) => {
   if (!execution || !execution.tool) return null;

   // Format tool name for display
   const toolName = execution.tool === 'viai_email_tool'
      ? 'Other - Sent A Message To The Appropriate Staff'
      : execution.tool.replace(/_/g, ' ');

   return (
      <div className="border-l-2 border-slate-200 pl-4 py-1 relative">
         <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white"></div>

         <div className="mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
               <CheckCircle className="w-3 h-3 mr-1" /> Claimed
            </span>
         </div>

         <p className="text-sm font-medium text-slate-900 mb-1">
            {toolName}
         </p>

         <div className="text-xs text-slate-500 italic">
            To: appropriate staff
         </div>

         <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic">
            "{execution.payload?.topic || "I've sent your message to the appropriate staff..."}"
         </div>

         <p className="text-[10px] text-slate-400 mt-1">
            Mentioned but not verified in system logs
         </p>
      </div>
   );
};
