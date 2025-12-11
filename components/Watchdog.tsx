
import React, { useMemo } from 'react';
import { ShieldAlert, AlertTriangle, Lock, EyeOff, FileText, CheckCircle } from 'lucide-react';
import { MOCK_AUDIT_LOGS } from '../constants';
import { detectAnomalies } from '../services/securityService';
import { User, UserRole } from '../types';

interface WatchdogProps {
  currentUser: User;
}

const Watchdog: React.FC<WatchdogProps> = ({ currentUser }) => {
  const anomalies = useMemo(() => detectAnomalies(MOCK_AUDIT_LOGS), []);

  // Strict RBAC Check
  if (currentUser.role !== UserRole.OWNER_DOCTOR) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] p-6 text-center">
        <div className="bg-red-50 p-6 rounded-full mb-6">
          <EyeOff className="w-16 h-16 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-slate-500 max-w-md">
          The <strong>Financial Integrity Monitor</strong> is restricted to the <strong>OWNER_DOCTOR</strong> role only. 
          Your current role is <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-sm text-slate-800">{currentUser.role}</span>.
        </p>
        <div className="mt-8 p-4 bg-slate-50 rounded-lg text-sm text-slate-400 flex items-center gap-2">
          <Lock className="w-4 h-4" /> Security Event Logged: {new Date().toLocaleTimeString()}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-indigo-600" />
            The Watchdog
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
            Financial Integrity & Anti-Embezzlement Monitor
          </p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full font-bold text-sm">
            <CheckCircle className="w-4 h-4" /> Active Monitoring
          </div>
          <p className="text-xs text-slate-400 mt-2">Last Scan: Just now</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Alert Feed */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-slate-800">Detected Anomalies ({anomalies.length})</h3>
          
          {anomalies.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-slate-800">All Clear</h4>
              <p className="text-slate-500">No suspicious patterns detected in the last sync period.</p>
            </div>
          ) : (
            anomalies.map((anomaly) => (
              <div key={anomaly.id} className="bg-white rounded-xl shadow-sm border-l-4 border-l-red-500 border-y border-r border-slate-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold tracking-wider uppercase">
                        {anomaly.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(anomaly.detectedAt).toLocaleString()}
                      </span>
                    </div>
                    {anomaly.amount && (
                      <span className="text-lg font-mono font-bold text-slate-900">
                        ${anomaly.amount.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-lg font-bold text-slate-800 mb-2">{anomaly.title}</h4>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    {anomaly.description}
                  </p>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                     <div className="flex items-center gap-2 text-sm text-slate-500 font-mono mb-1">
                       <FileText className="w-4 h-4" /> Raw Log Data
                     </div>
                     <div className="text-xs text-slate-400 font-mono break-all">
                       LOG_ID: {anomaly.relatedLogId} | SYNC_TIME: {new Date().toISOString()}
                     </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end gap-3">
                  <button className="text-sm text-slate-500 font-medium hover:text-slate-800">Dismiss</button>
                  <button className="text-sm bg-white border border-slate-300 text-slate-700 font-medium px-4 py-1.5 rounded-lg hover:bg-slate-50 shadow-sm">
                    Investigate User
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Config */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-slate-300 p-6 rounded-xl shadow-lg">
             <h4 className="font-bold text-white mb-4 flex items-center gap-2">
               <AlertTriangle className="w-5 h-5 text-amber-400" /> Silent Alarm
             </h4>
             <p className="text-sm mb-6">
               Weekly digest sent to <strong>{currentUser.email}</strong> every Monday at 6:00 AM.
             </p>
             <div className="space-y-4 text-sm">
               <label className="flex items-center gap-3 cursor-pointer">
                 <input type="checkbox" checked readOnly className="w-4 h-4 rounded text-indigo-500 bg-slate-800 border-slate-600" />
                 <span>Email me instantly on 'High Severity'</span>
               </label>
               <label className="flex items-center gap-3 cursor-pointer">
                 <input type="checkbox" checked readOnly className="w-4 h-4 rounded text-indigo-500 bg-slate-800 border-slate-600" />
                 <span>Include "Ghost Adjustments"</span>
               </label>
             </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-xs text-amber-800 leading-relaxed">
            <strong>Legal Disclaimer:</strong> This tool detects patterns in data but does not constitute proof of criminal activity. 
            All findings should be verified with your Certified Public Accountant (CPA) and legal counsel before taking employment action. 
            False accusations can lead to liability.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watchdog;
