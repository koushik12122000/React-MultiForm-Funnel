import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Send, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import { 
  getWebhookUrl, 
  setWebhookUrl, 
  getVaultedLeads, 
  getSubmissionHistory, 
  retryVaultedLeads, 
  clearLeadData 
} from '../services/leadService';

export default function LeadInspectorModal({ isOpen, onClose, currentLeadPayload }) {
  const [webhookUrl, setWebhookInput] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [vaultedLeads, setVaultedLeads] = useState([]);
  const [history, setHistory] = useState([]);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryResult, setRetryResult] = useState(null);
  const [activeTab, setActiveTab] = useState('payload'); // 'payload' | 'vault' | 'history' | 'webhook'

  useEffect(() => {
    if (isOpen) {
      setWebhookInput(getWebhookUrl());
      setVaultedLeads(getVaultedLeads());
      setHistory(getSubmissionHistory());
      setRetryResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveWebhook = (e) => {
    e.preventDefault();
    setWebhookUrl(webhookUrl);
    setSaveStatus('Webhook URL updated successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleCopyPayload = () => {
    const dataToCopy = currentLeadPayload || (history[0] || { note: 'No leads submitted yet.' });
    navigator.clipboard.writeText(JSON.stringify(dataToCopy, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRetryVault = async () => {
    setIsRetrying(true);
    const res = await retryVaultedLeads();
    setRetryResult(res);
    setVaultedLeads(getVaultedLeads());
    setHistory(getSubmissionHistory());
    setIsRetrying(false);
  };

  const handleClear = () => {
    if (confirm('Clear local history and vaulted leads?')) {
      clearLeadData();
      setVaultedLeads([]);
      setHistory([]);
    }
  };

  const displayPayload = currentLeadPayload || history[0] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-700 font-sans">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Lead & Meta CAPI Automation Hub</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Resilience Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect JSON payloads, Meta event_id deduplication keys, & configure n8n/Airtable endpoints.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-5 text-xs font-semibold gap-1 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('payload')}
            className={`py-3 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'payload'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Payload & CAPI Spec
          </button>
          <button
            onClick={() => setActiveTab('webhook')}
            className={`py-3 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'webhook'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            n8n Webhook Config
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`py-3 px-3 border-b-2 cursor-pointer transition-colors relative ${
              activeTab === 'vault'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Resilient Offline Vault
            {vaultedLeads.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-slate-900 rounded-full text-[10px] font-bold">
                {vaultedLeads.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Dispatch History ({history.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1 text-xs">
          
          {/* TAB 1: PAYLOAD */}
          {activeTab === 'payload' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  Formatted for n8n Webhook &rarr; Airtable mapping & Meta CAPI Event:
                </span>
                <button
                  onClick={handleCopyPayload}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 cursor-pointer transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>

              {displayPayload ? (
                <div className="relative">
                  <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto text-[11px] font-mono text-emerald-400 leading-relaxed max-h-[380px]">
                    {JSON.stringify(displayPayload, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 bg-slate-950/60 rounded-xl border border-slate-800">
                  <Database className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No lead payload generated yet.</p>
                  <p className="text-[11px] mt-1 text-slate-600">Complete the funnel and enter an email to generate the full payload.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WEBHOOK CONFIG */}
          {activeTab === 'webhook' && (
            <div className="space-y-5">
              <form onSubmit={handleSaveWebhook} className="space-y-3">
                <label className="block text-slate-300 font-semibold text-xs">
                  Automation Webhook Endpoint (e.g., n8n Webhook or Zapier URL):
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookInput(e.target.value)}
                    placeholder="https://n8n.yourdomain.com/webhook/disability-lead"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save Endpoint</span>
                  </button>
                </div>
                {saveStatus && (
                  <p className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {saveStatus}
                  </p>
                )}
              </form>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-slate-400">
                <div className="font-semibold text-slate-200">How this connects to your n8n &rarr; Airtable pipeline:</div>
                <ol className="list-decimal pl-4 space-y-1 leading-relaxed">
                  <li>In n8n, create a <code className="text-blue-400 bg-slate-900 px-1 py-0.5 rounded">Webhook</code> trigger set to <code className="text-blue-400 bg-slate-900 px-1 py-0.5 rounded">POST</code>.</li>
                  <li>Paste the n8n Webhook URL above. Every submission immediately POSTs the complete structured payload.</li>
                  <li>In n8n, branch to:
                    <ul className="list-disc pl-4 mt-1 text-slate-300">
                      <li><strong>Meta Conversions API node:</strong> sends <code className="text-emerald-400">meta_capi_data</code> with matching <code className="text-emerald-400">meta_event_id</code> for deduplication.</li>
                      <li><strong>Airtable node:</strong> maps <code className="text-amber-400">qualification_answers</code> directly into your columns.</li>
                    </ul>
                  </li>
                  <li>If the webhook is blank or unreachable, resilience mode queues the lead locally so zero leads are lost.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: RESILIENT VAULT */}
          {activeTab === 'vault' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200">Offline Resilience Queue</h4>
                  <p className="text-slate-400 text-[11px]">
                    If a webhook times out, is blocked by CORS, or goes down, leads are automatically preserved in this client vault.
                  </p>
                </div>
                {vaultedLeads.length > 0 && (
                  <button
                    onClick={handleRetryVault}
                    disabled={isRetrying}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg cursor-pointer transition-colors font-semibold"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                    <span>Retry Dispatch ({vaultedLeads.length})</span>
                  </button>
                )}
              </div>

              {retryResult && (
                <div className="p-3 bg-blue-900/40 border border-blue-700 rounded-xl text-blue-200 text-xs">
                  Retry result: Attempted {retryResult.attempted}, Succeeded {retryResult.succeeded}, Remaining {retryResult.remaining}
                </div>
              )}

              {vaultedLeads.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-950/60 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-60" />
                  <p className="text-emerald-400 font-semibold">Vault is Clean</p>
                  <p className="text-[11px] mt-1 text-slate-500">No failed or pending offline leads.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {vaultedLeads.map((item, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-amber-500/30 flex items-center justify-between">
                      <div>
                        <div className="font-mono text-white text-xs font-semibold">
                          {item.leadPayload?.lead?.email}
                        </div>
                        <div className="text-[11px] text-amber-400 mt-0.5">
                          Reason: {item.last_error || 'Network unreachable'}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Queued: {new Date(item.queued_at).toLocaleTimeString()} | Retries: {item.retry_count}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DISPATCH HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Recent Funnel Submissions:</span>
                {history.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear History
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-950/60 rounded-xl border border-slate-800">
                  <p>No submissions recorded yet in this browser session.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((item, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-mono text-white font-semibold">
                          {item.lead?.email || 'Unknown Email'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Event ID: {item.meta_event_id}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {new Date(item.dispatched_at || item.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.dispatch_status === 'live_webhook_delivered'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.dispatch_status === 'queued_in_vault'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {item.dispatch_status || 'simulated'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 flex justify-between items-center bg-slate-950/60 rounded-b-2xl text-[11px] text-slate-400">
          <span>Growth Automation Lead Engine v1.0</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
