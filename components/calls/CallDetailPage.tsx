
import React from 'react';
import { CallData } from '../../types';
import { CallDetailLayout } from './CallDetailLayout';
import { CallInfoCard, CallerInfoCard, ToolActivityCard } from './InfoCards';
import InsightsPanel from './InsightsPanel';
import { MediaSection } from './MediaSection';
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
    <CallDetailLayout
      title={`Call: ${safeCall.clientName || 'Unknown'}`}
      subtitle={`ID: ${safeCall.id} • ${safeCall.timestamp ? new Date(safeCall.timestamp).toLocaleString() : ''}`}
      onBack={onBack}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8 h-full">
        
        {/* LEFT COLUMN: Info Cards + Insights */}
        <div className="space-y-6 lg:col-span-1 flex flex-col h-full">
           
           {/* Zone A Cards */}
           <div className="grid grid-cols-1 gap-4 shrink-0">
              <CallInfoCard call={safeCall} />
              <CallerInfoCard call={safeCall} />
              <ToolActivityCard call={safeCall} />
           </div>

           {/* Zone B: Insights (Fills remaining height) */}
           <div className="flex-1 min-h-[400px]">
              <InsightsPanel 
                call={safeCall} 
                onGenerate={() => onGenerateAnalysis(safeCall.id)}
                isGenerating={isAnalyzing}
              />
           </div>
        </div>

        {/* RIGHT COLUMN: Media & Transcript */}
        <div className="lg:col-span-2 h-full min-h-[600px]">
           <MediaSection call={safeCall} />
        </div>

      </div>
    </CallDetailLayout>
  );
};

export default CallDetailPage;
