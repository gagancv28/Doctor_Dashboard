import React, { useState } from 'react';
import {
  Home,
  Clock,
  MessageSquare,
  FileText,
  User,
  Smartphone,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import type {
  HealthIdentity,
  HealthRecord,
  MedicationItem,
  VaultDocument,
  ConsentGrant,
  AccessAuditLog,
  ActiveConsultation,
  TabType,
} from '../../types/health';

// Patient App Screen Components
import { WelcomeScreen } from './screens/WelcomeScreen';
import { ConnectAbhaScreen } from './screens/ConnectAbhaScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { HealthTimelineScreen } from '../screens/HealthTimelineScreen';
import { MedicationVaultScreen } from '../screens/MedicationVaultScreen';
import { DocumentVaultScreen } from '../screens/DocumentVaultScreen';
import { ConsentSharingScreen } from '../screens/ConsentSharingScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ConsultFlowScreens } from '../screens/ConsultFlowScreens';

interface PatientAppMobileProps {
  identity: HealthIdentity;
  timeline: HealthRecord[];
  medications: MedicationItem[];
  documents: VaultDocument[];
  consent: ConsentGrant;
  accessLogs: AccessAuditLog[];
  consultCase: ActiveConsultation;
  onUpdateConsultCase: (updated: ActiveConsultation) => void;
  onOpenRecord: (record: HealthRecord) => void;
  onAddDocument: (doc: VaultDocument) => void;
  onUpdateConsent: (updated: ConsentGrant) => void;
  onProceedToDoctor: () => void;
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const PatientAppMobile: React.FC<PatientAppMobileProps> = ({
  identity,
  timeline,
  medications,
  documents,
  consent,
  accessLogs,
  consultCase,
  onUpdateConsultCase,
  onOpenRecord,
  onAddDocument,
  onUpdateConsent,
  onProceedToDoctor,
  activeTab,
  onSelectTab,
}) => {
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [showConnectAbha, setShowConnectAbha] = useState<boolean>(false);
  const [isFrameView, setIsFrameView] = useState<boolean>(true);

  // Bottom Navigation Items (Prompt Requirement: Home | History | Consult | Documents | Profile)
  const navItems: Array<{ id: TabType; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'health', label: 'History', icon: <Clock className="w-5 h-5" />, badge: '8' },
    { id: 'consult', label: 'Consult', icon: <MessageSquare className="w-5 h-5" />, badge: 'AI' },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="flex-1 bg-[#FAF9F6] sm:bg-[#EAE7DE] flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto w-full">
      {/* Viewport Scale / Frame Controls (Discreet Desktop Tool) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[420px] pb-2 text-xs text-[#5E5B54]">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#0D5C3A]">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Patient Mobile App (390 × 844)</span>
        </div>

        <button
          onClick={() => setIsFrameView(!isFrameView)}
          className="flex items-center gap-1 hover:text-[#111111] transition-colors font-mono text-[10px]"
        >
          {isFrameView ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          <span>{isFrameView ? 'Expand Full' : 'Phone Frame'}</span>
        </button>
      </div>

      {/* Main 390 × 844 Phone Container (Full screen on mobile) */}
      <div
        className={`w-full bg-[#FAF9F6] text-[#111111] flex flex-col justify-between overflow-hidden shadow-none sm:shadow-2xl transition-all relative min-h-screen sm:min-h-0 ${
          isFrameView
            ? 'sm:max-w-[390px] sm:h-[844px] sm:rounded-[44px] sm:border-[10px] sm:border-[#1E293B] sm:ring-1 sm:ring-black/10'
            : 'max-w-4xl sm:min-h-[844px] sm:rounded-2xl sm:border sm:border-[#E2DFD8]'
        }`}
      >
        {/* iPhone Dynamic Island / Speaker Pill & Status Bar */}
        <div className="w-full bg-[#FAF9F6] px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold select-none z-20 shrink-0">
          <span className="font-mono text-[11px]">9:41</span>
          {/* Dynamic Island pill */}
          <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 mr-1.5 animate-pulse" />
            <span className="text-[9px] font-mono text-white/90">ABDM Node</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* SCREEN CONTENT AREA */}
        <div className="flex-1 flex flex-col overflow-y-auto relative no-scrollbar">
          {showWelcome ? (
            <WelcomeScreen
              onGetStarted={() => {
                setShowWelcome(false);
                setShowConnectAbha(true);
              }}
              onAlreadyHaveAbha={() => {
                setShowWelcome(false);
                setShowConnectAbha(true);
              }}
              onNewPatient={() => {
                setShowWelcome(false);
                onSelectTab('consult');
              }}
            />
          ) : showConnectAbha ? (
            <ConnectAbhaScreen
              identity={identity}
              onConsentComplete={() => {
                setShowConnectAbha(false);
                onSelectTab('health');
              }}
              onBack={() => setShowConnectAbha(false)}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeScreen
                  identity={identity}
                  timeline={timeline}
                  medications={medications}
                  documents={documents}
                  onSelectTab={onSelectTab}
                  onOpenRecord={onOpenRecord}
                  onStartConsultation={() => onSelectTab('consult')}
                />
              )}

              {activeTab === 'health' && (
                <HealthTimelineScreen
                  timeline={timeline}
                  onOpenRecord={onOpenRecord}
                  onOpenConsentSharing={() => onSelectTab('consent')}
                  onStartConsultation={() => onSelectTab('consult')}
                />
              )}

              {activeTab === 'consult' && (
                <ConsultFlowScreens
                  consultCase={consultCase}
                  onUpdateCase={onUpdateConsultCase}
                  onProceedToDoctor={onProceedToDoctor}
                  onCancel={() => onSelectTab('home')}
                />
              )}

              {activeTab === 'documents' && (
                <DocumentVaultScreen
                  documents={documents}
                  onAddDocument={onAddDocument}
                />
              )}

              {activeTab === 'medications' && (
                <MedicationVaultScreen
                  medications={medications}
                  onStartConsultation={() => onSelectTab('consult')}
                />
              )}

              {activeTab === 'consent' && (
                <ConsentSharingScreen
                  consent={consent}
                  accessLogs={accessLogs}
                  onUpdateConsent={onUpdateConsent}
                />
              )}

              {activeTab === 'abha' && (
                <ConnectAbhaScreen
                  identity={identity}
                  onConsentComplete={() => onSelectTab('health')}
                  onBack={() => onSelectTab('home')}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileScreen
                  identity={identity}
                  onOpenAbha={() => onSelectTab('abha')}
                />
              )}
            </>
          )}
        </div>

        {/* BOTTOM NAVIGATION BAR (Prompt Requirement: Home | History | Consult | Documents | Profile) */}
        {!showWelcome && !showConnectAbha && (
          <nav className="w-full bg-[#FAF9F6] border-t border-[#E2DFD8] py-2 px-3 z-30 flex items-center justify-around shrink-0 select-none">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                    isActive
                      ? 'text-[#0D5C3A] font-bold scale-105'
                      : 'text-[#8A867C] hover:text-[#111111]'
                  }`}
                >
                  <div className={`p-1 rounded-lg ${isActive ? 'bg-[#EBF4EE]' : ''}`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] mt-0.5">{item.label}</span>
                  {item.badge && !isActive && (
                    <span className="absolute top-1 right-2 font-mono text-[8px] bg-[#EBF4EE] text-[#0D5C3A] px-1 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* iPhone Bottom Home Indicator Bar */}
        <div className="w-full bg-[#FAF9F6] flex justify-center pb-2 pt-0.5 z-20 shrink-0">
          <div className="w-32 h-1 bg-[#111111]/20 rounded-full" />
        </div>
      </div>
    </div>
  );
};
