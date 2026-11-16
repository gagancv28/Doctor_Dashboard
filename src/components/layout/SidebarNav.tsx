import React from 'react';
import {
  Home,
  Clock,
  MessageSquare,
  FileText,
  Pill,
  Share2,
  QrCode,
  User,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { TabType, HealthIdentity } from '../../types/health';

interface SidebarNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  identity: HealthIdentity;
  unreadCount?: number;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onSelectTab,
  identity,
}) => {
  const navItems: Array<{ id: TabType; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'health', label: 'Health History', icon: <Clock className="w-4 h-4" />, badge: '8' },
    { id: 'consult', label: 'Consultations', icon: <MessageSquare className="w-4 h-4" />, badge: 'AI' },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" />, badge: '14' },
    { id: 'medications', label: 'Medications', icon: <Pill className="w-4 h-4" />, badge: '2 Active' },
    { id: 'consent', label: 'Share & Consent', icon: <Share2 className="w-4 h-4" />, badge: '1 Active' },
    { id: 'abha', label: 'ABHA', icon: <QrCode className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-[#FAF9F6] border-r border-[#E2DFD8] flex flex-col justify-between p-4 shrink-0 hidden md:flex min-h-[calc(100vh-60px)]">
      <div className="space-y-6">
        {/* Patient Identity Mini-Card */}
        <div className="p-3.5 bg-white border border-[#E2DFD8] rounded-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase text-[#8A867C] font-semibold">
              Health Identity
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[9px] text-[#0D5C3A] bg-[#EBF4EE] px-1.5 py-0.5 rounded font-bold">
              <ShieldCheck className="w-2.5 h-2.5" /> ABDM Linked
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#EBF4EE] border border-[#0D5C3A]/20 flex items-center justify-center font-bold text-xs text-[#0D5C3A]">
              LG
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-[#111111] truncate">{identity.name}</div>
              <div className="text-[10px] text-[#5E5B54] font-mono truncate">{identity.abhaAddress}</div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          <div className="px-2 pb-1.5 font-mono text-[10px] uppercase tracking-wider text-[#8A867C] font-semibold">
            Patient Portal
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'text-[#5E5B54] hover:text-[#111111] hover:bg-[#EAE7DE]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-emerald-400' : 'text-[#8A867C]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`font-mono text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badge === 'AI'
                        ? 'bg-[#EBF4EE] text-[#0D5C3A]'
                        : 'bg-[#EAE7DE] text-[#5E5B54]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Hackathon problem statement info */}
      <div className="pt-4 border-t border-[#E2DFD8] space-y-2">
        <div className="p-3 bg-[#EBF4EE] border border-[#0D5C3A]/20 rounded-xl text-[11px] text-[#0D5C3A] space-y-1">
          <div className="font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> SIH26047 Prototype
          </div>
          <p className="text-[10px] text-[#111111]/80 leading-tight">
            Patient Case-Taking Software for Ministry of Ayush.
          </p>
        </div>
        <div className="text-[10px] text-[#8A867C] text-center font-mono">
          CodeScribe Health v2.4 • ABDM Sandbox
        </div>
      </div>
    </aside>
  );
};
