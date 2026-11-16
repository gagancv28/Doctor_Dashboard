import React, { useState, useEffect } from 'react';
import type { SupportedLanguage } from '../../types/clinical';
import { Square, Keyboard, Sparkles, Mic } from 'lucide-react';

interface VoiceIntakeProps {
  selectedLanguage: SupportedLanguage;
  onFinishVoice: (transcript: string, isTyped?: boolean) => void;
  onSwitchToTyping?: () => void;
}

export const VoiceIntake: React.FC<VoiceIntakeProps> = ({
  selectedLanguage,
  onFinishVoice,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [displayedTranscript, setDisplayedTranscript] = useState<string>('');
  const [isTypingMode, setIsTypingMode] = useState<boolean>(false);
  const [typedInput, setTypedInput] = useState<string>('');
  const [audioLevelBars, setAudioLevelBars] = useState<number[]>([12, 24, 18, 32, 14, 28, 22, 38, 16, 20]);

  // Target transcript based on selected language
  const targetSpeech = selectedLanguage.samplePhrase;
  const translatedMeaning = selectedLanguage.translatedPhrase;

  // Recording timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRecording && !isTypingMode) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording, isTypingMode]);

  // Dynamic audio level simulation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording && !isTypingMode) {
      interval = setInterval(() => {
        setAudioLevelBars(
          Array.from({ length: 14 }, () => Math.floor(Math.random() * 32) + 6)
        );
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isRecording, isTypingMode]);

  // Word-by-word simulated streaming recognition
  useEffect(() => {
    if (!isRecording || isTypingMode) return;

    let currentIndex = 0;
    const words = targetSpeech.split(' ');
    setDisplayedTranscript('');

    const speechStreamer = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayedTranscript((prev) => (prev ? prev + ' ' + words[currentIndex] : words[currentIndex]));
        currentIndex++;
      } else {
        clearInterval(speechStreamer);
      }
    }, 450);

    return () => clearInterval(speechStreamer);
  }, [isRecording, isTypingMode, targetSpeech]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleFinish = () => {
    const finalTranscript = isTypingMode ? typedInput || targetSpeech : displayedTranscript || targetSpeech;
    onFinishVoice(finalTranscript, isTypingMode);
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full">
      {/* Top Progress & Context */}
      <div className="flex items-center justify-between border-b border-[#E2DFD8] pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-[#111111]">PATIENT HISTORY</span>
          <span className="font-mono text-xs text-[#8A867C]">01 / 04</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-[#5E5B54]">
          <span className="w-2 h-2 rounded-full bg-[#0D5C3A]" />
          <span>Language: {selectedLanguage.name} ({selectedLanguage.nativeName})</span>
        </div>
      </div>

      {/* Hero Question */}
      <div className="my-auto py-6 space-y-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#0D5C3A] font-medium">
            Chief Complaint
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#111111] mt-1 leading-tight">
            “What problem are you having today?”
          </h1>
          <p className="text-xs sm:text-sm text-[#5E5B54] mt-1">
            Speak naturally about your pain, when it started, and how it feels.
          </p>
        </div>

        {!isTypingMode ? (
          /* Voice Interaction Panel */
          <div className="bg-[#FAF9F6] border border-[#E2DFD8] rounded-md p-6 sm:p-8 space-y-6">
            {/* Live Recording Header & Audio Bars */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <span className="w-3 h-3 rounded-full bg-red-600 animate-ping absolute" />
                  <span className="w-3 h-3 rounded-full bg-red-600 relative" />
                </div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Listening…
                </span>
                <span className="font-mono text-xs text-[#5E5B54] bg-[#EAE7DE] px-2 py-0.5 rounded">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>

              {/* Audio Waveform Bars */}
              <div className="flex items-center gap-1 h-8 px-2">
                {audioLevelBars.map((height, i) => (
                  <div
                    key={i}
                    style={{ height: `${height}px` }}
                    className="w-1 bg-[#0D5C3A] rounded-full transition-all duration-100 ease-out opacity-80"
                  />
                ))}
              </div>
            </div>

            {/* Editorial Live Transcript (Native Script) */}
            <div className="min-h-[110px] p-5 bg-white border border-[#E2DFD8] rounded">
              <div className="text-xs font-mono text-[#8A867C] mb-2 flex items-center justify-between">
                <span>RECOGNIZED SPEECH ({selectedLanguage.nativeName})</span>
                <span className="text-[10px] text-[#0D5C3A] font-medium">Real-time ASR</span>
              </div>
              <p className="text-lg sm:text-xl font-medium text-[#111111] leading-relaxed">
                {displayedTranscript || (
                  <span className="text-[#A6A298] italic">Listening for speech in {selectedLanguage.name}...</span>
                )}
              </p>
            </div>

            {/* Live Normalized Medical Interpretation Hint */}
            <div className="p-3.5 bg-[#EBF4EE]/70 border border-[#0D5C3A]/20 rounded text-xs text-[#0D5C3A] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#0D5C3A]" />
              <div>
                <span className="font-mono font-semibold uppercase text-[10px] tracking-wider block">
                  Simultaneous Clinical Interpretation
                </span>
                <span className="text-[#111111]">{translatedMeaning}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Fallback Typing Panel */
          <div className="bg-[#FAF9F6] border border-[#E2DFD8] rounded-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#111111]">
                Type your symptoms ({selectedLanguage.name})
              </span>
              <button
                onClick={() => setIsTypingMode(false)}
                className="text-xs font-mono text-[#0D5C3A] hover:underline"
              >
                Switch to Voice
              </button>
            </div>
            <textarea
              rows={4}
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder={targetSpeech}
              className="w-full p-4 bg-white border border-[#E2DFD8] rounded text-base text-[#111111] focus:outline-none focus:border-[#0D5C3A] focus:ring-1 focus:ring-[#0D5C3A]"
            />
            <button
              onClick={() => setTypedInput(targetSpeech)}
              className="text-xs font-mono text-[#5E5B54] hover:text-[#111111] underline"
            >
              Fill with sample {selectedLanguage.name} text
            </button>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-[#E2DFD8] flex flex-col sm:flex-row items-center justify-between gap-4">
        {!isTypingMode ? (
          <button
            onClick={() => {
              setIsTypingMode(true);
              setIsRecording(false);
              setTypedInput(displayedTranscript || targetSpeech);
            }}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#5E5B54] hover:text-[#111111] order-2 sm:order-1 transition-colors"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>I’d rather type</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setIsTypingMode(false);
              setIsRecording(true);
            }}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#0D5C3A] order-2 sm:order-1"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Use voice instead</span>
          </button>
        )}

        <button
          onClick={handleFinish}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#111111] hover:bg-[#0D5C3A] text-[#F5F3EE] font-semibold text-sm rounded transition-colors order-1 sm:order-2 focus:outline-none focus:ring-2 focus:ring-[#0D5C3A]"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>Tap to finish answering</span>
        </button>
      </div>
    </div>
  );
};
