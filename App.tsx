
import React, { useState } from 'react';
import { ViewState, Patient, User, UserRole } from './types';
import Dashboard from './components/Dashboard';
import PatientDetail from './components/PatientDetail';
import InsuranceOCR from './components/InsuranceOCR';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Login from './components/Login';
import NotificationPanel from './components/NotificationPanel';
import TreatmentPresenter from './components/TreatmentPresenter';
import Watchdog from './components/Watchdog';
import { LayoutDashboard, FileText, PieChart, Bell, Settings as SettingsIcon, User as UserIcon, LogOut, Search, ShieldAlert } from 'lucide-react';
import { MOCK_NOTIFICATIONS, MOCK_TREATMENT_PLANS, MOCK_PATIENTS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView(ViewState.DASHBOARD);
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentView(ViewState.PATIENT_DETAIL);
  };

  const handleViewTreatmentPlan = (planId: string) => {
    // In a real app, you'd fetch the plan by ID. 
    // Here we assume the selectedPatient context is enough for the demo flow.
    setCurrentView(ViewState.TREATMENT_PRESENTER);
  };

  const handleDashboardTreatmentPlan = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentView(ViewState.TREATMENT_PRESENTER);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(ViewState.DASHBOARD);
  };

  // Global Search Logic
  const filteredPatients = MOCK_PATIENTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return (
          <Dashboard 
            patients={filteredPatients}
            onSelectPatient={handlePatientSelect} 
            onNavigate={setCurrentView}
            onViewTreatmentPlan={handleDashboardTreatmentPlan}
          />
        );
      case ViewState.INSURANCE_OCR:
        return <InsuranceOCR />;
      case ViewState.ANALYTICS:
        return <Analytics currentUser={user} />;
      case ViewState.SETTINGS:
        return <Settings />;
      case ViewState.WATCHDOG:
        return <Watchdog currentUser={user} />;
      case ViewState.PATIENT_DETAIL:
        if (selectedPatient) {
          return (
            <PatientDetail 
              patient={selectedPatient} 
              onBack={() => {
                setSelectedPatient(null);
                setCurrentView(ViewState.DASHBOARD);
              }}
              onViewTreatmentPlan={handleViewTreatmentPlan}
            />
          );
        }
        return (
          <Dashboard 
            patients={filteredPatients}
            onSelectPatient={handlePatientSelect} 
            onNavigate={setCurrentView}
            onViewTreatmentPlan={handleDashboardTreatmentPlan}
          />
        );
      case ViewState.TREATMENT_PRESENTER:
        if (selectedPatient && MOCK_TREATMENT_PLANS[selectedPatient.id]) {
          return (
            <TreatmentPresenter 
              plan={MOCK_TREATMENT_PLANS[selectedPatient.id]}
              onBack={() => setCurrentView(ViewState.PATIENT_DETAIL)}
            />
          );
        }
        return (
          <Dashboard 
            patients={filteredPatients}
            onSelectPatient={handlePatientSelect} 
            onNavigate={setCurrentView}
            onViewTreatmentPlan={handleDashboardTreatmentPlan}
          />
        );
      default:
        return (
          <Dashboard 
            patients={filteredPatients}
            onSelectPatient={handlePatientSelect} 
            onNavigate={setCurrentView}
            onViewTreatmentPlan={handleDashboardTreatmentPlan}
          />
        );
    }
  };

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans relative">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20 transition-all">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              P
            </div>
            <span className="font-bold text-white text-lg tracking-tight">PracticeBridge</span>
          </div>
          <div className="mt-2 text-xs font-mono text-slate-500">v2.5.0 • Hybrid-Cloud</div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setCurrentView(ViewState.DASHBOARD)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === ViewState.DASHBOARD ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button 
            onClick={() => setCurrentView(ViewState.INSURANCE_OCR)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === ViewState.INSURANCE_OCR ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Insurance Intake</span>
          </button>

          <button 
            onClick={() => setCurrentView(ViewState.ANALYTICS)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === ViewState.ANALYTICS ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'
            }`}
          >
            <PieChart className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </button>

          {/* Conditional Rendering for RBAC Module */}
          {user.role === UserRole.OWNER_DOCTOR && (
            <button 
              onClick={() => setCurrentView(ViewState.WATCHDOG)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === ViewState.WATCHDOG ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-800 text-indigo-300 hover:text-indigo-100'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
              <span className="font-medium">The Watchdog</span>
            </button>
          )}

        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button 
            onClick={() => setCurrentView(ViewState.SETTINGS)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === ViewState.SETTINGS ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="font-medium">Configuration</span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-8 flex-1">
            <h2 className="text-xl font-semibold text-slate-800 hidden md:block">
              {currentView === ViewState.DASHBOARD && 'Practice Overview'}
              {currentView === ViewState.INSURANCE_OCR && 'Insurance AI Processor'}
              {currentView === ViewState.ANALYTICS && 'Performance Insights'}
              {currentView === ViewState.PATIENT_DETAIL && 'Patient Record'}
              {currentView === ViewState.SETTINGS && 'System Configuration'}
              {currentView === ViewState.TREATMENT_PRESENTER && 'Visual Treatment Presenter'}
              {currentView === ViewState.WATCHDOG && 'Financial Integrity Monitor'}
            </h2>
            
            {/* Global Search Bar */}
            <div className="relative flex-1 max-w-md hidden md:block group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
                placeholder="Search patients, procedures, or charts..."
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                <div className="text-xs text-slate-500">{user.role.replace('_', ' ')}</div>
              </div>
              <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden flex items-center justify-center text-slate-500 border border-slate-300">
                {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" /> : <UserIcon className="w-4 h-4" />}
              </div>
            </div>
          </div>
        </header>

        {/* Notifications Popover */}
        {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
