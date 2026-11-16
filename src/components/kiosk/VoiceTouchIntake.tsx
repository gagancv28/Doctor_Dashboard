import React, { useState, useEffect } from 'react';
import { Mic, Globe, Sparkles, ArrowRight, Keyboard } from 'lucide-react';
import type { SocratesCase } from '../../types/socrates';

interface VoiceTouchIntakeProps {
  socratesCase: SocratesCase;
  onFinishVoice: () => void;
  onSelectLanguage: (lang: string) => void;
}

export const VoiceTouchIntake: React.FC<VoiceTouchIntakeProps> = ({
  socratesCase,
  onFinishVoice,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [displayedTranscript, setDisplayedTranscript] = useState<string>('');
  const [isTypingMode, setIsTypingMode] = useState<boolean>(false);
  const [typedText, setTypedText] = useState<string>('');

  // Streaming speech transcript effect (Kannada)
  useEffect(() => {
    if (!isRecording || isTypingMode) return;
    const words = socratesCase.rawTranscript.split(' ');
    let idx = 0;
    setDisplayedTranscript('');

    const streamer = setInterval(() => {
      if (idx < words.length) {
        setDisplayedTranscript((prev) => (prev ? prev + ' ' + words[idx] : words[idx]));
        idx++;
      } else {
        clearInterval(streamer);
      }
    }, 400);

    return () => clearInterval(streamer);
  }, [isRecording, isTypingMode, socratesCase.rawTranscript]);

  return (
    <div className="flex-1 flex flex-col justify-between max-w-3xl mx-auto w-full p-6 sm:p-10">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-[#E2DFD8] pb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#0B4F8A]" />
          <span className="font-mono text-xs text-[#0B4F8A] font-semibold uppercase tracking-wider">
            Kannada (ಕನ್ನಡ) Voice Stream • Live NLP Translation
          </span>
        </div>
        <button
          onClick={() => setIsTypingMode(!isTypingMode)}
          className="flex items-center gap-1.5 text-xs text-[#5E5B54] hover:text-[#111111] bg-[#F5F4EF] hover:bg-[#EAE7DE] px-3 py-1.5 rounded-lg border border-[#E2DFD8] transition-colors"
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span>{isTypingMode ? 'Switch to Voice Mode' : 'Switch to Touch/Type'}</span>
        </button>
      </div>

      {/* Main Center Stage */}
      <div className="my-auto py-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#111111] leading-tight">
            {isTypingMode
              ? 'Type what brings you to the hospital today'
              : 'Describe your symptoms in your own words'}
          </h1>
          <p className="text-sm text-[#5E5B54]">
            Speak naturally in Kannada. Our clinical engine listens, translates, and structures your chief complaint into SOCRATES format.
          </p>
        </div>

        {/* Dual Mode UI: Voice Live Visualizer or Touch Keyboard Area */}
        {!isTypingMode ? (
          <div className="space-y-4">
            {/* Audio Waveform & Mic Circle */}
            <div className="p-8 bg-white border border-[#E2DFD8] rounded-2xl shadow-sm text-center space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isRecording
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 scale-105 animate-pulse'
                      : 'bg-[#111111] text-[#F9F9F6] shadow-md hover:bg-[#222222]'
                  }`}
                >
                  <Mic className="w-8 h-8" />
                </button>
              </div>

              {/* Dynamic Waveform Visualizer */}
              <div className="flex items-center justify-center gap-1.5 h-8">
                {[40, 75, 95, 60, 30, 85, 100, 70, 45, 90, 60, 35, 80, 50, 65, 40].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isRecording ? 'bg-[#0B4F8A]' : 'bg-[#DDD9CE]'
                    }`}
                    style={{
                      height: isRecording ? `${Math.max(15, (h * Math.sin(i + 1) + 100) % 100)}%` : '20%',
                    }}
                  />
                ))}
              </div>

              <span className="font-mono text-[11px] text-[#8A867C] block">
                {isRecording ? 'Listening in real-time... (Tap mic to pause)' : 'Voice stream paused'}
              </span>
            </div>

            {/* Live Streaming Spoken Kannada Box */}
            <div className="p-5 bg-white border border-[#E2DFD8] rounded-2xl shadow-sm space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8A867C]">
                <span>PATIENT VOICE STREAM (KANNADA)</span>
                <span className="text-emerald-700 font-semibold">99.4% ASR Accuracy</span>
              </div>
              <p className="text-base font-medium text-[#111111] font-sans leading-relaxed min-h-[3rem]">
                {displayedTranscript || <span className="text-[#A39F93] italic">Listening for speech...</span>}
              </p>
            </div>

            {/* Simultaneous English Clinical Translation */}
            <div className="p-4 bg-[#EEF4F9] border border-[#0B4F8A]/20 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#0B4F8A] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>REAL-TIME CLINICAL NLP TRANSLATION (ENGLISH)</span>
              </div>
              <p className="text-xs sm:text-sm text-[#0B4F8A] font-medium leading-relaxed">
                "{socratesCase.translatedTranscript}"
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-white border border-[#E2DFD8] rounded-2xl shadow-sm">
              <textarea
                value={typedText || socratesCase.translatedTranscript}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder="Type your symptoms here in English or Kannada..."
                className="w-full h-36 p-2 text-sm text-[#111111] bg-transparent resize-none focus:outline-none placeholder:text-[#A39F93]"
              />
            </div>
            <div className="p-4 bg-[#F5F4EF] border border-[#E2DFD8] rounded-xl text-xs text-[#5E5B54]">
              Tip: You can describe your pain location, how severe it is on a scale of 1-10, and if it spreads to your head, neck, or shoulders.
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-6 border-t border-[#E2DFD8] flex justify-end">
        <button
          onClick={onFinishVoice}
          className="w-full sm:w-auto px-6 py-3 bg-[#0B4F8A] hover:bg-[#093D6B] text-[#F9F9F6] text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>Answer Focused Clinical Questions</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
