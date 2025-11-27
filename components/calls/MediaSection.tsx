import React from 'react';
import { Play, Download, User, Bot } from 'lucide-react';
import { CallData } from '../../types';

interface MediaProps {
   call: CallData;
}

export const AudioPlayer: React.FC<MediaProps> = ({ call }) => {
   return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
         <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
               <span className="w-1 h-4 bg-purple-600 rounded-full"></span>
               Audio Recording
            </h3>
         </div>
         <div className="p-6 flex flex-col items-center justify-center flex-1 space-y-6">
            <button className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-white transition-all shadow-lg hover:scale-105">
               <Play className="w-8 h-8 ml-1" />
            </button>

            <div className="w-full space-y-2">
               <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>0:00</span>
                  <span>{call.duration || "0:00"}</span>
               </div>
               <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative cursor-pointer">
                  <div className="absolute top-0 left-0 bottom-0 w-0 bg-purple-500 rounded-full"></div>
               </div>
            </div>

            <button className="w-full py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
               <Download className="w-4 h-4" />
               Download Audio
            </button>
         </div>
      </div>
   );
};

export const TranscriptViewer: React.FC<MediaProps> = ({ call }) => {
   const transcriptLines = (call?.transcript || "").split('\n');

   return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
         <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
               Transcript
            </h3>
            <button className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 border border-slate-200 px-2 py-1 rounded hover:bg-slate-50 transition-colors">
               <Download className="w-3 h-3" /> Download
            </button>
         </div>

         <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-4">
            {transcriptLines.length > 0 && transcriptLines[0] !== "" ? (
               transcriptLines.map((line, idx) => {
                  const isAgent = line.startsWith('Agent:');
                  const text = line.replace(/^(Agent|Client):/, '').trim();
                  if (!text) return null;

                  return (
                     <div key={idx} className="flex flex-col gap-1">
                        <span className={`text-xs font-bold ${isAgent ? 'text-blue-600' : 'text-purple-600'}`}>
                           {isAgent ? 'Agent:' : 'User:'}
                        </span>
                        <div className={`p-3 rounded-lg text-sm leading-relaxed ${isAgent
                              ? 'bg-blue-50 text-slate-800 border border-blue-100'
                              : 'bg-purple-50 text-slate-800 border border-purple-100'
                           }`}>
                           {text}
                        </div>
                     </div>
                  );
               })
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-slate-400 italic">
                  No transcript available.
               </div>
            )}
         </div>
      </div>
   );
};
