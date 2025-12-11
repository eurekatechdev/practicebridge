
import React from 'react';
import { BrainCircuit, ArrowRight, TrendingUp, DollarSign } from 'lucide-react';
import { MOCK_MINING_OPPORTUNITIES } from '../constants';
import { ViewState } from '../types';

interface RevenueWidgetProps {
  onNavigate: (view: ViewState) => void;
}

const RevenueWidget: React.FC<RevenueWidgetProps> = ({ onNavigate }) => {
  const totalRevenue = MOCK_MINING_OPPORTUNITIES.reduce((acc, curr) => acc + curr.estRevenue, 0);
  const opportunityCount = MOCK_MINING_OPPORTUNITIES.length;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-purple-100 p-1.5 rounded-lg">
            <BrainCircuit className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="font-bold text-slate-800">Revenue Intelligence</h3>
        </div>
        <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
          AI FOUND
        </span>
      </div>

      <div className="mb-6">
        <div className="text-2xl font-bold text-slate-900 flex items-center gap-1">
          ${totalRevenue.toLocaleString()}
          <span className="text-xs font-normal text-slate-400 mt-1">potential</span>
        </div>
        <div className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
          <TrendingUp className="w-3 h-3" />
          {opportunityCount} unscheduled treatments
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto max-h-[160px] pr-1">
        {MOCK_MINING_OPPORTUNITIES.slice(0, 3).map((opp) => (
          <div key={opp.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 text-xs font-bold">
              {opp.patientName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold text-slate-800 truncate">{opp.patientName}</p>
                <span className="text-xs font-mono text-slate-600">${opp.estRevenue}</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">{opp.treatment}</p>
              <div className="mt-1 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full" 
                  style={{ width: `${opp.confidence}%` }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => onNavigate(ViewState.ANALYTICS)}
        className="mt-4 w-full py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all flex items-center justify-center gap-1"
      >
        View Mining Report <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};

export default RevenueWidget;
