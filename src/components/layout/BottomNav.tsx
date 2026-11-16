import React from 'react';
import { Home, Clock, MessageSquare, FileText, User } from 'lucide-react';
import type { TabType } from '../../types/health';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const items: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'health', label: 'History', icon: <Clock className="w-5 h-5" /> },
    { id: 'consult', label: 'Consult', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#FAF9F6] border-t border-[#E2DFD8] py-1.5 px-3 z-30 flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              isActive
                ? 'text-[#0D5C3A] font-bold scale-105'
                : 'text-[#8A867C] hover:text-[#111111]'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-[#EBF4EE]' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
