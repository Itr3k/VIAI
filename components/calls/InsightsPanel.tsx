
import React, { useState } from 'react';
import { CallData } from '../../types';
import { Brain, FileText, CheckSquare, BarChart2, Tag } from 'lucide-react';

interface InsightsPanelProps {
  call: CallData;
  onGenerate: () => void;
  isGenerating: boolean;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ call, onGenerate, isGenerating }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'topics'>('overview');
  const hasAnalysis = !!call?.analysis;

  if (!hasAnalysis) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
           <Brain className="w-8 h-8 text-indigo-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Insights Available</h3>
        <p className="text-slate-500 text-sm mt-2 mb-6 max-w-xs">
           This call hasn't been processed by our AI engine yet. Generate insights to see sentiment, summary, and action items.
        </p>
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-70 disabled:cursor-wait flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Analyzing Call...
            </>
          ) : (
            'Generate AI Insights'
          )}
        </button>
      </div>
    );
  }

  // Safe access to analysis with fallback
  const analysis = call.analysis!;
  const isPositive = analysis.sentimentScore >= 50;
  const keywords = analysis.keywords || [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header Tabs */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'overview' 
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" /> Overview
        </button>
        <button
          onClick={() => setActiveTab('topics')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'topics' 
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Tag className="w-4 h-4" /> Topics
        </button>
      </div>

      <div className="p-6 overflow-y-auto flex-1">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Sentiment Block */}
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-100">
               <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                     <BarChart2 className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-xs text-slate-500 uppercase font-semibold">Sentiment Score</p>
                     <p className={`font-bold text-lg ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
                        {analysis.sentimentScore}/100
                     </p>
                  </div>
               </div>
               <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                 isPositive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
               }`}>
                 {isPositive ? 'Positive' : 'Negative'}
               </span>
            </div>

            {/* Summary Block */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                 Summary
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                 {analysis.summary}
              </p>
            </div>

            {/* Missed Opp Warning */}
            {analysis.missedEmailOpportunity && (
               <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                     <CheckSquare className="w-5 h-5 text-amber-600 mt-0.5" />
                     <div>
                        <h5 className="text-sm font-bold text-amber-800">Missed Action Item</h5>
                        <p className="text-xs text-amber-700 mt-1">
                           The agent promised to send an email but no record was found.
                        </p>
                     </div>
                  </div>
               </div>
            )}
          </div>
        )}

        {activeTab === 'topics' && (
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-4">Key Topics Detected</h4>
            <div className="flex flex-wrap gap-2">
               {keywords.length > 0 ? (
                 keywords.map((keyword, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                       <span className="text-sm text-slate-700 font-medium">{keyword.text}</span>
                       <span className="text-xs text-slate-400 border-l border-slate-200 pl-2">{keyword.value}%</span>
                    </div>
                 ))
               ) : (
                 <p className="text-sm text-slate-400 italic">No topics extracted.</p>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;
