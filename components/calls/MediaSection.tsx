
import React from 'react';
import { Play, Download } from 'lucide-react';
import { CallData } from '../../types';

interface MediaSectionProps {
  call: CallData;
}

export const MediaSection: React.FC<MediaSectionProps> = ({ call }) => {
  // Defensive coding: Ensure transcript exists before splitting
  const transcriptLines = (call?.transcript || "").split('\n');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
       {/* Audio Player Header */}
       <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-4 w-full">
             <button className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white transition-colors shadow-sm">
                <Play className="w-4 h-4 ml-0.5" />
             </button>
             {/* Fake Progress Bar */}
             <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 bottom-0 w-1/3 bg-indigo-500 rounded-full"></div>
             </div>
             <span className="text-xs font-mono text-slate-500">{call.duration || "0:00"}</span>
          </div>
          <button className="ml-4 p-2 text-slate-400 hover:text-indigo-600 transition-colors">
             <Download className="w-5 h-5" />
          </button>
       </div>

       {/* Transcript Area */}
       <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          <div className="space-y-6">
             {transcriptLines.length > 0 && transcriptLines[0] !== "" ? (
                transcriptLines.map((line, idx) => {
                  const isAgent = line.startsWith('Agent:');
                  const text = line.replace(/^(Agent|Client):/, '').trim();
                  if (!text) return null;

                  return (
                     <div key={idx} className={`flex gap-3 ${isAgent ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border ${
                           isAgent 
                             ? 'bg-white border-slate-200 text-slate-600' 
                             : 'bg-indigo-100 border-indigo-200 text-indigo-600'
                        }`}>
                           {isAgent ? 'AG' : 'CL'}
                        </div>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                           isAgent
                             ? 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
                             : 'bg-indigo-50 text-indigo-900 rounded-tr-none border border-indigo-100'
                        }`}>
                           <p>{text}</p>
                        </div>
                     </div>
                  );
                })
             ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <p className="text-sm italic">No transcript available.</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};
