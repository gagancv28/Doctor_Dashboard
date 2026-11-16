import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'full'>('mobile');

  return (
    <div className="min-h-screen bg-[#EAE7DE] flex flex-col items-center justify-start sm:py-6 sm:px-4 selection:bg-[#0D5C3A] selection:text-white font-sans">
      {/* Top Device Preview Bar (Visible on Desktop / Tablet for Hackathon Presentations) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-4xl mb-3 px-4 py-1.5 bg-[#FAF9F6] border border-[#DDD9CE] rounded text-xs font-mono text-[#5E5B54]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0D5C3A]" />
          <span className="font-semibold text-[#111111]">SIH26047</span>
          <span className="text-[#8A867C]">•</span>
          <span>CodeScribe Health (Mobile-First Longitudinal Health History)</span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#EAE7DE] p-0.5 rounded border border-[#DDD9CE]">
          <button
            onClick={() => setDeviceView('mobile')}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] transition-colors ${
              deviceView === 'mobile' ? 'bg-white text-[#111111] font-bold shadow-xs' : 'text-[#5E5B54]'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>Mobile (390px)</span>
          </button>
          <button
            onClick={() => setDeviceView('tablet')}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] transition-colors ${
              deviceView === 'tablet' ? 'bg-white text-[#111111] font-bold shadow-xs' : 'text-[#5E5B54]'
            }`}
          >
            <Tablet className="w-3 h-3" />
            <span>Tablet (640px)</span>
          </button>
          <button
            onClick={() => setDeviceView('full')}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] transition-colors ${
              deviceView === 'full' ? 'bg-white text-[#111111] font-bold shadow-xs' : 'text-[#5E5B54]'
            }`}
          >
            <Monitor className="w-3 h-3" />
            <span>Full Width</span>
          </button>
        </div>
      </div>

      {/* Main App Canvas Container */}
      <div
        className={`w-full bg-[#F5F3EE] flex flex-col transition-all duration-300 ${
          deviceView === 'mobile'
            ? 'sm:max-w-[400px] sm:min-h-[844px] sm:max-h-[900px] sm:rounded-2xl sm:shadow-2xl sm:border sm:border-[#D5D1C6] overflow-hidden'
            : deviceView === 'tablet'
            ? 'sm:max-w-2xl sm:min-h-[860px] sm:rounded-xl sm:shadow-xl sm:border sm:border-[#D5D1C6] overflow-hidden'
            : 'max-w-5xl min-h-screen sm:rounded-md'
        }`}
        style={{ minHeight: '100svh' }}
      >
        {children}
      </div>

      {/* Understated bottom badge */}
      <div className="hidden sm:flex items-center gap-4 mt-3 text-[11px] font-mono text-[#8A867C]">
        <span>ABDM Sandbox Prototype</span>
        <span>•</span>
        <span>FHIR R4 Compliant</span>
        <span>•</span>
        <span>Patient-Controlled Health Record (PHR)</span>
      </div>
    </div>
  );
};
