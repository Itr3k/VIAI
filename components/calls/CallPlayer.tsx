import React from 'react';
import { CallData } from '../../types';
import { Play, Pause, X, Calendar, User, Clock, Tag, MessageSquare } from 'lucide-react';

interface CallPlayerProps {
  call: CallData;
  onClose: () => void;
}

const CallPlayer: React.FC<CallPlayerProps> = ({ call, onClose }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Recording: {call.clientName}
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
               <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(call.timestamp).toLocaleString()}</span>
               <span className="flex items-center gap-1"><User className="w-3 h-3"/> {call.agentName}</span>
               <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {call.duration}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Column: Player & Metadata */}
          <div className="w-1/3 bg-slate-50 border-r border-slate-200 p-6 flex flex-col overflow-y-auto">
            
            {/* Audio Player Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
               <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <Play className="w-8 h-8 ml-1" />
                  </div>
               </div>
               
               {/* Fake Waveform */}
               <div className="h-12 flex items-center justify-center gap-1 mb-4 opacity-50">
                 {Array.from({ length: 20 }).map((_, i) => (
                   <div 
                    key={i} 
                    className="w-1 bg-indigo-500 rounded-full animate-pulse" 
                    style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.05}s` }} 
                   />
                 ))}
               </div>
               
               {/* Native Audio (Hidden or styled) */}
               <audio className="w-full" controls src={call.audioUrl || "#"} />
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Tag className="w-3 h-3" /> Topics Detected
              </h4>
              <div className="flex flex-wrap gap-2">
                {call.analysis?.keywords.slice(0, 8).map((k, i) => (
                  <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600 shadow-sm">
                    {k.text}
                  </span>
                ))}
              </div>
            </div>

             {/* Sentiment Card */}
             {call.analysis && (
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <p className="text-xs text-slate-500 uppercase mb-2">Sentiment Score</p>
                <div className="flex items-end gap-2">
                  <span className={`text-4xl font-bold ${call.analysis.sentimentScore > 50 ? 'text-green-600' : 'text-red-500'}`}>
                    {call.analysis.sentimentScore}
                  </span>
                  <span className="text-sm text-slate-400 mb-1">/ 100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                   <div 
                    className={`h-1.5 rounded-full ${call.analysis.sentimentScore > 50 ? 'bg-green-500' : 'bg-red-500'}`} 
                    style={{ width: `${call.analysis.sentimentScore}%` }}
                   ></div>
                </div>
              </div>
             )}
          </div>

          {/* Right Column: Transcript & Analysis */}
          <div className="w-2/3 flex flex-col bg-white">
            
            {/* Tabs (Mock) */}
            <div className="flex border-b border-slate-200">
               <button className="px-6 py-3 text-sm font-medium text-indigo-600 border-b-2 border-indigo-600">Transcript</button>
               <button className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-800">AI Summary</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              
              {/* Summary Box */}
              {call.analysis && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> AI Executive Summary
                  </h4>
                  <p className="text-sm text-indigo-800 leading-relaxed">
                    {call.analysis.summary}
                  </p>
                </div>
              )}

              {/* Transcript */}
              <div className="space-y-4">
                {call.transcript.split('\n').map((line, i) => {
                  const isAgent = line.startsWith('Agent:');
                  return (
                    <div key={i} className={`flex gap-4 ${isAgent ? 'flex-row' : 'flex-row-reverse'}`}>
                       <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${isAgent ? 'bg-slate-100 text-slate-600' : 'bg-indigo-100 text-indigo-600'}`}>
                         {isAgent ? 'AG' : 'CL'}
                       </div>
                       <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                         isAgent 
                          ? 'bg-slate-50 text-slate-700 rounded-tl-none' 
                          : 'bg-white border border-slate-200 text-slate-900 rounded-tr-none shadow-sm'
                       }`}>
                         <p>{line.replace(/^(Agent|Client):/, '').trim()}</p>
                       </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CallPlayer;
