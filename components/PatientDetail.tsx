
import React, { useState } from 'react';
import { Patient, ExtractedTreatment, ChatMessage } from '../types';
import { Calendar, CreditCard, MessageSquare, Sparkles, BrainCircuit, Check, FileText, Send, User, AlertTriangle, ShieldAlert, Edit3, Mail, Phone, ExternalLink, Mic, StopCircle, RefreshCw, CheckCircle, ChevronRight } from 'lucide-react';
import { generatePatientScript, mineClinicalNotes, analyzeMessage, generateSoapNote } from '../services/geminiService';
import { MOCK_TREATMENT_PLANS } from '../constants';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
  onViewTreatmentPlan: (planId: string) => void;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack, onViewTreatmentPlan }) => {
  // Script Gen State (Phase 2.1)
  const [scriptTone, setScriptTone] = useState<'Friendly' | 'Professional' | 'Urgent'>('Friendly');
  
  // Mining State (Phase 3.3)
  const [notes, setNotes] = useState(patient.clinicalNotes);
  const [minedTreatments, setMinedTreatments] = useState<ExtractedTreatment[]>([]);
  const [isMining, setIsMining] = useState(false);
  const [hasMined, setHasMined] = useState(false);

  // Scribe State (Phase 3 - Provider Centric)
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Eligibility State (Phase 1 - Provider Centric)
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(!!patient.insuranceVerifiedDate);

  // Chat/Sentiment State (Phase 2.3)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', text: 'Appointment confirmed for Tuesday.', sender: 'practice', timestamp: new Date(Date.now() - 86400000) }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAnalyzingChat, setIsAnalyzingChat] = useState(false);

  // Treatment Plan Check
  const hasTreatmentPlan = MOCK_TREATMENT_PLANS[patient.id];

  const handleGenerateScript = async () => {
    // Phase 2.2: Dynamic Script Gen
    const script = await generatePatientScript({
      patientName: patient.name,
      treatmentType: 'Recare / Checkup',
      isBirthdayMonth: new Date(patient.dob).getMonth() === new Date().getMonth(),
      lastVisitDate: patient.lastVisit,
      tone: scriptTone
    });
    // Add generated script to chat as a draft
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: script,
      sender: 'practice',
      timestamp: new Date()
    }]);
  };

  const handleMining = async () => {
    // Phase 3.3: Treatment Mining
    setIsMining(true);
    setHasMined(false);
    try {
      // Use the current value of the notes textarea, allowing user to "Test" the AI
      const treatments = await mineClinicalNotes(notes);
      setMinedTreatments(treatments);
      setHasMined(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsMining(false);
    }
  };

  const toggleScribe = async () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate recording... user talks
    } else {
      setIsRecording(false);
      setIsTranscribing(true);
      try {
        // Simulate a transcript based on the patient (mocked for demo)
        const mockTranscript = "Patient presents with sensitivity on tooth number 30. Exam reveals mesial decay and a fracture line on the buccal cusp. I recommend a crown for #30 to prevent further splitting. Patient agreed to treatment plan.";
        const soapNote = await generateSoapNote(mockTranscript);
        // Append instead of replace for safety
        setNotes(prev => prev + (prev ? "\n\n" : "") + soapNote);
      } catch (e) {
        console.error(e);
      } finally {
        setIsTranscribing(false);
      }
    }
  };

  const handleVerifyInsurance = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1500);
  };

  const simulateIncomingMessage = async (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'patient',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Phase 2.3: Sentiment Analysis
    setIsAnalyzingChat(true);
    try {
      const analysis = await analyzeMessage(text, patient.name);
      
      // Update the message with analysis
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, analysis } : m));

      // If safe, auto-suggest reply
      if (analysis.suggestedReply && !analysis.requiresHumanReview) {
        // Just for demo purposes, we auto-fill the input
        setInputMessage(analysis.suggestedReply);
      }
    } catch (e) {
      console.error("Analysis failed", e);
    } finally {
      setIsAnalyzingChat(false);
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'practice',
      timestamp: new Date()
    }]);
    setInputMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium">
            &larr; Back
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Patient Record</h1>
        </div>
        
        {/* Treatment Plan CTA (Provider-Centric Feature 1) */}
        {hasTreatmentPlan && (
           <button 
             onClick={() => onViewTreatmentPlan(MOCK_TREATMENT_PLANS[patient.id].id)}
             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-md shadow-blue-200 flex items-center gap-2 transition-all"
           >
             <Sparkles className="w-4 h-4" />
             Present Visual Treatment Plan
           </button>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6 h-full overflow-hidden">
        
        {/* Left Column: Patient Profile & Clinical (Phase 3.3) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 pb-4">
          {/* Profile Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-4 mb-6">
              <img src={patient.avatarUrl} alt={patient.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-100" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    patient.insuranceStatus === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {patient.insuranceStatus.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400">ID: {patient.id}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="flex items-center gap-2 text-slate-500"><Phone className="w-4 h-4"/> Phone</span>
                <a href={`tel:${patient.phone}`} className="font-medium text-blue-600 hover:underline flex items-center gap-1">
                  {patient.phone}
                </a>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="flex items-center gap-2 text-slate-500"><Mail className="w-4 h-4"/> Email</span>
                <a href={`mailto:${patient.email}`} className="font-medium text-blue-600 hover:underline flex items-center gap-1 truncate max-w-[160px]" title={patient.email}>
                  {patient.email}
                </a>
              </div>
              
              {/* Insurance Eligibility (Provider-Centric Feature 3) */}
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-bold text-slate-500 uppercase">Benefits Remaining</span>
                   {isVerified ? (
                     <span className="text-[10px] text-green-600 flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                       <CheckCircle className="w-3 h-3" /> Verified {patient.insuranceVerifiedDate || 'Just now'}
                     </span>
                   ) : (
                     <button 
                       onClick={handleVerifyInsurance}
                       disabled={isVerifying}
                       className="text-[10px] text-blue-600 flex items-center gap-1 hover:underline disabled:opacity-50"
                     >
                       <RefreshCw className={`w-3 h-3 ${isVerifying ? 'animate-spin' : ''}`} /> 
                       {isVerifying ? 'Checking...' : 'Verify Now'}
                     </button>
                   )}
                 </div>
                 <div className="text-xl font-bold text-slate-800">
                   ${patient.remainingBenefits?.toLocaleString() || '0.00'}
                 </div>
                 <div className="text-xs text-slate-400 mt-1 flex justify-between">
                   <span>Deductible Met: ${patient.deductibleMet || 0}</span>
                   <span>Max: $2000</span>
                 </div>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="flex items-center gap-2 text-slate-500"><ShieldAlert className="w-4 h-4"/> No-Show Risk</span>
                <span className={`font-bold flex items-center gap-1 ${patient.noShowRiskScore > 50 ? 'text-red-600' : 'text-green-600'}`}>
                  {patient.noShowRiskScore}/100
                  {patient.noShowRiskScore > 50 && <AlertTriangle className="w-3 h-3" />}
                </span>
              </div>
            </div>
          </div>

          {/* AI Clinical Scribe (Provider-Centric Feature 2) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1">
            <div className="bg-purple-50/50 p-4 border-b border-purple-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-600" />
                Clinical Scribe
              </h3>
              <div className="flex gap-2">
                 <button 
                  onClick={toggleScribe}
                  disabled={isTranscribing}
                  className={`text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                    isRecording 
                      ? 'bg-red-100 text-red-600 animate-pulse' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                 >
                   {isRecording ? <StopCircle className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                   {isRecording ? 'Recording...' : 'Scribe'}
                 </button>
                 {hasMined && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium">{minedTreatments.length} Opps</span>}
              </div>
            </div>
            <div className="p-4 overflow-y-auto max-h-[400px]">
              <div className="mb-4 relative">
                {isTranscribing && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center z-10 rounded">
                    <div className="flex flex-col items-center gap-2">
                      <BrainCircuit className="w-6 h-6 text-purple-500 animate-bounce" />
                      <span className="text-xs font-bold text-purple-700">Gemini is structuring SOAP note...</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clinical Notes (SOAP)</h4>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-sm text-slate-600 font-mono bg-slate-50 p-3 rounded border border-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all min-h-[150px]"
                />
              </div>

              {hasMined ? (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detected Opportunities</h4>
                  {minedTreatments.length === 0 ? (
                    <p className="text-sm text-slate-500">No unscheduled treatments found.</p>
                  ) : (
                    minedTreatments.map((tx, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-purple-100 bg-purple-50/30">
                        <div className="mt-0.5">
                          {tx.status === 'Diagnosed' ? <Check className="w-4 h-4 text-green-600" /> : <FileText className="w-4 h-4 text-amber-600" />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{tx.treatmentName}</p>
                          <p className="text-xs text-slate-500 mt-0.5">"{tx.snippet}"</p>
                          <p className="text-[10px] text-purple-600 mt-1 font-medium">Confidence: {tx.confidence}%</p>
                        </div>
                      </div>
                    ))
                  )}
                  <button 
                    onClick={handleMining}
                    className="w-full mt-2 text-xs text-purple-600 hover:text-purple-800 underline text-center"
                  >
                    Re-Analyze Notes
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleMining}
                  disabled={isMining}
                  className="w-full mt-2 bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  {isMining ? <BrainCircuit className="w-4 h-4 animate-pulse" /> : <BrainCircuit className="w-4 h-4" />}
                  {isMining ? 'Analyzing via Gemini...' : 'Scan for Unscheduled Revenue'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Communication Hub (Phase 2.3) */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-[calc(100vh-140px)]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              Communication Intelligence
            </h3>
            
            <div className="flex gap-2">
              <button 
                onClick={() => simulateIncomingMessage("I'm unhappy with my last filling. It hurts.")}
                className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded border border-red-100 hover:bg-red-100 transition"
              >
                Test: Complaint
              </button>
              <button 
                onClick={() => simulateIncomingMessage("When is my next cleaning?")}
                className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded border border-blue-100 hover:bg-blue-100 transition"
              >
                Test: Question
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'practice' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${msg.sender === 'practice' ? 'items-end' : 'items-start'} flex flex-col`}>
                  
                  {/* Message Bubble */}
                  <div className={`p-4 rounded-xl text-sm shadow-sm ${
                    msg.sender === 'practice' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>

                  {/* AI Analysis Card (If Incoming) */}
                  {msg.sender === 'patient' && msg.analysis && (
                    <div className={`mt-2 p-3 rounded-lg border text-xs w-full max-w-sm ${
                      msg.analysis.requiresHumanReview 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-indigo-50 border-indigo-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-1 font-semibold">
                        <Sparkles className="w-3 h-3" />
                        AI Analysis
                        {msg.analysis.requiresHumanReview && (
                          <span className="ml-auto flex items-center gap-1 text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3" /> Human Review
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-slate-600">
                        <div>Sentiment: <span className="font-medium text-slate-900">{msg.analysis.sentiment}</span></div>
                        <div>Intent: <span className="font-medium text-slate-900">{msg.analysis.intent}</span></div>
                      </div>
                      {msg.analysis.suggestedReply && (
                         <div className="mt-2 pt-2 border-t border-slate-200/50">
                           <span className="text-slate-500 block mb-1">Suggested Reply:</span>
                           <span className="italic text-slate-800">"{msg.analysis.suggestedReply}"</span>
                         </div>
                      )}
                    </div>
                  )}
                  
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.sender === 'patient' ? patient.name : 'PracticeBot'} • {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            ))}
            {isAnalyzingChat && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-xl rounded-tl-none flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150" />
                  Analying sentiment...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-200">
            {/* Quick Actions / Tone Selector */}
            <div className="flex items-center gap-2 mb-3">
               <button 
                onClick={handleGenerateScript}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition flex items-center gap-1"
               >
                 <Sparkles className="w-3 h-3" /> Generate Draft
               </button>
               <select 
                value={scriptTone}
                onChange={(e) => setScriptTone(e.target.value as any)}
                className="text-xs bg-slate-50 border-none rounded-full px-3 py-1.5 focus:ring-1 focus:ring-blue-500"
               >
                 <option value="Friendly">Friendly Tone</option>
                 <option value="Professional">Professional Tone</option>
                 <option value="Urgent">Urgent Tone</option>
               </select>
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button 
                onClick={sendMessage}
                disabled={!inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientDetail;
