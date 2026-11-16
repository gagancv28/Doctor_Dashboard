import React from 'react';
import {
  AlertTriangle,
  QrCode,
  HeartPulse,
} from 'lucide-react';
import type { HealthIdentity } from '../../types/health';

interface ProfileScreenProps {
  identity: HealthIdentity;
  onOpenAbha: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  identity,
  onOpenAbha,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <span className="font-mono text-xs text-[#0D5C3A] font-semibold uppercase tracking-wider block">
            Health Identity Profile
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
            Patient #0247
          </h1>
          <p className="text-xs text-[#5E5B54] mt-0.5">
            Verified National Ayushman Bharat Digital Mission (ABDM) Identity.
          </p>
        </div>

        <button
          onClick={onOpenAbha}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2DFD8] hover:border-[#111111] rounded-xl text-xs font-semibold text-[#111111] transition-colors shadow-xs self-start"
        >
          <QrCode className="w-4 h-4 text-[#0D5C3A]" />
          <span>Manage ABHA</span>
        </button>
      </div>

      {/* DIGITAL ABHA CARD PREVIEW */}
      <div className="bg-gradient-to-br from-[#111111] via-[#1E293B] to-[#0D5C3A] text-white p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm tracking-tight">ABHA Digital Health Card</span>
          </div>
          <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded font-semibold">
            ABDM Sandbox Verified
          </span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <div className="font-mono text-xs text-emerald-200">ABHA Address</div>
            <div className="text-lg sm:text-xl font-bold font-mono tracking-tight text-white">
              {identity.abhaAddress}
            </div>
            <div className="font-mono text-xs text-gray-300">
              ABHA ID: {identity.abhaId}
            </div>
          </div>

          <div className="w-16 h-16 bg-white p-1.5 rounded-xl shrink-0 flex items-center justify-center">
            <QrCode className="w-12 h-12 text-black" />
          </div>
        </div>

        <div className="pt-3 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div>
            <span className="text-gray-400 block text-[10px]">Name</span>
            <span className="font-bold text-white">{identity.name}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">Age / Sex</span>
            <span className="font-bold text-white">{identity.age} Yrs / {identity.sex}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">Blood Group</span>
            <span className="font-bold text-emerald-300">{identity.bloodGroup}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">State</span>
            <span className="font-bold text-white">{identity.state}</span>
          </div>
        </div>
      </div>

      {/* CLINICAL SAFETY & DEMOGRAPHICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Critical Safety Info */}
        <div className="p-5 bg-white border border-[#E2DFD8] rounded-2xl space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111111]">
              Critical Medical & Safety Profile
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <span className="font-mono text-[10px] uppercase text-amber-900 font-bold block">
                Known Drug Allergy (Alert)
              </span>
              <div className="font-bold text-amber-950">Penicillin (Beta-lactam antibiotics)</div>
              <p className="text-[11px] text-amber-900">
                Reaction: Generalized urticaria & facial swelling. Avoid Amoxicillin & Ampicillin.
              </p>
            </div>

            <div className="p-3 bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl space-y-1">
              <span className="font-mono text-[10px] uppercase text-[#8A867C] font-semibold block">
                Ayush / Ayurveda Prakriti Profile
              </span>
              <div className="font-bold text-[#111111]">Vata-Pitta Prakriti</div>
              <p className="text-[11px] text-[#5E5B54]">
                Predisposition to stress-induced Ardhavabhedaka (unilateral cephalalgia).
              </p>
            </div>
          </div>
        </div>

        {/* Contact & Emergency Details */}
        <div className="p-5 bg-white border border-[#E2DFD8] rounded-2xl space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111111]">
              Contact & Emergency Information
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl flex items-center justify-between">
              <span className="text-[#8A867C]">Phone Number:</span>
              <span className="font-mono font-bold text-[#111111]">{identity.phone}</span>
            </div>

            <div className="p-3 bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl flex items-center justify-between">
              <span className="text-[#8A867C]">Emergency Contact:</span>
              <span className="font-bold text-[#111111]">{identity.emergencyContact}</span>
            </div>

            <div className="p-3 bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl flex items-center justify-between">
              <span className="text-[#8A867C]">Residential Address:</span>
              <span className="text-right text-[#111111] max-w-[200px] truncate">{identity.address}</span>
            </div>

            <div className="p-3 bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl flex items-center justify-between">
              <span className="text-[#8A867C]">District & PIN:</span>
              <span className="font-mono font-bold text-[#111111]">Hassan, {identity.pincode}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
