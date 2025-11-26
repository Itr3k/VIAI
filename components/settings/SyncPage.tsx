
import React, { useState } from 'react';
import { SyncStatus } from '../../types';

const SyncPage: React.FC = () => {
  const [status, setStatus] = useState<SyncStatus>({
    state: 'idle',
    lastRun: '2023-10-28T04:00:00Z',
    itemsProcessed: 0,
    type: 'regular'
  });

  const handleSync = (type: 'regular' | 'backfill') => {
    setStatus({ ...status, state: 'syncing', type });
    
    // Simulate Backend Call
    setTimeout(() => {
      // Step 1: Connecting
      setTimeout(() => {
        // Step 2: Processing
        setStatus(prev => ({ ...prev, itemsProcessed: 14 }));
        setTimeout(() => {
          // Step 3: Done
          setStatus({
            state: 'success',
            lastRun: new Date().toISOString(),
            itemsProcessed: type === 'backfill' ? 452 : 23,
            type
          });
          
          // Reset after 5s
          setTimeout(() => {
            setStatus(prev => ({ ...prev, state: 'idle' }));
          }, 5000);
        }, 2000);
      }, 1500);
    }, 500);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Data Synchronization</h2>
        <p className="text-slate-500 mt-1">Manage connection with ElevenLabs API and data freshness.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Regular Sync Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-32 h-32 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 17.292l-4.5-4.364 1.857-1.858 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.643z"/></svg>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Standard Sync</h3>
            <p className="text-slate-500 text-sm mb-6 h-10">
              Fetches recent calls from the last 14 days. <br/>Use this for periodic updates.
            </p>
            
            <button
              onClick={() => handleSync('regular')}
              disabled={status.state === 'syncing'}
              className="w-full bg-white border border-slate-300 hover:border-indigo-500 hover:text-indigo-600 text-slate-700 font-medium py-2.5 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {status.state === 'syncing' && status.type === 'regular' ? (
                <span className="flex items-center gap-2"><span className="animate-spin">⟳</span> Syncing...</span>
              ) : 'Start Sync'}
            </button>
          </div>
        </div>

        {/* Backfill Sync Card */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/></svg>
          </div>

          <div className="relative z-10 text-white">
            <h3 className="text-lg font-bold mb-2">Historical Backfill</h3>
            <p className="text-slate-400 text-sm mb-6 h-10">
              Deep fetch for the last 90 days. <br/>Recommended for initial setup.
            </p>
            
            <button
              onClick={() => handleSync('backfill')}
              disabled={status.state === 'syncing'}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2"
            >
               {status.state === 'syncing' && status.type === 'backfill' ? (
                <span className="flex items-center gap-2"><span className="animate-spin">⟳</span> Backfilling...</span>
              ) : 'Start Backfill'}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Sync Status</h4>
        
        {status.state === 'syncing' ? (
           <div className="space-y-4">
             <div className="flex justify-between text-sm text-slate-600">
               <span>Processing...</span>
               <span className="font-mono">{status.itemsProcessed > 0 ? `${status.itemsProcessed} items` : 'Connecting...'}</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
               <div className="bg-indigo-500 h-2 rounded-full animate-progress-indeterminate"></div>
             </div>
           </div>
        ) : status.state === 'success' ? (
          <div className="flex items-center gap-3 text-green-700 bg-green-50 p-4 rounded-lg border border-green-100">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
             <span className="font-medium">Sync Complete. Processed {status.itemsProcessed} conversations.</span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-sm text-slate-500">
             <span>System Idle</span>
             <span>Last Successful Run: {status.lastRun ? new Date(status.lastRun).toLocaleString() : 'Never'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncPage;
