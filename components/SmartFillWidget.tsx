import React, { useState } from 'react';
import { SmartFillCandidate } from '../types';
import { generateSmartFillInvite } from '../services/geminiService';
import { Zap, MapPin, Clock, CheckCircle, Send, Sparkles } from 'lucide-react';

interface SmartFillWidgetProps {
  candidates: SmartFillCandidate[];
}

const SmartFillWidget: React.FC<SmartFillWidgetProps> = ({ candidates }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inviteDraft, setInviteDraft] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sentId, setSentId] = useState<string | null>(null);

  const handleSelect = async (candidate: SmartFillCandidate) => {
    setSelectedId(candidate.id);
    setInviteDraft(null);
    setSentId(null);
    
    setIsGenerating(true);
    try {
      const draft = await generateSmartFillInvite(candidate, "Tomorrow at 2:00 PM");
      setInviteDraft(draft);
    } catch (e) {
      console.error(e);
      setInviteDraft("Error generating invite.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = () => {
    if (selectedId) {
      setSentId(selectedId);
      // Reset after a delay to allow another selection
      setTimeout(() => {
        setSelectedId(null);
        setInviteDraft(null);
      }, 3000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Smart Fill Engine</h3>
          <p className="text-xs text-slate-500">1 Opening: <span className="font-semibold text-indigo-700">Tomorrow @ 2:00 PM</span></p>
        </div>
      </div>

      <div className="space-y-3">
        {candidates.map((candidate) => (
          <div 
            key={candidate.id}
            className={`
              relative p-3 rounded-lg border transition-all cursor-pointer
              ${selectedId === candidate.id 
                ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500' 
                : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'
              }
              ${sentId === candidate.id ? 'opacity-50' : ''}
            `}
            onClick={() => !sentId && handleSelect(candidate)}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold text-slate-800 text-sm">{candidate.name}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                candidate.propensityScore > 90 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {candidate.propensityScore}% Match
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {candidate.distanceMiles}mi
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Last: {candidate.lastVisit}
              </div>
            </div>
            <div className="mt-1 text-xs text-indigo-600 font-medium italic">
              "{candidate.reason}"
            </div>

            {/* Expanded Action Area */}
            {selectedId === candidate.id && !sentId && (
              <div className="mt-3 pt-3 border-t border-slate-100 animate-in fade-in slide-in-from-top-1">
                {isGenerating ? (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Sparkles className="w-3 h-3 animate-spin" /> Drafting SMS...
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="bg-slate-50 p-2 rounded text-xs text-slate-600 border border-slate-200">
                      {inviteDraft}
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSend(); }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded flex items-center justify-center gap-2 transition-colors"
                    >
                      <Send className="w-3 h-3" /> Send Invite
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Sent Success State */}
            {sentId === candidate.id && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
                  <CheckCircle className="w-5 h-5" /> Sent!
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartFillWidget;