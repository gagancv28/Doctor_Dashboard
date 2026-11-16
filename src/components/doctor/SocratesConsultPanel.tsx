import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Volume2,
  Edit3,
  Save,
  Globe,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import type { SocratesCase, AbhaProfile } from '../../types/socrates';

interface SocratesConsultPanelProps {
  socratesCase: SocratesCase;
  profile: AbhaProfile;
  onUpdateCase: (updated: Partial<SocratesCase>) => void;
  onApproveAndPrescribe: () => void;
}

export const SocratesConsultPanel: React.FC<SocratesConsultPanelProps> = ({
  socratesCase,
  profile,
  onUpdateCase,
  onApproveAndPrescribe,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedSeverity, setEditedSeverity] = useState<number>(socratesCase.severity);
  const [editedNotes, setEditedNotes] = useState<string>(socratesCase.doctorNotes || '');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);

  const handleSaveEdits = () => {
    onUpdateCase({
      severity: editedSeverity,
      doctorNotes: editedNotes,
    });
    setIsEditing(false);
  };

  const handleApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      onApproveAndPrescribe();
    }, 600);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header with status */}
      <div className="flex items-center justify-between border-b border-[#E2DFD8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#0B4F8A] font-semibold uppercase tracking-wider">
              Current Consult
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B4F8A]" />
            <span className="font-mono text-xs text-[#7A766C]">OPD Token #0247</span>
          </div>
          <h2 className="text-xl font-bold text-[#111111] tracking-tight mt-0.5">
            {socratesCase.chiefComplaint}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {socratesCase.doctorVerified ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Signed & Stamped</span>
            </span>
          ) : (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1.5 rounded-lg text-[#5E5B54] hover:text-[#111111] hover:bg-[#EAE7DE] border border-transparent hover:border-[#DDD9CE] transition-all text-xs flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel' : 'Edit'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Multilingual Voice Intake Accordion / Card */}
      <div className="bg-[#F5F4EF] p-4 rounded-xl border border-[#E2DFD8] space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#5E5B54]">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#0B4F8A]" />
            <span className="font-semibold text-[#111111]">Kannada Spoken Intake</span>
            <span>(Raw ASR transcript)</span>
          </div>
          <button
            onClick={() => {
              setIsPlayingAudio(true);
              setTimeout(() => setIsPlayingAudio(false), 2000);
            }}
            className="flex items-center gap-1 text-[#0B4F8A] hover:underline font-semibold"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
            <span>{isPlayingAudio ? 'Playing...' : 'Play Audio'}</span>
          </button>
        </div>

        <p className="text-xs text-[#2A2A26] font-medium leading-relaxed italic">
          "{socratesCase.rawTranscript}"
        </p>

        <div className="pt-1.5 border-t border-[#E2DFD8]/60 flex items-center gap-1.5 text-[11px] text-[#0B4F8A]">
          <Sparkles className="w-3 h-3" />
          <span className="font-medium">Translated HPI:</span>
          <span className="text-[#333333] font-normal truncate">{socratesCase.translatedTranscript}</span>
        </div>
      </div>

      {/* Structured SOCRATES Clinical Matrix (Tight kerning, comfortable clinical line height) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-[#8A867C] font-semibold uppercase tracking-wider">
            SOCRATES Pain Matrix
          </span>
          <span className="font-mono text-[11px] text-[#0B4F8A] font-semibold">Instantly Structured</span>
        </div>

        <div className="bg-white border border-[#E2DFD8] rounded-xl divide-y divide-[#EAE7DE] shadow-xs text-xs">
          {/* Site */}
          <div className="p-3 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <div className="w-24 font-mono font-bold text-[#0B4F8A]">Site (S)</div>
            <div className="flex-1 text-[#111111] font-medium">{socratesCase.site}</div>
          </div>

          {/* Onset */}
          <div className="p-3 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <div className="w-24 font-mono font-bold text-[#0B4F8A]">Onset (O)</div>
            <div className="flex-1 text-[#111111] font-medium">{socratesCase.onset}</div>
          </div>

          {/* Character */}
          <div className="p-3 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <div className="w-24 font-mono font-bold text-[#0B4F8A]">Character (C)</div>
            <div className="flex-1 text-[#111111] font-medium">{socratesCase.character}</div>
          </div>

          {/* Radiation */}
          <div className="p-3 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <div className="w-24 font-mono font-bold text-[#0B4F8A]">Radiation (R)</div>
            <div className="flex-1 text-[#111111] font-medium">{socratesCase.radiation}</div>
          </div>

          {/* Associations */}
          <div className="p-3 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <div className="w-24 font-mono font-bold text-[#0B4F8A]">Associations (A)</div>
            <div className="flex-1 text-[#111111] font-medium flex flex-wrap gap-1.5">
              {socratesCase.associations.map((item, i) => (
                <span key={i} className="px-2 py-0.5 bg-[#F9F9F6] border border-[#E2DFD8] rounded-md text-[11px]">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Time Course */}
          <div className="p-3 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <div className="w-24 font-mono font-bold text-[#0B4F8A]">Time Course (T)</div>
            <div className="flex-1 text-[#111111] font-medium">{socratesCase.timeCourse}</div>
          </div>

          {/* Exacerbating / Relieving */}
          <div className="p-3 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <div className="w-24 font-mono font-bold text-[#0B4F8A]">Exacerbating (E)</div>
            <div className="flex-1 text-[#111111] font-medium">{socratesCase.exacerbatingRelieving}</div>
          </div>

          {/* Severity */}
          <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="w-24 font-mono font-bold text-[#0B4F8A]">Severity (S)</div>
            <div className="flex-1 flex items-center justify-between">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={editedSeverity}
                    onChange={(e) => setEditedSeverity(Number(e.target.value))}
                    className="w-32 accent-[#0B4F8A]"
                  />
                  <span className="font-bold text-[#0B4F8A]">{editedSeverity}/10</span>
                </div>
              ) : (
                <span className="font-bold text-[#0B4F8A] bg-[#EEF4F9] px-2.5 py-0.5 rounded border border-[#0B4F8A]/20">
                  {socratesCase.severity} / 10 (Disruptive Pain)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Clinical Notes */}
      <div className="space-y-2">
        <label className="font-mono text-[11px] text-[#8A867C] font-semibold uppercase tracking-wider block">
          Clinical Impression & Plan
        </label>
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              placeholder="Enter clinical assessment, differential diagnosis, and prescription plan..."
              className="w-full h-24 p-3 text-xs bg-white border border-[#0B4F8A] rounded-xl focus:outline-none"
            />
            <button
              onClick={handleSaveEdits}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B4F8A] text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Clinical Notes</span>
            </button>
          </div>
        ) : (
          <div className="p-3 bg-white border border-[#E2DFD8] rounded-xl text-xs text-[#2A2A26] font-medium leading-relaxed">
            {socratesCase.doctorNotes || (
              <span className="text-[#8A867C] italic">
                Clinical assessment ready. Tap 'Approve & Sign Clinical Record' to publish to ABHA.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Approval CTA */}
      <div className="mt-auto pt-4 border-t border-[#E2DFD8]">
        <button
          onClick={handleApprove}
          disabled={isApproving}
          className="w-full py-3.5 bg-[#0B4F8A] hover:bg-[#093D6B] text-[#F9F9F6] text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          {isApproving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#F9F9F6]" />
              <span>Generating FHIR Bundle & Stamping ABHA Record...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Approve & Sign Clinical Record ({profile.name})</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
