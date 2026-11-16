import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Volume2,
  Globe,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Edit3,
  Check,
  Loader2,
  HeartPulse,
  AlertCircle,
  Keyboard,
  Square,
  VolumeX,
} from 'lucide-react';
import type { ActiveConsultation } from '../../types/health';
import { INDIAN_LANGUAGES } from '../../mock/healthStore';
import {
  SpeechRecognitionSession,
  getLanguageSpeechCode,
  isSpeechRecognitionSupported,
  speakQuestion,
} from '../../services/speechService';

interface ConsultFlowScreensProps {
  consultCase: ActiveConsultation;
  onUpdateCase: (updated: ActiveConsultation) => void;
  onProceedToDoctor: () => void;
  onCancel: () => void;
}

export const ConsultFlowScreens: React.FC<ConsultFlowScreensProps> = ({
  consultCase,
  onUpdateCase,
  onProceedToDoctor,
  onCancel,
}) => {
  const [step, setStep] = useState<ActiveConsultation['step']>(consultCase.step || 'choice');
  const [selectedLang, setSelectedLang] = useState<string>(consultCase.language || 'Kannada');
  const [selectedLangCode, setSelectedLangCode] = useState<string>(consultCase.languageCode || 'kn');

  // Real Speech Recognition & Audio State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcriptText, setTranscriptText] = useState<string>(consultCase.rawTranscript || '');
  const [translatedText, setTranslatedText] = useState<string>(consultCase.translatedTranscript || '');
  const [isManualInput, setIsManualInput] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Active question index for structured questions flow
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [isAnsweringVoice, setIsAnsweringVoice] = useState<boolean>(false);

  // SOCRATES Answers state
  const [onset, setOnset] = useState<string>(consultCase.onset || 'Yesterday evening');
  const [location, setLocation] = useState<string>(consultCase.location || 'Right side of head');
  const [severity, setSeverity] = useState<number>(consultCase.severity || 7);
  const [triggers, setTriggers] = useState<string>(consultCase.triggers || 'Bright light, screen glare');
  const [nausea, setNausea] = useState<string>(consultCase.vomitingOrNausea || 'Mild nausea without vomiting');
  const prevEpisodes = consultCase.previousEpisodes || 'Yes — 3 previous headache visits recorded';
  const currentMeds = consultCase.currentMedicationsTaken || 'None taken yet for this acute episode';

  // AI structuring progress
  const [aiStructuringProgress, setAiStructuringProgress] = useState<number>(0);

  const speechSessionRef = useRef<SpeechRecognitionSession | null>(null);
  const stopAudioRef = useRef<(() => void) | null>(null);

  const activeLangObj =
    INDIAN_LANGUAGES.find((l) => l.name === selectedLang) || INDIAN_LANGUAGES[0];

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (speechSessionRef.current) {
        speechSessionRef.current.abort();
      }
      if (stopAudioRef.current) {
        stopAudioRef.current();
      }
    };
  }, []);

  const handleLanguageChange = (langName: string) => {
    const found = INDIAN_LANGUAGES.find((l) => l.name === langName);
    if (found) {
      setSelectedLang(found.name);
      setSelectedLangCode(found.id);
      setSpeechError(null);
      if (isListening && speechSessionRef.current) {
        speechSessionRef.current.stop();
      }
    }
  };

  // Start Real Speech Recognition
  const handleStartRealListening = () => {
    setSpeechError(null);
    const bcp47 = getLanguageSpeechCode(selectedLang);

    if (speechSessionRef.current) {
      speechSessionRef.current.abort();
    }

    const session = new SpeechRecognitionSession({
      languageCode: bcp47,
      onStart: () => {
        setIsListening(true);
        setSpeechError(null);
      },
      onResult: (text) => {
        setTranscriptText(text);
        // Generate real-time translation simulation based on input
        if (selectedLang === 'Kannada' || selectedLang === 'Hindi') {
          setTranslatedText(
            text.includes('ತಲೆನೋವು') || text.includes('सिरदर्द') || text.includes('headache')
              ? 'Headache since yesterday evening, pain concentrated on right temporal region, worsens significantly with bright light (photophobia).'
              : `Patient statement in ${selectedLang}: "${text}"`
          );
        } else {
          setTranslatedText(text);
        }
      },
      onError: (err) => {
        setIsListening(false);
        setSpeechError(err.message);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    speechSessionRef.current = session;
    const started = session.start(transcriptText);
    if (!started && !isSpeechRecognitionSupported()) {
      setSpeechError("Voice recognition isn't supported in this browser. Please use text input or Chrome/Edge.");
    }
  };

  const handleStopListening = () => {
    if (speechSessionRef.current) {
      speechSessionRef.current.stop();
    }
    setIsListening(false);
  };

  // Use Predefined Demo Kannada Response (Optional SIH Judge Demonstration)
  const handleUseDemoSpeech = () => {
    if (speechSessionRef.current) {
      speechSessionRef.current.abort();
    }
    setIsListening(false);
    setSpeechError(null);
    setTranscriptText('ನಿನ್ನೆ ಸಂಜೆ ಇಂದ ತಲೆನೋವು ಇದೆ. ಬಲಭಾಗದಲ್ಲಿ ಹೆಚ್ಚು ನೋವು ಇದೆ ಮತ್ತು ಬೆಳಕನ್ನು ನೋಡಿದಾಗ ಹೆಚ್ಚಾಗುತ್ತದೆ.');
    setTranslatedText('Headache since yesterday evening, pain concentrated on right side and worsens with bright light (photophobia).');
  };

  // Text-To-Speech (TTS): Speak question to patient
  const handleSpeakQuestion = (questionText: string, langName: string = selectedLang) => {
    if (isPlayingAudio && stopAudioRef.current) {
      stopAudioRef.current();
      setIsPlayingAudio(false);
      return;
    }

    const bcp47 = getLanguageSpeechCode(langName);
    setIsPlayingAudio(true);

    const stopFn = speakQuestion(
      questionText,
      bcp47,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
    stopAudioRef.current = stopFn;
  };

  const handleStartQuestions = () => {
    if (!transcriptText.trim()) {
      setTranscriptText('Headache on right side since yesterday evening.');
      setTranslatedText('Right unilateral headache with photophobia.');
    }
    setStep('structured-questions');
    setActiveQuestionIndex(0);
  };

  const handleFinishQuestions = () => {
    setStep('patient-review');
  };

  const handleStartAiStructuring = () => {
    setStep('ai-structuring');
    setAiStructuringProgress(1);

    const timer = setInterval(() => {
      setAiStructuringProgress((prev) => {
        if (prev < 5) return prev + 1;
        clearInterval(timer);
        setTimeout(() => {
          const updated: ActiveConsultation = {
            ...consultCase,
            language: selectedLang,
            languageCode: selectedLangCode,
            rawTranscript: transcriptText || 'ನಿನ್ನೆ ಸಂಜೆ ಇಂದ ತಲೆನೋವು ಇದೆ...',
            translatedTranscript: translatedText || 'Right-sided headache with photophobia',
            onset,
            location,
            severity,
            triggers,
            vomitingOrNausea: nausea,
            previousEpisodes: prevEpisodes,
            currentMedicationsTaken: currentMeds,
            step: 'doctor-review',
          };
          onUpdateCase(updated);
          onProceedToDoctor();
        }, 600);
        return prev;
      });
    }, 450);
  };

  const structuringItems = [
    'Patient vernacular speech transcribed & translated',
    'Clinical SOCRATES pain entities structured',
    'Longitudinal timeline & previous 8 visits matched',
    '3 previous headache records retrieved & cross-referenced',
    'Medication history & Penicillin allergy flag linked',
  ];

  // Questions for the SOCRATES flow
  const followUpQuestions = [
    {
      id: 'onset',
      title: 'When did this headache episode start?',
      nativeTitle: 'ಈ ತಲೆನೋವು ಯಾವಾಗ ಪ್ರಾರಂಭವಾಯಿತು?',
      options: ['Yesterday evening', '2 days ago', '1 week ago'],
      selected: onset,
      setter: setOnset,
    },
    {
      id: 'location',
      title: 'Where exactly is the pain concentrated?',
      nativeTitle: 'ನೋವು ನಿಖರವಾಗಿ ಎಲ್ಲಿದೆ?',
      options: ['Right side of head', 'Bilateral / Forehead', 'Occipital / Back'],
      selected: location,
      setter: setLocation,
    },
    {
      id: 'triggers',
      title: 'Does bright light or screen exposure make the headache worse?',
      nativeTitle: 'ಬೆಳಕು ನೋವನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆಯೇ?',
      options: ['Yes, light worsens pain (Photophobia)', 'No sensitivity to light'],
      selected: triggers,
      setter: setTriggers,
    },
    {
      id: 'nausea',
      title: 'Are you experiencing any nausea or vomiting?',
      nativeTitle: 'ವಾಂತಿ ಅಥವಾ ವಾಕರಿಕೆ ಇದೆಯೇ?',
      options: ['Mild nausea without vomiting', 'Active vomiting', 'No nausea'],
      selected: nausea,
      setter: setNausea,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6 max-w-4xl mx-auto w-full space-y-5">
      {/* Top Header & Breadcrumbs */}
      <div className="flex items-center justify-between border-b border-[#E2DFD8] pb-3 text-xs">
        <button
          onClick={onCancel}
          className="flex items-center gap-1 text-[#5E5B54] hover:text-[#111111]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Case-Taking</span>
        </button>

        <div className="font-mono text-[11px] text-[#0D5C3A] font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CodeScribe Multilingual Clinical Intake</span>
        </div>

        <span className="font-mono text-[10px] text-[#8A867C]">Pt #0247</span>
      </div>

      {/* STEP 1: CHOICE (First Time vs Existing History) */}
      {step === 'choice' && (
        <div className="bg-white border border-[#E2DFD8] rounded-2xl p-5 sm:p-8 space-y-6 shadow-xs max-w-2xl mx-auto">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF4EE] border border-[#0D5C3A]/20 flex items-center justify-center mx-auto text-[#0D5C3A]">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
              Start a new consultation
            </h1>
            <p className="text-xs sm:text-sm text-[#5E5B54]">
              Do you already have health records linked to your ABHA, or are you registering as a new patient?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Option A: Existing Patient */}
            <button
              onClick={() => setStep('voice-intake')}
              className="p-5 bg-[#FAF9F6] hover:bg-[#EBF4EE] border-2 border-[#0D5C3A] rounded-2xl text-left space-y-3 transition-all group shadow-xs active:scale-98"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-[#0D5C3A] text-white rounded font-bold">
                  Recommended
                </span>
                <ChevronRight className="w-4 h-4 text-[#0D5C3A] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#111111]">Yes, use my history</div>
                <div className="text-xs text-[#0D5C3A] font-semibold mt-1">
                  We found 8 previous consultations linked to ABHA.
                </div>
                <p className="text-[11px] text-[#5E5B54] mt-1">
                  Past headache visits, CBC tests & prescriptions will be cross-referenced.
                </p>
              </div>
            </button>

            {/* Option B: New Patient */}
            <button
              onClick={() => setStep('voice-intake')}
              className="p-5 bg-white hover:bg-[#FAF9F6] border border-[#E2DFD8] hover:border-[#111111] rounded-2xl text-left space-y-3 transition-all group shadow-xs active:scale-98"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-[#FAF9F6] text-[#8A867C] rounded font-semibold border border-[#E2DFD8]">
                  Fresh Intake
                </span>
                <ChevronRight className="w-4 h-4 text-[#8A867C] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#111111]">I am a new patient</div>
                <div className="text-xs text-[#5E5B54] mt-1">
                  Create a new clinical record from scratch.
                </div>
                <p className="text-[11px] text-[#8A867C] mt-1">
                  Takes 2 minutes with voice-guided intake in your language.
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: MULTILINGUAL VOICE INTAKE */}
      {step === 'voice-intake' && (
        <div className="bg-white border border-[#E2DFD8] rounded-2xl p-4 sm:p-8 space-y-5 shadow-xs">
          {/* Language Selector & Speech Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE7DE]">
            <div>
              <span className="font-mono text-[10px] text-[#0D5C3A] uppercase font-bold tracking-wider block">
                Step 1 of 3: Multilingual Voice Case-Taking
              </span>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#111111]">
                  Tell us what brings you here today
                </h2>
                {/* 🔊 Text-To-Speech Listen Button for Question Prompt */}
                <button
                  onClick={() =>
                    handleSpeakQuestion(
                      selectedLang === 'Kannada'
                        ? 'ಇಂದು ನಿಮ್ಮನ್ನು ಇಲ್ಲಿಗೆ ಕರೆತಂದ ಸಮಸ್ಯೆ ಏನು? ದಯವಿಟ್ಟು ವಿವರಿಸಿ.'
                        : 'Tell us what brings you here today. Please describe your symptoms.'
                    )
                  }
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                    isPlayingAudio
                      ? 'bg-[#0D5C3A] text-white border-[#0D5C3A] animate-pulse'
                      : 'bg-[#FAF9F6] hover:bg-[#EAE7DE] border-[#E2DFD8] text-[#0D5C3A]'
                  }`}
                  title="Listen to question spoken aloud"
                >
                  {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span className="font-mono text-[10px] font-bold">
                    {isPlayingAudio ? 'Speaking...' : 'Listen'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#0D5C3A]" />
              <select
                value={selectedLang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="p-2 bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl text-xs font-semibold text-[#111111] focus:outline-none focus:border-[#0D5C3A]"
              >
                {INDIAN_LANGUAGES.map((l) => (
                  <option key={l.id} value={l.name}>
                    {l.name} ({l.nativeName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Microphone Permission / Browser Error Banner */}
          {speechError && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <span className="font-bold block">Voice Recognition Notice</span>
                <p className="text-[11px] leading-relaxed">{speechError}</p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleStartRealListening}
                    className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 rounded text-[10px] font-bold text-amber-950 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => setIsManualInput(true)}
                    className="px-2.5 py-1 bg-white border border-amber-300 rounded text-[10px] font-semibold text-amber-900 transition-colors"
                  >
                    Use Text Instead
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Real Microphone Active Work Area */}
          <div className="text-center py-4 sm:py-6 space-y-4 max-w-lg mx-auto">
            <div className="relative inline-block">
              {/* Subtle animated waveform waves when active */}
              {isListening && (
                <>
                  <div className="absolute -inset-3 rounded-full bg-red-500/20 animate-ping" />
                  <div className="absolute -inset-6 rounded-full bg-red-500/10 animate-pulse" />
                </>
              )}

              <button
                onClick={isListening ? handleStopListening : handleStartRealListening}
                className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-lg mx-auto relative z-10 active:scale-95 ${
                  isListening
                    ? 'bg-red-600 text-white scale-105 ring-4 ring-red-300'
                    : 'bg-[#0D5C3A] hover:bg-[#08482A] text-white hover:scale-105'
                }`}
                title={isListening ? 'Tap to Stop Listening' : `Tap to Speak in ${selectedLang}`}
              >
                {isListening ? <Square className="w-7 h-7" /> : <Mic className="w-8 h-8" />}
                <span className="text-[9px] font-mono mt-1 font-bold uppercase tracking-wider">
                  {isListening ? 'Stop' : 'Tap to speak'}
                </span>
              </button>
            </div>

            {/* Status & Real-time indicator */}
            <div>
              {isListening ? (
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-red-600 animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <span>● Listening to your live speech ({selectedLang} / {getLanguageSpeechCode(selectedLang)})…</span>
                </div>
              ) : (
                <p className="text-xs text-[#5E5B54]">
                  Tap the microphone to speak your symptoms in {selectedLang} ({activeLangObj.nativeName}).
                </p>
              )}
            </div>

            {/* Toggle Type vs Demo Helper */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => setIsManualInput(!isManualInput)}
                className="text-[11px] font-mono text-[#5E5B54] hover:text-[#111111] flex items-center gap-1 underline"
              >
                <Keyboard className="w-3 h-3" />
                <span>{isManualInput ? 'Hide text input' : 'Type instead'}</span>
              </button>

              <span className="text-[#DDD9CE]">•</span>

              {/* Requirement 2 & 9: Separate Optional Demo Voice Input button */}
              <button
                onClick={handleUseDemoSpeech}
                className="px-2.5 py-1 bg-[#FAF9F6] hover:bg-[#EAE7DE] border border-[#E2DFD8] rounded-lg text-[10px] font-mono font-semibold text-[#0D5C3A] transition-colors"
                title="Populate Kannada headache demo response for presentation without microphone"
              >
                Use Demo Response (Kannada)
              </button>
            </div>
          </div>

          {/* Text Input Drawer if requested */}
          {isManualInput && (
            <div className="p-3.5 bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl space-y-1.5 animate-in fade-in text-xs">
              <label className="font-bold text-[#111111] block">Type your statement ({selectedLang}):</label>
              <textarea
                rows={2}
                value={transcriptText}
                onChange={(e) => {
                  setTranscriptText(e.target.value);
                  setTranslatedText(e.target.value);
                }}
                placeholder="Type your symptoms here in English or your native language..."
                className="w-full p-2.5 bg-white border border-[#E2DFD8] rounded-lg text-xs text-[#111111] focus:outline-none focus:border-[#0D5C3A]"
              />
            </div>
          )}

          {/* Live Transcript & Clinical Translation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            <div className="p-4 bg-[#FAF9F6] border border-[#E2DFD8] rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-[#0D5C3A] font-bold">
                  Captured Speech ({selectedLang})
                </span>
                <span className="font-mono text-[10px] text-[#8A867C]">
                  {isListening ? 'Listening…' : transcriptText ? 'Transcript Ready' : 'Awaiting Input'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-[#111111] leading-relaxed min-h-[48px]">
                {transcriptText ? `“${transcriptText}”` : <span className="text-[#8A867C] italic">Speak into the microphone above to transcribe your statement in real-time.</span>}
              </p>
              {transcriptText && (
                <div className="flex items-center gap-2 pt-1 text-[10px] font-mono">
                  <button
                    onClick={() => setTranscriptText('')}
                    className="text-red-700 hover:underline"
                  >
                    Clear
                  </button>
                  <span className="text-[#DDD9CE]">•</span>
                  <button
                    onClick={() => setIsManualInput(true)}
                    className="text-[#0D5C3A] hover:underline"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border border-[#0D5C3A]/30 rounded-2xl space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-[#0D5C3A] font-bold">
                  Clinical Normalization (English)
                </span>
                <span className="font-mono text-[10px] bg-[#EBF4EE] text-[#0D5C3A] px-1.5 py-0.2 rounded font-semibold">
                  AI Intake Model
                </span>
              </div>
              <p className="text-xs text-[#111111] leading-relaxed min-h-[48px]">
                {translatedText ? `“${translatedText}”` : <span className="text-[#8A867C] italic">Clinical English representation will appear automatically.</span>}
              </p>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-[#EAE7DE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              onClick={handleStartRealListening}
              className="px-3.5 py-2 bg-white border border-[#E2DFD8] hover:border-[#111111] rounded-xl text-xs font-semibold text-[#111111] flex items-center gap-1.5 transition-colors self-start"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#0D5C3A]" />
              <span>Speak Again</span>
            </button>

            <button
              onClick={handleStartQuestions}
              disabled={!transcriptText.trim()}
              className={`px-6 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
                transcriptText.trim()
                  ? 'bg-[#0D5C3A] hover:bg-[#08482A] text-white active:scale-98'
                  : 'bg-[#EAE7DE] text-[#8A867C] cursor-not-allowed'
              }`}
            >
              <span>Continue to Follow-up Questions</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONVERSATIONAL FOLLOW-UP QUESTIONS WITH TTS (🔊 Listen) AND VOICE ANSWERING */}
      {step === 'structured-questions' && (
        <div className="bg-white border border-[#E2DFD8] rounded-2xl p-4 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE7DE] pb-3">
            <div>
              <span className="font-mono text-[10px] text-[#0D5C3A] uppercase font-bold tracking-wider block">
                Step 2 of 3: SOCRATES Clinical Clarification
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#111111]">
                CodeScribe AI Clinical Follow-Up
              </h2>
            </div>

            <span className="font-mono text-xs text-[#0D5C3A] font-bold bg-[#EBF4EE] px-2.5 py-1 rounded-lg">
              Question {activeQuestionIndex + 1} of {followUpQuestions.length + 1}
            </span>
          </div>

          {/* Active Question Carousel Card */}
          {activeQuestionIndex < followUpQuestions.length ? (
            <div className="p-5 bg-[#FAF9F6] border-2 border-[#0D5C3A]/40 rounded-2xl space-y-4 animate-in fade-in">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[#0D5C3A] font-bold block">
                    CodeScribe asks:
                  </span>
                  <h3 className="text-base font-bold text-[#111111]">
                    {followUpQuestions[activeQuestionIndex].title}
                  </h3>
                  {selectedLang !== 'English' && (
                    <p className="text-xs text-[#5E5B54] font-medium">
                      “{followUpQuestions[activeQuestionIndex].nativeTitle}”
                    </p>
                  )}
                </div>

                {/* 🔊 Listen to Current Question via TTS */}
                <button
                  onClick={() =>
                    handleSpeakQuestion(
                      selectedLang === 'Kannada'
                        ? followUpQuestions[activeQuestionIndex].nativeTitle
                        : followUpQuestions[activeQuestionIndex].title
                    )
                  }
                  className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 shrink-0 transition-all ${
                    isPlayingAudio
                      ? 'bg-[#0D5C3A] text-white border-[#0D5C3A] animate-pulse'
                      : 'bg-white hover:bg-[#EAE7DE] border-[#E2DFD8] text-[#0D5C3A]'
                  }`}
                  title="Listen to question spoken aloud"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="font-mono text-[11px] font-bold">
                    {isPlayingAudio ? 'Speaking…' : 'Listen'}
                  </span>
                </button>
              </div>

              {/* Quick Select Options */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] text-[#8A867C] font-semibold block">Select response or speak:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {followUpQuestions[activeQuestionIndex].options.map((opt) => {
                    const isSelected = followUpQuestions[activeQuestionIndex].selected === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => followUpQuestions[activeQuestionIndex].setter(opt)}
                        className={`p-3 rounded-xl border text-left font-medium transition-all ${
                          isSelected
                            ? 'bg-[#0D5C3A] text-white border-[#0D5C3A] font-bold shadow-xs'
                            : 'bg-white border-[#E2DFD8] text-[#111111] hover:border-[#111111]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Voice Answer Option for the question */}
              <div className="pt-2 border-t border-[#EAE7DE] flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setIsAnsweringVoice(!isAnsweringVoice);
                    if (!isAnsweringVoice) {
                      handleStartRealListening();
                    } else {
                      handleStopListening();
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs transition-all ${
                    isListening
                      ? 'bg-red-600 text-white border-red-600 animate-pulse'
                      : 'bg-white border-[#E2DFD8] text-[#111111] hover:border-[#111111]'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isListening ? 'Listening to answer…' : '🎙️ Speak Answer'}</span>
                </button>

                <button
                  onClick={() => setActiveQuestionIndex((prev) => prev + 1)}
                  className="px-4 py-2 bg-[#111111] hover:bg-[#0D5C3A] text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Pain Severity Rating Question */
            <div className="p-5 bg-[#FAF9F6] border-2 border-[#0D5C3A]/40 rounded-2xl space-y-4 animate-in fade-in">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#0D5C3A] font-bold block">
                    CodeScribe asks:
                  </span>
                  <h3 className="text-base font-bold text-[#111111]">
                    How severe is the pain on a scale of 1 to 10?
                  </h3>
                  <p className="text-xs text-[#5E5B54]">
                    1 = Mild ache • 5 = Moderate throbbing • 10 = Incapacitating severe migraine
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleSpeakQuestion('How severe is the pain on a scale of 1 to 10?')
                  }
                  className="p-2 rounded-xl bg-white border border-[#E2DFD8] text-[#0D5C3A] text-xs flex items-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="font-mono text-[11px] font-bold">Listen</span>
                </button>
              </div>

              <div className="p-4 bg-white border border-[#E2DFD8] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#111111]">Pain Severity Assessment:</span>
                  <span className="font-mono text-sm font-bold text-white bg-[#0D5C3A] px-3 py-0.5 rounded">
                    {severity} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full accent-[#0D5C3A] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#8A867C] font-mono">
                  <span>1 (Mild)</span>
                  <span>5 (Moderate)</span>
                  <span>10 (Severe)</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleFinishQuestions}
                  className="px-6 py-3 bg-[#0D5C3A] hover:bg-[#08482A] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-98"
                >
                  <span>Review What We Understood</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-2 border-t border-[#EAE7DE] flex items-center justify-between text-xs">
            <button
              onClick={() => {
                if (activeQuestionIndex > 0) {
                  setActiveQuestionIndex((prev) => prev - 1);
                } else {
                  setStep('voice-intake');
                }
              }}
              className="px-4 py-2 bg-white border border-[#E2DFD8] rounded-xl text-xs font-semibold text-[#5E5B54] hover:text-[#111111]"
            >
              Back
            </button>

            <button
              onClick={handleFinishQuestions}
              className="font-mono text-xs text-[#0D5C3A] hover:underline"
            >
              Skip to Review →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PATIENT REVIEW ("What we understood") */}
      {step === 'patient-review' && (
        <div className="bg-white border border-[#E2DFD8] rounded-2xl p-5 sm:p-8 space-y-6 shadow-xs max-w-2xl mx-auto">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#0D5C3A]">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
                Safety & Transparency Verification
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#111111]">
              What we understood
            </h2>
            <p className="text-xs text-[#5E5B54]">
              Please review what CodeScribe AI understood before sending to the physician.
            </p>
          </div>

          {/* Structured Confirmation Summary Card */}
          <div className="bg-[#FAF9F6] border border-[#E2DFD8] rounded-2xl p-4 sm:p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE7DE]">
              <span className="text-[#8A867C]">Complaint:</span>
              <span className="font-bold text-sm text-[#111111]">Headache (Unilateral)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8A867C]">Started:</span>
              <span className="font-semibold text-[#111111]">{onset}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8A867C]">Location:</span>
              <span className="font-semibold text-[#111111]">{location}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8A867C]">Photophobia (Light sensitivity):</span>
              <span className="font-semibold text-amber-800">Yes ({triggers})</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8A867C]">Severity:</span>
              <span className="font-mono font-bold text-[#0D5C3A] bg-[#EBF4EE] px-2 py-0.5 rounded">
                {severity} / 10
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8A867C]">Previous similar episodes:</span>
              <span className="font-semibold text-[#111111]">Yes (3 previous visits)</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[#8A867C]">Medications taken for this episode:</span>
              <span className="font-semibold text-[#111111]">{currentMeds}</span>
            </div>
          </div>

          {/* Buttons: Looks Correct vs Edit */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                setStep('structured-questions');
                setActiveQuestionIndex(0);
              }}
              className="py-3 px-4 bg-white border border-[#E2DFD8] hover:border-[#111111] text-[#111111] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              onClick={handleStartAiStructuring}
              className="py-3 px-4 bg-[#0D5C3A] hover:bg-[#08482A] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Looks Correct</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: AI STRUCTURING PROGRESS */}
      {step === 'ai-structuring' && (
        <div className="bg-white border border-[#E2DFD8] rounded-2xl p-8 sm:p-12 text-center space-y-6 max-w-md mx-auto shadow-xs animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-[#EBF4EE] border border-[#0D5C3A]/30 flex items-center justify-center mx-auto text-[#0D5C3A]">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-[#111111]">
              Preparing your clinical history…
            </h2>
            <p className="text-xs text-[#5E5B54]">
              AI-assisted clinical structuring (Not automated diagnosis).
            </p>
          </div>

          {/* Structuring Progress List */}
          <div className="space-y-2 text-xs text-left bg-[#FAF9F6] p-4 rounded-xl border border-[#E2DFD8]">
            {structuringItems.map((item, idx) => {
              const isDone = idx < aiStructuringProgress;
              const isCurrent = idx === aiStructuringProgress;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2 ${
                    isDone
                      ? 'text-[#0D5C3A] font-semibold'
                      : isCurrent
                      ? 'text-[#111111] font-bold'
                      : 'text-[#8A867C]'
                  }`}
                >
                  <span className="font-mono text-[11px]">{isDone ? '✓' : '•'}</span>
                  <span>{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
