
import React, { useState } from 'react';
import { Lock, ShieldCheck, ChevronRight, Loader2, Building2, Mail, AlertCircle } from 'lucide-react';
import { MOCK_USERS } from '../constants';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
  const [email, setEmail] = useState('');
  const [orgId, setOrgId] = useState('ORG-8842'); // Default Tenant for Demo
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State to hold the user identified in Step 1
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate Identity Platform Authentication (SaaS SSO)
    setTimeout(() => {
      // Find user by email to determine role
      const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (foundUser) {
        setPendingUser(foundUser);
        setIsLoading(false);
        setStep('mfa');
      } else {
        setIsLoading(false);
        setError("User not found. Try 'aris@practice.com' or 'sarah@practice.com'");
      }
    }, 800);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!pendingUser) {
      setStep('credentials');
      return;
    }

    // Simulate MFA verification
    setTimeout(() => {
      setIsLoading(false);
      // Inject Tenant Context into User Session
      const userWithTenant = {
        ...pendingUser,
        tenantId: orgId
      };
      onLogin(userWithTenant);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-50 p-8 text-center border-b border-slate-100">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg shadow-blue-600/20">
            P
          </div>
          <h1 className="text-2xl font-bold text-slate-800">PracticeBridge</h1>
          <p className="text-slate-500 text-sm mt-1">HIPAA-Compliant Secure Access</p>
        </div>

        {/* Body */}
        <div className="p-8">
          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              
              {/* Organization/Tenant ID */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Organization ID</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={orgId}
                    onChange={(e) => setOrgId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase font-mono text-slate-600 placeholder-slate-300"
                    placeholder="ORG-XXXX"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="name@practice.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="text-xs text-red-600 flex items-center gap-1 bg-red-50 p-2 rounded">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ChevronRight className="w-5 h-5" /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleMfaSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Two-Factor Authentication</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Enter the 6-digit code sent to <br/>
                  <span className="font-mono font-medium text-slate-700">***-***-5521</span>
                </p>
                <div className="mt-2 text-xs text-blue-600 bg-blue-50 py-1 px-2 rounded inline-block">
                  Logging in as: <strong>{pendingUser?.email}</strong>
                </div>
              </div>

              <div>
                <input 
                  type="text" 
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-full text-center text-2xl font-mono tracking-[0.5em] px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading || mfaCode.length < 6}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Access'}
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep('credentials')}
                className="w-full text-slate-400 text-sm hover:text-slate-600"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100 text-xs text-slate-400 flex items-center justify-center gap-2">
          <Lock className="w-3 h-3" />
          End-to-end encrypted • HIPAA Compliant
        </div>
      </div>
    </div>
  );
};

export default Login;
