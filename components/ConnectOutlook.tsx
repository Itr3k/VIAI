import React, { useState } from 'react';

interface ConnectOutlookProps {
  isConnected: boolean;
  onConnect: () => void;
}

const ConnectOutlook: React.FC<ConnectOutlookProps> = ({ isConnected, onConnect }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    setIsLoading(true);
    // Simulate Nango Auth Flow
    setTimeout(() => {
      setIsLoading(false);
      onConnect();
    }, 1500);
  };

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>Outlook Connected via Nango</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isLoading 
          ? 'bg-slate-100 text-slate-400 cursor-wait' 
          : 'bg-[#0078D4] hover:bg-[#005a9e] text-white shadow-sm'
      }`}
    >
      {isLoading ? (
        <span>Connecting...</span>
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5.5L12 11L23 5.5M1 5.5V18.5H23V5.5M1 5.5L12 0L23 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Connect Outlook</span>
        </>
      )}
    </button>
  );
};

export default ConnectOutlook;