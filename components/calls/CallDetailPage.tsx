
import React from 'react';
import { CallData } from '../../types';
import { CallInfoCard, CallerInfoCard, ToolActivityCard } from './InfoCards';
import InsightsPanel from './InsightsPanel';
import { AudioPlayer, TranscriptViewer } from './MediaSection';
import { MOCK_CALL_DETAIL } from '../../services/mockData';

interface CallDetailPageProps {
  call: CallData | null;
  onBack: () => void;
  onGenerateAnalysis: (id: string) => Promise<void>;
  isAnalyzing: boolean;
}

const CallDetailPage: React.FC<CallDetailPageProps> = ({ call, onBack, onGenerateAnalysis, isAnalyzing }) => {
  // SAFETY MODE: If call is missing or undefined, fall back to the robust mock object.
  // This prevents "Cannot read property of undefined" errors during development or loading states.
  const safeCall = call || MOCK_CALL_DETAIL;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Call Details</h1>
          <p className="text-slate-500 text-sm">
            {safeCall.timestamp ? new Date(safeCall.timestamp).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) : ''}
          </p>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 font-medium">Status:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wide">
            {safeCall.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 font-medium">Duration:</span>
          <span className="text-sm font-bold text-slate-900">{safeCall.duration}</span>
        </div>
      </div>

      {/* Top Row: Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CallInfoCard call={safeCall} />
        <CallerInfoCard call={safeCall} />
        <ToolActivityCard call={safeCall} />
      </div>

      {/* Middle Row: Insights */}
      <div className="min-h-[300px]">
        <InsightsPanel
          call={safeCall}
          onGenerate={() => onGenerateAnalysis(safeCall.id)}
          isGenerating={isAnalyzing}
        />
      </div>

      {/* Bottom Row: Media & Transcript */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
        <AudioPlayer call={safeCall} />
        <TranscriptViewer call={safeCall} />
      </div>
    </div>
  );
};

export default CallDetailPage;
