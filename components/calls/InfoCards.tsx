
import React from 'react';
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, Activity, Mail } from 'lucide-react';
import { CallData, ToolExecution } from '../../types';

interface InfoCardProps {
  call: CallData;
}

export const CallInfoCard: React.FC<InfoCardProps> = ({ call }) => {
  if (!call) return null;
  
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center h-full">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
           <p className="text-xs text-slate-500 uppercase font-semibold">Date & Time</p>
           <p className="text-sm font-medium text-slate-900">
             {call.timestamp ? new Date(call.timestamp).toLocaleDateString() : 'N/A'}
           </p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2">
         <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Clock className="w-5 h-5" />
         </div>
         <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Duration</p>
            <p className="text-sm font-medium text-slate-900">{call.duration || '0:00'}</p>
         </div>
      </div>
    </div>
  );
};

export const CallerInfoCard: React.FC<InfoCardProps> = ({ call }) => {
  if (!call) return null;

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center h-full">
       <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
             {call.clientName ? call.clientName.charAt(0) : '?'}
          </div>
          <div>
             <p className="text-sm font-bold text-slate-900">{call.clientName || 'Unknown Client'}</p>
             <p className="text-xs text-slate-500 flex items-center gap-1">
                <Phone className="w-3 h-3" /> +1 (555) 019-2834
             </p>
          </div>
       </div>
       <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <span className="text-xs text-slate-500">Agent:</span>
          <div className="flex items-center gap-1.5">
             <User className="w-3 h-3 text-slate-400" />
             <span className="text-xs font-medium text-slate-700">{call.agentName || 'Unknown Agent'}</span>
          </div>
       </div>
    </div>
  );
};

export const ToolActivityCard: React.FC<InfoCardProps> = ({ call }) => {
  // Strict check for toolExecutions existence
  const tools = call?.toolExecutions || [];
  const hasTools = tools.length > 0;

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
         <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
            <Activity className="w-3 h-3" /> AI Tool Activity
         </h4>
         {hasTools && (
            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
               {tools.length} Actions
            </span>
         )}
      </div>

      <div className="flex-1 overflow-y-auto max-h-[150px]">
        {hasTools ? (
           <div className="space-y-2">
             {tools.map((tool, idx) => (
                <ToolItem key={idx} execution={tool} />
             ))}
           </div>
        ) : (
           <div className="flex flex-col items-center justify-center h-full text-slate-400 py-2">
              <span className="text-xs italic">No automated actions taken</span>
           </div>
        )}
      </div>
    </div>
  );
};

const ToolItem: React.FC<{ execution: ToolExecution }> = ({ execution }) => {
   // Defensive check for execution object
   if (!execution || !execution.tool) return null;

   // Determine icon based on tool name (simple mapping for now)
   const Icon = execution.tool.toLowerCase().includes('email') ? Mail : Activity;
   const toolName = execution.tool.replace(/_/g, ' ');

   return (
      <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
         <div className={`p-1.5 rounded-md ${execution.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            <Icon className="w-3.5 h-3.5" />
         </div>
         <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
               <p className="text-xs font-semibold text-slate-800 truncate capitalize">
                  {toolName}
               </p>
               {execution.status === 'success' ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
               ) : (
                  <XCircle className="w-3 h-3 text-red-500" />
               )}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 truncate">
               {execution.result || 'Executed successfully'}
            </p>
         </div>
      </div>
   );
};
