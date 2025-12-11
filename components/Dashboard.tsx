
import React from 'react';
import { MOCK_METRICS, MOCK_SMART_FILL_CANDIDATES, MOCK_TREATMENT_PLANS } from '../constants';
import { Patient, ViewState } from '../types';
import { Activity, Users, DollarSign, CalendarX, TrendingUp, TrendingDown, Eye, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';
import SmartFillWidget from './SmartFillWidget';
import RevenueWidget from './RevenueWidget';

interface DashboardProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onNavigate: (view: ViewState) => void;
  onViewTreatmentPlan: (patient: Patient) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ patients, onSelectPatient, onNavigate, onViewTreatmentPlan }) => {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_METRICS.map((metric, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-slate-500 text-sm font-medium">{metric.label}</span>
              {idx === 0 && <DollarSign className="w-5 h-5 text-slate-300" />}
              {idx === 1 && <Users className="w-5 h-5 text-slate-300" />}
              {idx === 2 && <CalendarX className="w-5 h-5 text-slate-300" />}
              {idx === 3 && <Activity className="w-5 h-5 text-slate-300" />}
            </div>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-2xl font-bold text-slate-900">{metric.value}</span>
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded flex items-center ${
                metric.trend === 'up' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
              }`}>
                {metric.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {Math.abs(metric.change)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Patient List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-semibold text-slate-800">
              {patients.length < 4 ? 'Search Results' : "Today's Schedule & Risk Analysis"}
            </h2>
            <div className="flex gap-2">
              <button className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-md text-slate-600 font-medium hover:bg-slate-50">Filter High Risk</button>
              <button className="text-sm text-blue-600 font-medium hover:text-blue-800">View All</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            {patients.length === 0 ? (
               <div className="p-8 text-center text-slate-500">
                 No patients found matching your search.
               </div>
            ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">
                    <div className="flex items-center gap-1">
                      No-Show Prediction
                      <AlertCircle className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((patient) => {
                  const hasPlan = !!MOCK_TREATMENT_PLANS[patient.id];
                  return (
                    <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={patient.avatarUrl} alt="" className="w-10 h-10 rounded-full bg-slate-200 object-cover" />
                          <div>
                            <div className="font-medium text-slate-900">{patient.name}</div>
                            <div className="text-xs text-slate-500">{patient.nextAppt ? new Date(patient.nextAppt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Unscheduled'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          patient.insuranceStatus === 'Active' ? 'bg-green-100 text-green-700' :
                          patient.insuranceStatus === 'Expired' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {patient.insuranceStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className={patient.noShowRiskScore > 50 ? "text-red-700 font-bold" : "text-slate-600"}>
                              {patient.noShowRiskScore > 50 ? "High Risk" : "Low Risk"}
                            </span>
                            <span className="text-slate-400">{patient.noShowRiskScore}%</span>
                          </div>
                          <div className="w-full max-w-[140px] h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                patient.noShowRiskScore > 75 ? 'bg-red-600' : 
                                patient.noShowRiskScore > 50 ? 'bg-orange-500' : 
                                'bg-green-500'
                              }`} 
                              style={{ width: `${patient.noShowRiskScore}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {hasPlan && (
                             <button 
                              onClick={() => onViewTreatmentPlan(patient)}
                              className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors group relative"
                              title="Present Visual Treatment Plan"
                            >
                              <Sparkles className="w-4 h-4" />
                              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                              </span>
                            </button>
                          )}
                          <button 
                            onClick={() => onSelectPatient(patient)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Record"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onSelectPatient(patient)}
                            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="AI Chat & Sentiment"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            )}
          </div>
        </div>

        {/* Right Column: AI Widgets */}
        <div className="space-y-6">
          {/* Phase 3.2 Smart Fill Widget */}
          <SmartFillWidget candidates={MOCK_SMART_FILL_CANDIDATES} />

          {/* Phase 3.3 Revenue Intelligence Widget */}
          <RevenueWidget onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
