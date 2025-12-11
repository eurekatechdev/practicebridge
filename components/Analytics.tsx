
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line 
} from 'recharts';
import { CHART_DATA_APPT, CHART_DATA_TX, MOCK_MINING_OPPORTUNITIES, MOCK_PROVIDER_PERFORMANCE } from '../constants';
import { BrainCircuit, DollarSign, Search, ArrowRight, TrendingUp, Users, Lock, Target, Calendar, Sparkles, Loader2, MessageSquare } from 'lucide-react';
import { User, UserRole } from '../types';
import { generateCoachingPlan } from '../services/geminiService';

interface AnalyticsProps {
  currentUser?: User;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Analytics: React.FC<AnalyticsProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'mining' | 'providers'>('overview');
  const [coachingPlan, setCoachingPlan] = useState<string | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const isOwner = currentUser?.role === UserRole.OWNER_DOCTOR;

  const handleGenerateCoaching = async () => {
    setIsGeneratingPlan(true);
    try {
      // Hardcoded context based on the mock data for Dr. Sarah
      const drSarah = MOCK_PROVIDER_PERFORMANCE.find(p => p.providerName.includes('Sarah'));
      if (drSarah) {
        const plan = await generateCoachingPlan(drSarah, "Diagnosis Conversion Rate", 42, 60);
        setCoachingPlan(plan);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Practice Analytics (BigQuery)</h2>
          <p className="text-slate-500">Real-time insights powered by BigQuery ML.</p>
        </div>
        
        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'overview' 
                ? 'bg-blue-50 text-blue-700 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Overview Charts
          </button>
          <button
            onClick={() => setActiveTab('mining')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'mining' 
                ? 'bg-purple-50 text-purple-700 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            Revenue Intelligence
          </button>
          <button
            onClick={() => isOwner && setActiveTab('providers')}
            disabled={!isOwner}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'providers' 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : !isOwner ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50'
            }`}
            title={!isOwner ? "Restricted to Owner" : "Provider Scorecards"}
          >
            {!isOwner ? <Lock className="w-3 h-3" /> : <Users className="w-4 h-4" />}
            Provider Scorecards
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
          {/* Appointment Volume */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Weekly Appointment Volume</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA_APPT}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Treatment Mix */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Treatment Mix by Revenue</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CHART_DATA_TX}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {CHART_DATA_TX.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mining' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          {/* Mining Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-purple-600 rounded-xl p-6 text-white shadow-lg shadow-purple-200">
              <div className="flex items-center gap-3 mb-2 opacity-90">
                <BrainCircuit className="w-5 h-5" />
                <span className="font-medium">Total Opportunities</span>
              </div>
              <div className="text-3xl font-bold">142</div>
              <div className="text-xs mt-2 opacity-80">Identified across 1,250 patient records</div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
               <div className="flex items-center gap-3 mb-2 text-slate-500">
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Potential Revenue</span>
              </div>
              <div className="text-3xl font-bold text-slate-800">$48,250</div>
              <div className="text-xs mt-2 text-green-600 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12% vs last month
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-center items-start">
               <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium px-4 py-3 rounded-lg w-full flex items-center justify-center gap-2 transition-colors">
                 <Search className="w-4 h-4" />
                 Run Full Database Scan
               </button>
               <p className="text-xs text-slate-400 mt-2 text-center w-full">Last scan: 2 hours ago via BigQuery</p>
            </div>
          </div>

          {/* Mining Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Unscheduled Treatment Opportunities</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3">Patient</th>
                    <th className="px-6 py-3">Detected Condition</th>
                    <th className="px-6 py-3">Clinical Evidence (Snippet)</th>
                    <th className="px-6 py-3">Est. Value</th>
                    <th className="px-6 py-3">AI Confidence</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_MINING_OPPORTUNITIES.map((opp) => (
                    <tr key={opp.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{opp.patientName}</td>
                      <td className="px-6 py-4 text-slate-700">{opp.treatment}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-500 italic bg-slate-100 px-2 py-1 rounded inline-block max-w-[200px] truncate">
                          "{opp.snippet}"
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-700">${opp.estRevenue}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                             <div className={`h-full rounded-full ${opp.confidence > 90 ? 'bg-green-500' : 'bg-amber-400'}`} style={{width: `${opp.confidence}%`}}></div>
                           </div>
                           <span className="text-xs font-medium text-slate-600">{opp.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-xs bg-white border border-slate-300 hover:border-blue-400 hover:text-blue-600 text-slate-600 font-medium px-3 py-1.5 rounded-lg transition-all shadow-sm">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
              <button className="text-sm text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1">
                View All 142 Opportunities <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'providers' && isOwner && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
          {/* Filter Header */}
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Provider Performance Scorecards
            </h3>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none">
                <option>Last 90 Days</option>
                <option>Last 30 Days</option>
                <option>Year to Date</option>
              </select>
            </div>
          </div>

          {/* Training Insight & Coaching AI */}
          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-indigo-100 p-3 rounded-full shrink-0">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-indigo-900 text-lg">Training Opportunity Detected</h3>
                <p className="text-indigo-800/80 text-sm mt-1 max-w-3xl">
                  <strong>Dr. Sarah</strong> has a Diagnosis Conversion Rate of <strong>42%</strong>, which is 36% lower than the practice average. 
                  Consider scheduling a mentorship session.
                </p>
              </div>
              <button 
                onClick={handleGenerateCoaching}
                disabled={isGeneratingPlan || !!coachingPlan}
                className="shrink-0 bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-2"
              >
                {isGeneratingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isGeneratingPlan ? 'Drafting...' : 'Generate Coaching Plan'}
              </button>
            </div>

            {/* Generated Plan Output */}
            {coachingPlan && (
              <div className="ml-14 bg-white rounded-lg border border-indigo-200 p-4 animate-in fade-in slide-in-from-top-2">
                 <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                   <MessageSquare className="w-3 h-3" /> AI Suggested Script
                 </h4>
                 <div className="text-slate-700 text-sm whitespace-pre-line leading-relaxed">
                   {coachingPlan}
                 </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Conversion Rate Comparison */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                Diagnosis Conversion Rate (%)
                <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Target: 60%</span>
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_PROVIDER_PERFORMANCE} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#e2e8f0" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="providerName" type="category" width={100} tick={{fill: '#475569', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="diagnosisConversion" radius={[0, 4, 4, 0]} barSize={40}>
                       {MOCK_PROVIDER_PERFORMANCE.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.diagnosisConversion > 60 ? '#10b981' : '#f59e0b'} />
                       ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Production Per Hour Comparison */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                Hourly Production ($/hr)
                <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Excl. Hygiene</span>
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_PROVIDER_PERFORMANCE}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="providerName" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} formatter={(value) => `$${value}`} />
                    <Bar dataKey="productionPerHour" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
