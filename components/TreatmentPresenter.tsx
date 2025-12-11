
import React, { useState, useRef } from 'react';
import { TreatmentPlan, TreatmentTier } from '../types';
import { Check, ArrowLeft, Star, Clock, Shield, DollarSign, TrendingUp, Send, Image as ImageIcon, CheckCircle, PenTool, Loader2, Share2, Link } from 'lucide-react';

interface TreatmentPresenterProps {
  plan: TreatmentPlan;
  onBack: () => void;
}

const TreatmentPresenter: React.FC<TreatmentPresenterProps> = ({ plan, onBack }) => {
  const [selectedTierId, setSelectedTierId] = useState<string>('OPT2'); // Default to 'Better'
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [isSigning, setIsSigning] = useState(false); // Drawing state
  const [signatureSaved, setSignatureSaved] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedTier = plan.options.find(o => o.id === selectedTierId) || plan.options[0];

  const handleSendQuote = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 3000);
    }, 1500);
  };

  const handleGenerateLink = () => {
    // Simulate link generation
    const hash = Math.random().toString(36).substring(7);
    setShareUrl(`https://practice.bridge/plan/${hash}`);
  };

  // Canvas Drawing Logic
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsSigning(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get correct coordinates
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isSigning) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsSigning(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleAcceptCase = () => {
    setSignatureSaved(true);
    // Simulate API write-back to Open Dental Images module
    setTimeout(() => {
       setShowSignature(false);
       onBack(); // Or show success screen
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="bg-white border border-slate-200 p-2 rounded-full hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visual Treatment Plan</div>
            <h1 className="text-2xl font-bold text-slate-900">Diagnosis: {plan.diagnosis}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
           {!shareUrl ? (
             <button 
               onClick={handleGenerateLink}
               className="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors"
             >
               <Link className="w-4 h-4" /> Share Link
             </button>
           ) : (
             <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-100 text-xs text-green-700 animate-in fade-in">
               <CheckCircle className="w-3 h-3" /> Copied: <span className="underline font-mono">{shareUrl}</span>
             </div>
           )}
           <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold text-sm">
             Tooth #{plan.toothNum}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full overflow-y-auto lg:overflow-visible pr-2">
        {/* Left Column: Tiers Selection */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Visual Outcome Simulation */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-100 rounded-xl p-6 flex flex-col items-center justify-center border border-slate-200 relative overflow-hidden group">
              <div className="absolute top-3 left-3 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded">PROBLEM</div>
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
                <ImageIcon className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-600">Current Fracture</p>
              <p className="text-xs text-slate-400 text-center mt-1 max-w-[200px]">Risk of splitting to root. Sensitivity to cold.</p>
            </div>
            <div className="bg-white rounded-xl p-6 flex flex-col items-center justify-center border-2 border-green-100 relative overflow-hidden shadow-sm group">
              <div className="absolute top-3 left-3 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded">OUTCOME</div>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500 ${
                selectedTier.tier === 'Best' ? 'bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-inner' : 
                selectedTier.tier === 'Better' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200' :
                'bg-slate-300'
              }`}>
                <Star className={`w-10 h-10 ${
                  selectedTier.tier === 'Best' ? 'text-blue-200' : 
                  selectedTier.tier === 'Better' ? 'text-yellow-600' :
                  'text-slate-500'
                }`} />
              </div>
              <p className="text-sm font-semibold text-slate-800">{selectedTier.name}</p>
              <p className="text-xs text-slate-400 text-center mt-1 max-w-[200px]">Restored function. {selectedTier.tier === 'Best' ? 'Invisible aesthetics.' : 'Protected structure.'}</p>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-slate-800 mb-4">Select Option</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plan.options.map((option) => (
              <div 
                key={option.id}
                onClick={() => setSelectedTierId(option.id)}
                className={`
                  relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col justify-between
                  ${selectedTierId === option.id 
                    ? 'border-blue-500 bg-white shadow-xl scale-[1.02] z-10' 
                    : 'border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-white'}
                `}
              >
                {/* Badge for Best */}
                {option.tier === 'Best' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> DENTIST RECOMMENDED
                  </div>
                )}

                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{option.tier} Option</div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">{option.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-3">{option.description}</p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Patient Cost</div>
                      <div className="text-2xl font-bold text-slate-800">${option.patientCost}</div>
                    </div>
                    {selectedTierId === option.id ? (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-slate-300 rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Breakdown of Selected Option */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mt-8 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="font-bold text-slate-800 text-lg mb-6">Why choose the <span className="text-blue-600">{selectedTier.name}</span>?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="font-semibold text-slate-800">Durability</div>
                <div className="flex gap-1 mt-2">
                  {[...Array(10)].map((_, i) => (
                     <div key={i} className={`w-1.5 h-6 rounded-full ${i < selectedTier.durability ? 'bg-blue-500' : 'bg-slate-200'}`} />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">{selectedTier.durability}/10 Strength</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3">
                  <Star className="w-6 h-6" />
                </div>
                <div className="font-semibold text-slate-800">Aesthetics</div>
                <div className="flex gap-1 mt-2">
                  {[...Array(10)].map((_, i) => (
                     <div key={i} className={`w-1.5 h-6 rounded-full ${i < selectedTier.aesthetics ? 'bg-purple-500' : 'bg-slate-200'}`} />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">{selectedTier.aesthetics}/10 Natural Look</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="font-semibold text-slate-800">Timeline</div>
                <div className="text-xl font-bold text-slate-900 mt-2">{selectedTier.timeRequired}</div>
                <p className="text-xs text-slate-500 mt-1">To completion</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financials & Action */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-2xl flex-1 flex flex-col">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" /> Investment Summary
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-slate-300">
                <span>Procedure Fee</span>
                <span>${selectedTier.price}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Est. Insurance</span>
                <span className="text-emerald-400">-${selectedTier.price - selectedTier.patientCost}</span>
              </div>
              <div className="h-px bg-slate-700 my-2" />
              <div className="flex justify-between items-end">
                <span className="font-bold text-lg">Patient Responsibility</span>
                <span className="font-bold text-3xl">${selectedTier.patientCost}</span>
              </div>
              <div className="bg-slate-800 rounded-lg p-3 text-xs text-slate-400 mt-2">
                *Includes estimated insurance benefits verified on 12/01/2023.
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <button 
                onClick={() => setShowSignature(true)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" /> Accept Case
              </button>
              
              <button 
                onClick={handleSendQuote}
                disabled={isSending || isSent}
                className={`w-full font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  isSent 
                    ? 'bg-green-600 text-white' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {isSending ? (
                  'Sending...'
                ) : isSent ? (
                  <> <CheckCircle className="w-5 h-5" /> Quote Sent via SMS </>
                ) : (
                  <> <Send className="w-5 h-5" /> Send Quote via SMS </>
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
             <TrendingUp className="w-5 h-5 text-emerald-600" />
             <p className="text-xs text-emerald-800 font-medium">
               <strong>Good Choice:</strong> Choosing the {selectedTier.name} saves you money on future replacements due to its high durability score.
             </p>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      {showSignature && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Consent to Treatment</h3>
            <p className="text-sm text-slate-500 mb-4">
              I agree to the treatment plan for <strong>{selectedTier.name}</strong> on Tooth #{plan.toothNum}. 
              Total Patient Responsibility: <strong>${selectedTier.patientCost}</strong>.
            </p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl mb-4 relative overflow-hidden">
               <canvas 
                 ref={canvasRef}
                 width={460} 
                 height={200}
                 className="touch-none cursor-crosshair w-full"
                 onMouseDown={startDrawing}
                 onMouseMove={draw}
                 onMouseUp={stopDrawing}
                 onMouseLeave={stopDrawing}
                 onTouchStart={startDrawing}
                 onTouchMove={draw}
                 onTouchEnd={stopDrawing}
               />
               <div className="absolute bottom-2 right-2 text-[10px] text-slate-400 pointer-events-none">
                 Sign above
               </div>
               {!isSigning && <div className="absolute top-2 right-2">
                 <button onClick={clearSignature} className="text-xs text-slate-400 hover:text-red-500">Clear</button>
               </div>}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowSignature(false)}
                className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAcceptCase}
                disabled={signatureSaved}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2"
              >
                {signatureSaved ? (
                  <> <Loader2 className="w-5 h-5 animate-spin" /> Saving PDF... </>
                ) : (
                  <> <PenTool className="w-4 h-4" /> Sign & Confirm </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatmentPresenter;
