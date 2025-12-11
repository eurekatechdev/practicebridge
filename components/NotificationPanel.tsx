
import React from 'react';
import { MOCK_NOTIFICATIONS } from '../constants';
import { MessageSquare, BrainCircuit, Server, AlertTriangle, X } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'message': return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'insight': return <BrainCircuit className="w-5 h-5 text-purple-500" />;
      case 'system': return <Server className="w-5 h-5 text-red-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="absolute top-16 right-8 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800">System Notifications</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <div 
            key={notif.id} 
            className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}
          >
            <div className="flex gap-3">
              <div className="mt-1 flex-shrink-0">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-semibold text-slate-800">{notif.title}</h4>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{notif.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {notif.description}
                </p>
                {notif.actionLabel && (
                  <button className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline">
                    {notif.actionLabel} &rarr;
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 text-center bg-slate-50 border-t border-slate-100">
        <button className="text-xs text-slate-500 hover:text-slate-800 font-medium">Mark all as read</button>
      </div>
    </div>
  );
};

export default NotificationPanel;
