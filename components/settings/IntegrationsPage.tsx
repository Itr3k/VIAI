
import React, { useState } from 'react';
import { Check, Plus, ExternalLink } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  category: 'crm' | 'calendar' | 'communication';
}

const IntegrationsPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [agentId, setAgentId] = useState('agent_12345_mock');
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'google-calendar', name: 'Google Calendar', description: 'Sync appointments and availability.', icon: 'https://www.gstatic.com/images/branding/product/1x/calendar_2020q4_48dp.png', connected: false, category: 'calendar' },
    { id: 'salesforce', name: 'Salesforce', description: 'Create leads and log calls automatically.', icon: 'https://www.salesforce.com/news/wp-content/uploads/sites/3/2021/05/Salesforce-Logo.png', connected: false, category: 'crm' },
    { id: 'hubspot', name: 'HubSpot', description: 'Sync contacts and deal stages.', icon: 'https://www.hubspot.com/hubfs/assets/hubspot.com/style-guide/brand-guidelines/guidelines_the-logo.svg', connected: true, category: 'crm' },
    { id: 'slack', name: 'Slack', description: 'Send notifications to your team channels.', icon: 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png', connected: false, category: 'communication' }
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API save
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1200);
  };

  const handleSyncAgent = () => {
    setIsSyncing(true);
    // Simulate Backend Cloud Function `configureAgentTools`
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced(new Date().toLocaleString());
      alert('Success: "viai_email_tool" has been injected into your ElevenLabs Agent.');
    }, 2000);
  };

  const handleConnect = (integrationId: string) => {
    // Mock Nango Connect Flow
    const width = 600;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    // In a real app, this would open Nango's connect UI
    const mockWindow = window.open('', 'Connect Integration', `width=${width},height=${height},top=${top},left=${left}`);
    if (mockWindow) {
      mockWindow.document.write(`
                <html>
                    <body style="font-family: system-ui; padding: 40px; text-align: center;">
                        <h2>Connecting to ${integrations.find(i => i.id === integrationId)?.name}...</h2>
                        <p>This is a mock Nango authentication flow.</p>
                        <button onclick="window.opener.postMessage({type: 'connect_success', id: '${integrationId}'}, '*'); window.close();" style="padding: 10px 20px; background: #000; color: #fff; border: none; border-radius: 6px; cursor: pointer; margin-top: 20px;">
                            Authorize Access
                        </button>
                    </body>
                </html>
            `);
    }

    // Listen for mock success
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'connect_success' && event.data.id === integrationId) {
        setIntegrations(prev => prev.map(i => i.id === integrationId ? { ...i, connected: true } : i));
        window.removeEventListener('message', handleMessage);
      }
    };
    window.addEventListener('message', handleMessage);
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredIntegrations = integrations.filter(integration =>
    integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Integrations</h2>
        <p className="text-slate-500 mt-1">Connect third-party tools and AI voice providers.</p>
      </div>

      {/* Core Voice Provider */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">
              XI
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">ElevenLabs</h3>
              <p className="text-sm text-slate-500">Conversational AI & Voice Generation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            <span className="text-sm font-medium text-slate-700">Active</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleSave} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">API Key (xi-api-key)</label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm font-mono tracking-wider"
                  placeholder="sk_..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">Stored securely using AES-256 encryption.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSaving || !apiKey}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isSaved
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
                  } disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]`}
              >
                {isSaving ? 'Saving...' : isSaved ? 'Saved!' : 'Save Key'}
              </button>
            </div>
          </form>

          <div className="border-t border-slate-100 pt-6">
            <h4 className="font-bold text-slate-900 mb-2">Agent Configuration</h4>
            <p className="text-sm text-slate-600 mb-4 max-w-2xl">
              Syncing your agent will automatically register the <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-xs">viai_email_tool</code> capability. This allows your AI agent to trigger email drafts directly during calls.
            </p>

            <div className="flex items-start gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Target Agent ID</label>
                <input
                  type="text"
                  value={agentId}
                  readOnly
                  className="bg-transparent font-mono text-sm text-slate-800 w-full outline-none"
                />
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={handleSyncAgent}
                  disabled={isSyncing}
                  className="flex items-center gap-2 bg-white border border-slate-300 hover:border-brand-500 hover:text-brand-600 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  {isSyncing ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Syncing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      Sync Agent Tools
                    </>
                  )}
                </button>
                {lastSynced && <span className="text-xs text-green-600 font-medium">Synced: {lastSynced}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Third Party Integrations (Nango) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Available Integrations</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Powered by Nango</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIntegrations.map(integration => (
            <div key={integration.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shrink-0">
                <img src={integration.icon} alt={integration.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900">{integration.name}</h4>
                  {integration.connected ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <Check className="w-3 h-3" />
                      Connected
                    </span>
                  ) : (
                    <button
                      onClick={() => handleConnect(integration.id)}
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-full transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      Connect
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  {integration.description}
                </p>
                {integration.connected && (
                  <div className="mt-3 flex items-center gap-2">
                    <input type="checkbox" id={`rag-sync-${integration.id}`} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                    <label htmlFor={`rag-sync-${integration.id}`} className="text-xs text-slate-600 font-medium cursor-pointer">
                      Sync to Korra RAG
                    </label>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filteredIntegrations.length === 0 && (
            <div className="col-span-2 text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p>No integrations found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
