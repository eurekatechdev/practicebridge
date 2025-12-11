
import React, { useState } from 'react';
import { MOCK_SYNC_LOGS } from '../constants';
import { MOCK_TENANT } from '../services/gcpService';
import { Server, Cloud, ShieldCheck, Activity, Database, Lock, RefreshCw, CheckCircle, AlertCircle, Download, Monitor, CreditCard, BarChart2 } from 'lucide-react';
import { SaaSPlan } from '../types';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'infrastructure' | 'subscription'>('infrastructure');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Configuration</h2>
          <p className="text-slate-500">Hybrid-Cloud Architecture & Compliance Monitoring</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveTab('infrastructure')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'infrastructure' 
                ? 'bg-blue-50 text-blue-700 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Infrastructure
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'subscription' 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            SaaS Subscription
          </button>
        </div>
      </div>

      {activeTab === 'subscription' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          {/* Tenant Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{MOCK_TENANT.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    ID: {MOCK_TENANT.id}
                  </span>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold">
                    {MOCK_TENANT.plan} PLAN
                  </span>
                </div>
              </div>
              <button className="text-sm text-indigo-600 font-medium hover:underline">Manage Billing</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
                  <Activity className="w-4 h-4 text-purple-500" /> AI Usage (Tokens)
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {(MOCK_TENANT.usage.aiTokens / 1000).toFixed(1)}k
                  <span className="text-xs text-slate-400 font-normal ml-1">/ {(MOCK_TENANT.limits.aiTokens / 1000)}k</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(MOCK_TENANT.usage.aiTokens / MOCK_TENANT.limits.aiTokens) * 100}%` }}></div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
                  <Database className="w-4 h-4 text-blue-500" /> Cloud Storage
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {MOCK_TENANT.usage.storageGb}GB
                  <span className="text-xs text-slate-400 font-normal ml-1">/ {MOCK_TENANT.limits.storageGb}GB</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(MOCK_TENANT.usage.storageGb / MOCK_TENANT.limits.storageGb) * 100}%` }}></div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                 <div className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
                   <Monitor className="w-4 h-4 text-green-500" /> Active Users
                 </div>
                 <div className="text-2xl font-bold text-slate-900">
                   {MOCK_TENANT.usage.activeUsers}
                   <span className="text-xs text-slate-400 font-normal ml-1">/ {MOCK_TENANT.limits.activeUsers}</span>
                 </div>
                 <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                   <div className="bg-green-500 h-full rounded-full" style={{ width: `${(MOCK_TENANT.usage.activeUsers / MOCK_TENANT.limits.activeUsers) * 100}%` }}></div>
                 </div>
              </div>
            </div>
          </div>

          {/* Upgrade Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white shadow-lg flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">Upgrade to Enterprise</h3>
              <p className="text-indigo-100 text-sm max-w-lg">
                Get unlimited AI tokens, 24/7 dedicated support, and advanced audit logs retention (7 years).
              </p>
            </div>
            <button className="bg-white text-indigo-700 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-50 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-2">
           {/* Deployment Section */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Monitor className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold">Deploy Edge Agent</h3>
              </div>
              <p className="text-slate-300 text-sm max-w-xl">
                To synchronize your on-premise Open Dental database with the Google Cloud pipeline, 
                download and install the Python Agent on your main server. Requires Windows Server 2016+.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-blue-900/50 flex items-center gap-2 transition-all transform hover:-translate-y-0.5">
                <Download className="w-5 h-5" />
                Download Agent v2.1.exe
              </button>
              <span className="text-xs text-slate-500 font-mono">MD5: 8f4a...2b19</span>
            </div>
          </div>

          {/* Infrastructure Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: On-Premise Agent */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Server className="w-5 h-5 text-indigo-600" />
                  Local Sync Agent
                </h3>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className="font-mono font-medium text-green-600">ONLINE</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Host</span>
                  <span className="font-mono text-slate-900">OPEN-DENTAL-SRV01</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Version</span>
                  <span className="font-mono text-slate-900">v2.1.0-win64</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Uptime</span>
                  <span className="font-mono text-slate-900">14d 2h 12m</span>
                </div>
              </div>
            </div>

            {/* Card 2: GCP Ingestion */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-blue-500" />
                  Cloud Ingestion
                </h3>
                <div className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">GCP</div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Region</span>
                  <span className="font-mono text-slate-900">us-central1</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Service</span>
                  <span className="text-slate-900 font-medium">Cloud Functions Gen 2</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Database</span>
                  <span className="text-slate-900 font-medium">Firestore + BigQuery</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Avg Latency</span>
                  <span className="font-mono text-slate-900">85ms</span>
                </div>
              </div>
            </div>

            {/* Card 3: Compliance */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Compliance
                </h3>
                <Lock className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">BAA Status</span>
                  <span className="flex items-center gap-1 font-bold text-emerald-600">
                    <CheckCircle className="w-4 h-4" /> Active
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Encryption (Rest)</span>
                  <span className="font-mono text-slate-900">AES-256</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Encryption (Transit)</span>
                  <span className="font-mono text-slate-900">TLS 1.3</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Access Control</span>
                  <span className="font-medium text-slate-900">IAM + MFA Enforced</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sync Logs Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-slate-400" />
                  Data Pipeline Activity
                </h3>
                <p className="text-xs text-slate-500 mt-1">Real-time logs from the Python Edge Component</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3">Timestamp</th>
                    <th className="px-6 py-3">Source Table</th>
                    <th className="px-6 py-3">Records Synced</th>
                    <th className="px-6 py-3">Duration</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_SYNC_LOGS.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <Database className="w-4 h-4 text-slate-400" />
                          {log.table}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {log.recordsSynced}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {log.durationMs}ms
                      </td>
                      <td className="px-6 py-4">
                        {log.status === 'Success' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3" /> Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <AlertCircle className="w-3 h-3" /> Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
