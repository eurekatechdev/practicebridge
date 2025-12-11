
import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { extractInsuranceInfo } from '../services/geminiService';
import { InsuranceDetails } from '../types';

const InsuranceOCR: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<InsuranceDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selected: File) => {
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setData(null);
    setError(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await extractInsuranceInfo(file);
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Failed to process image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Insurance Intake (OCR)</h2>
        <p className="text-slate-500 mt-1">Upload a patient's insurance card to automatically extract policy details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <label 
            className="block w-full cursor-pointer group"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
              ${dragActive ? 'border-blue-500 bg-blue-50 scale-[1.02]' : ''}
              ${preview ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
            `}>
              {preview ? (
                <img src={preview} alt="Card Preview" className="max-h-64 mx-auto rounded shadow-sm" />
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className={`w-12 h-12 mb-4 transition-colors ${dragActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`} />
                  <p className="text-slate-600 font-medium">Click or drag card image here</p>
                  <p className="text-xs text-slate-400 mt-2">PNG, JPG up to 5MB</p>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </div>
          </label>

          <button
            onClick={handleProcess}
            disabled={!file || loading}
            className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all
              ${!file || loading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'}
            `}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            {loading ? 'Processing with Gemini...' : 'Extract Data'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
          {!data && !loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 backdrop-blur-[2px] z-10">
              <p className="text-slate-400 font-medium">Extracted data will appear here</p>
            </div>
          )}

          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Verified Details
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Payer Name</label>
              <input 
                type="text" 
                readOnly 
                value={data?.payerName || ''} 
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Plan Type</label>
                <input 
                  type="text" 
                  readOnly 
                  value={data?.planType || ''} 
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-800"
                  placeholder="..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Member ID</label>
                <input 
                  type="text" 
                  readOnly 
                  value={data?.memberId || ''} 
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono"
                  placeholder="..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Group Number</label>
              <input 
                type="text" 
                readOnly 
                value={data?.groupNumber || ''} 
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono"
                placeholder="..."
              />
            </div>
          </div>
          
          {data && (
             <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
               <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                 Save to Patient Record &rarr;
               </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsuranceOCR;
