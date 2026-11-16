import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, Mic, Globe, ShieldCheck, Play, Pause, Check } from 'lucide-react';
import { audioService } from '../../services/audioService';

interface OriginalStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalTranscript: string;
  translatedTranscript: string;
  language: string;
  source: string;
  recordedAt?: string;
  statementId?: string;
}

export const OriginalStatementModal: React.FC<OriginalStatementModalProps> = ({
  isOpen,
  onClose,
  originalTranscript,
  translatedTranscript,
  language,
  source,
  recordedAt = '11 Sep 2026, 10:20 AM',
  statementId = 'stmt-lakshmi-01',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(12);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioUnavailable, setAudioUnavailable] = useState<boolean>(false);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (isOpen) {
      setIsPlaying(false);
      setPlaybackProgress(0);
      setAudioUnavailable(false);

      audioService
        .getPatientStatementAudio(statementId, language)
        .then((data) => {
          if (!isMounted) return;
          if (data && data.audioUrl) {
            setAudioUrl(data.audioUrl);
            setAudioDuration(data.durationSeconds);
          } else {
            setAudioUnavailable(true);
          }
        })
        .catch(() => {
          if (isMounted) setAudioUnavailable(true);
        });
    }

    return () => {
      isMounted = false;
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
    };
  }, [isOpen, statementId, language]);

  const handleTogglePlay = () => {
    if (audioUnavailable || !audioUrl) return;

    if (isPlaying) {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (!audioElementRef.current) {
        const audio = new Audio(audioUrl);
        audioElementRef.current = audio;

        audio.ontimeupdate = () => {
          if (audio.duration) {
            setPlaybackProgress((audio.currentTime / audio.duration) * 100);
          }
        };

        audio.onended = () => {
          setIsPlaying(false);
          setPlaybackProgress(0);
        };

        audio.onerror = () => {
          setIsPlaying(false);
          setAudioUnavailable(true);
        };
      }

      audioElementRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
          setAudioUnavailable(true);
        });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Original Patient Statement</h3>
              <p className="text-xs text-slate-400 font-mono">
                Source: {source} · Recorded {recordedAt}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh] bg-slate-50">
          {/* Real Audio Player Bar */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={handleTogglePlay}
                disabled={audioUnavailable}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0 ${
                  audioUnavailable
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                aria-label={isPlaying ? 'Pause Recording' : 'Play Recording'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                    Patient Voice Recording
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {audioUnavailable
                      ? 'Audio recording unavailable'
                      : `Duration: 0:${audioDuration < 10 ? '0' : ''}${audioDuration} · ${language}`}
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${playbackProgress}%` }}
                    className="h-full bg-blue-600 transition-all duration-100"
                  />
                </div>
              </div>
            </div>

            {/* Live Waveform Indicator */}
            <div className="hidden sm:flex items-center gap-1 h-6 shrink-0">
              {[40, 75, 90, 55, 100, 65, 80, 45, 90, 70, 85, 30, 60, 95, 40].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    isPlaying ? 'bg-blue-600 animate-pulse' : 'bg-slate-300'
                  }`}
                  style={{
                    height: `${isPlaying ? Math.max(25, (h * ((i % 3) + 1)) % 100) : h * 0.4}%`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Original Language Transcript */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                Original Language Transcript ({language})
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 font-semibold border border-cyan-200">
                Exact Patient Words · Untampered
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-sm text-slate-900 font-medium leading-relaxed">
              “{originalTranscript}”
            </div>
          </div>

          {/* Normalized English Translation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Normalized Translation (English)
              </span>
              <span className="text-[11px] text-slate-500">Medical-grade translation</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-sm text-slate-800 leading-relaxed">
              “{translatedTranscript}”
            </div>
          </div>

          {/* Clinical Integrity Notice */}
          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900">Clinical Audit Rule:</strong> The original patient
              statement is preserved in its verbatim form as entered via the Patient App
              voice-assist intake. AI-assisted clinical summaries are derived from this untampered
              source.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Check className="w-4 h-4" /> Close Statement
          </button>
        </div>
      </div>
    </div>
  );
};
