import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  User,
  ShieldCheck,
  CheckCircle2,
  Mic,
  ArrowRight,
  Camera,
  RotateCcw,
  HeartPulse,
  Volume2,
  VolumeX,
  Square,
  Globe,
} from 'lucide-react';
import type { HealthIdentity } from '../../types/health';
import { INDIAN_LANGUAGES } from '../../mock/healthStore';
import {
  SpeechRecognitionSession,
  getLanguageSpeechCode,
  isSpeechRecognitionSupported,
  speakQuestion,
} from '../../services/speechService';

interface HospitalKioskViewProps {
  identity: HealthIdentity;
  onProceedToDoctor: () => void;
  onExitKiosk: () => void;
}

export const HospitalKioskView: React.FC<HospitalKioskViewProps> = ({
  identity,
  onProceedToDoctor,
  onExitKiosk,
}) => {
  const [kioskStep, setKioskStep] = useState<
    'welcome' | 'scan' | 'verifying' | 'consent' | 'history-ready' | 'voice-intake' | 'review' | 'intake-done'
  >('welcome');

  const [selectedLang, setSelectedLang] = useState<string>('Kannada');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const speechSessionRef = useRef<SpeechRecognitionSession | null>(null);
  const stopAudioRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (speechSessionRef.current) speechSessionRef.current.abort();
      if (stopAudioRef.current) stopAudioRef.current();
    };
  }, []);

  const handleSimulateScan = () => {
    setKioskStep('verifying');
    setTimeout(() => {
      setKioskStep('consent');
    }, 1200);
  };

  const handleGrantConsent = () => {
    setKioskStep('history-ready');
  };

  // Real Speech Recognition for Kiosk
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
        setTranscript(text);
        if (selectedLang === 'Kannada' || selectedLang === 'Hindi') {
          setTranslatedText(
            text.includes('ತಲೆನೋವು') || text.includes('headache')
              ? 'Headache since yesterday evening, pain concentrated on right side, sensitive to bright light.'
              : `Statement in ${selectedLang}: "${text}"`
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
    const started = session.start(transcript);
    if (!started && !isSpeechRecognitionSupported()) {
      setSpeechError("Voice recognition isn't supported in this browser. Please use text input or demo response.");
    }
  };

  const handleStopListening = () => {
    if (speechSessionRef.current) {
      speechSessionRef.current.stop();
    }
    setIsListening(false);
  };

  // Predefined Demo Response for SIH Judges
  const handleUseDemoVoice = () => {
    if (speechSessionRef.current) speechSessionRef.current.abort();
    setIsListening(false);
    setSpeechError(null);
    setTranscript('ನಿನ್ನೆ ಸಂಜೆ ಇಂದ ತಲೆನೋವು ಇದೆ. ಬಲಭಾಗದಲ್ಲಿ ಹೆಚ್ಚು ನೋವು ಇದೆ ಮತ್ತು ಬೆಳಕನ್ನು ನೋಡಿದಾಗ ಹೆಚ್ಚಾಗುತ್ತದೆ.');
    setTranslatedText('Headache since yesterday evening, pain concentrated on right side and worsens with bright light (photophobia).');
  };

  const handleSpeakKioskPrompt = () => {
    if (isPlayingAudio && stopAudioRef.current) {
      stopAudioRef.current();
      setIsPlayingAudio(false);
      return;
    }

    const promptText =
      selectedLang === 'Kannada'
        ? 'ದಯವಿಟ್ಟು ಮೈಕ್ರೊಫೋನ್ ಒತ್ತಿ ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಹೇಳಿ.'
        : 'Please tap the microphone and describe what brings you here today.';

    const bcp47 = getLanguageSpeechCode(selectedLang);
    setIsPlayingAudio(true);

    const stopFn = speakQuestion(
      promptText,
      bcp47,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
    stopAudioRef.current = stopFn;
  };

  return (
    <div className="flex-1 bg-[#F5F3EE] flex flex-col justify-between p-4 sm:p-8 select-none min-h-screen">
      {/* Kiosk Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E2DFD8]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0D5C3A] text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <HeartPulse className="w-7 h-7 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                Hospital OPD Self-Service Kiosk
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 bg-[#EBF4EE] text-[#0D5C3A] font-bold rounded">
                Touch Display Mode
              </span>
            </div>
            <div className="text-xs text-[#5E5B54]">
              Government General Hospital / City Care OPD Triage • Ministry of Ayush SIH26047
            </div>
          </div>
        </div>

        <button
          onClick={onExitKiosk}
          className="px-4 py-2 bg-white border border-[#E2DFD8] hover:border-[#111111] rounded-xl text-xs font-mono font-semibold text-[#111111] transition-colors shadow-xs"
        >
          Exit Kiosk
        </button>
      </div>

      {/* Main Kiosk Touch Work Area */}
      <div className="flex-1 flex items-center justify-center my-6">
        {/* KIOSK 1: WELCOME */}
        {kioskStep === 'welcome' && (
          <div className="w-full max-w-3xl bg-white border-2 border-[#E2DFD8] rounded-3xl p-8 sm:p-12 text-center space-y-8 shadow-md">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase text-[#0D5C3A] font-bold tracking-wider block">
                Welcome to Hospital OPD
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight">
                Your health history. Wherever you go.
              </h2>
              <p className="text-sm sm:text-base text-[#5E5B54] max-w-xl mx-auto">
                Scan your ABHA card to load your existing medical history or describe your symptoms in your own language.
              </p>
            </div>

            {/* Oversized Touch Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <button
                onClick={() => setKioskStep('scan')}
                className="p-8 bg-[#EBF4EE] hover:bg-[#D5EAD9] border-2 border-[#0D5C3A] rounded-3xl text-left space-y-4 transition-all group shadow-sm active:scale-95"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#0D5C3A] text-white flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-emerald-200" />
                </div>
                <div>
                  <div className="font-bold text-xl text-[#111111]">I have ABHA</div>
                  <div className="text-xs text-[#0D5C3A] font-semibold mt-1">
                    Scan QR to link 8 previous hospital visits
                  </div>
                </div>
              </button>

              <button
                onClick={() => setKioskStep('voice-intake')}
                className="p-8 bg-white hover:bg-[#FAF9F6] border-2 border-[#E2DFD8] hover:border-[#111111] rounded-3xl text-left space-y-4 transition-all group shadow-sm active:scale-95"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#111111] text-white flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <div className="font-bold text-xl text-[#111111]">I am a new patient</div>
                  <div className="text-xs text-[#5E5B54] mt-1">
                    Speak your symptoms in Kannada / Hindi
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* KIOSK 2: SCAN QR */}
        {kioskStep === 'scan' && (
          <div className="w-full max-w-xl bg-white border-2 border-[#E2DFD8] rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-md">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#111111]">
                Scan Your ABHA / Health QR
              </h2>
              <p className="text-xs text-[#5E5B54]">
                Hold your ABHA card or Ayushman app QR code in front of the kiosk scanner.
              </p>
            </div>

            <div className="relative aspect-square w-64 mx-auto rounded-3xl bg-[#111111] border-4 border-[#0D5C3A] overflow-hidden flex flex-col items-center justify-center text-white p-6 shadow-inner">
              <div className="absolute inset-6 border-2 border-dashed border-emerald-400 rounded-2xl flex items-center justify-center pointer-events-none">
                <div className="w-full h-1 bg-emerald-400 shadow-[0_0_15px_#34d399] animate-bounce-subtle" />
              </div>
              <QrCode className="w-16 h-16 text-emerald-300/40" />
            </div>

            <button
              onClick={handleSimulateScan}
              className="w-full py-4 bg-[#0D5C3A] hover:bg-[#08482A] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Camera className="w-5 h-5" />
              <span>Simulate Kiosk Scan (Lakshmi Gowda)</span>
            </button>
          </div>
        )}

        {/* KIOSK 3: VERIFYING */}
        {kioskStep === 'verifying' && (
          <div className="w-full max-w-md bg-white border-2 border-[#E2DFD8] rounded-3xl p-10 text-center space-y-4 shadow-md">
            <div className="w-16 h-16 rounded-full bg-[#EBF4EE] border border-[#0D5C3A]/30 flex items-center justify-center mx-auto text-[#0D5C3A] animate-spin">
              <RotateCcw className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[#111111]">Verifying Health Identity…</h2>
            <p className="text-xs text-[#5E5B54] font-mono">
              Connecting to ABDM Gateway & fetching available records from linked facilities…
            </p>
          </div>
        )}

        {/* KIOSK 4: EXPLICIT CONSENT */}
        {kioskStep === 'consent' && (
          <div className="w-full max-w-2xl bg-white border-2 border-[#E2DFD8] rounded-3xl p-8 sm:p-10 space-y-6 shadow-md">
            <div className="space-y-1 text-center">
              <span className="font-mono text-xs uppercase text-[#0D5C3A] font-bold">
                Patient Consent
              </span>
              <h2 className="text-2xl font-bold text-[#111111]">
                Load available records into today’s consultation?
              </h2>
              <p className="text-xs text-[#5E5B54]">
                Found 8 previous consultations, 2 active medications, and 1 allergy record.
              </p>
            </div>

            <div className="p-4 bg-[#FAF9F6] border border-[#E2DFD8] rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8A867C]">Patient Name:</span>
                <span className="font-bold text-[#111111]">{identity.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A867C]">ABHA Address:</span>
                <span className="font-mono font-bold text-[#0D5C3A]">{identity.abhaAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A867C]">Known Allergy:</span>
                <span className="font-bold text-amber-700">Penicillin (Beta-lactam)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => setKioskStep('welcome')}
                className="py-4 bg-white border-2 border-[#E2DFD8] text-[#111111] rounded-2xl text-sm font-semibold hover:border-[#111111]"
              >
                Cancel
              </button>

              <button
                onClick={handleGrantConsent}
                className="py-4 bg-[#0D5C3A] hover:bg-[#08482A] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Allow & Load History</span>
              </button>
            </div>
          </div>
        )}

        {/* KIOSK 5: HISTORY LOADED READY */}
        {kioskStep === 'history-ready' && (
          <div className="w-full max-w-xl bg-white border-2 border-[#E2DFD8] rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-md">
            <div className="w-16 h-16 rounded-full bg-[#EBF4EE] border border-[#0D5C3A]/30 flex items-center justify-center mx-auto text-[#0D5C3A]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#111111]">
                Health History Loaded
              </h2>
              <p className="text-xs text-[#5E5B54]">
                Your 8 previous consultations and medication history are ready for today’s attending doctor.
              </p>
            </div>

            <button
              onClick={() => setKioskStep('voice-intake')}
              className="w-full py-4 bg-[#111111] hover:bg-[#0D5C3A] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <span>Start Today’s Consultation Intake</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* KIOSK 6: REAL TOUCH VOICE INTAKE */}
        {kioskStep === 'voice-intake' && (
          <div className="w-full max-w-2xl bg-white border-2 border-[#E2DFD8] rounded-3xl p-6 sm:p-10 space-y-6 text-center shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE7DE] pb-3">
              <div className="text-left">
                <span className="font-mono text-xs uppercase text-[#0D5C3A] font-bold">
                  Touch & Voice Intake
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111111]">
                  Speak what brings you here today
                </h2>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Globe className="w-4 h-4 text-[#0D5C3A]" />
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="p-2 bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl text-xs font-semibold text-[#111111]"
                >
                  {INDIAN_LANGUAGES.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleSpeakKioskPrompt}
                  className="p-2 bg-[#FAF9F6] hover:bg-[#EAE7DE] border border-[#E2DFD8] rounded-xl text-xs text-[#0D5C3A]"
                  title="Listen to kiosk audio instructions"
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {speechError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                <span>{speechError}</span>
                <button
                  onClick={handleStartRealListening}
                  className="px-2 py-1 bg-amber-200 rounded font-bold"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Oversized Touch Microphone */}
            <div className="py-2">
              <div className="relative inline-block">
                {isListening && (
                  <div className="absolute -inset-4 rounded-full bg-red-500/20 animate-ping" />
                )}
                <button
                  onClick={isListening ? handleStopListening : handleStartRealListening}
                  className={`w-28 h-28 rounded-full flex flex-col items-center justify-center mx-auto transition-all shadow-xl active:scale-95 ${
                    isListening
                      ? 'bg-red-600 text-white ring-8 ring-red-200'
                      : 'bg-[#0D5C3A] hover:bg-[#08482A] text-white'
                  }`}
                >
                  {isListening ? <Square className="w-9 h-9" /> : <Mic className="w-10 h-10" />}
                  <span className="text-[10px] font-mono mt-1 font-bold uppercase">
                    {isListening ? 'Stop' : 'Tap & Speak'}
                  </span>
                </button>
              </div>

              <div className="pt-2 text-xs text-[#5E5B54]">
                {isListening ? (
                  <span className="text-red-600 font-bold animate-pulse">● Listening to speech ({selectedLang})…</span>
                ) : (
                  <span>Tap to record in {selectedLang}</span>
                )}
              </div>
            </div>

            {/* Captured Statement Display */}
            <div className="p-4 bg-[#FAF9F6] border border-[#E2DFD8] rounded-2xl text-left space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-[#0D5C3A] font-bold">
                  Captured Statement ({selectedLang}):
                </span>
                {transcript && (
                  <button onClick={() => setTranscript('')} className="text-red-600 font-mono text-[10px]">
                    Clear
                  </button>
                )}
              </div>
              <p className="font-medium text-sm text-[#111111] leading-relaxed min-h-[40px]">
                {transcript ? `“${transcript}”` : <span className="text-[#8A867C] italic">Speak your complaint into the microphone or use the demo button below.</span>}
              </p>
              {translatedText && (
                <p className="text-[#5E5B54] text-[11px] pt-1.5 border-t border-[#EAE7DE]">
                  Clinical English: “{translatedText}”
                </p>
              )}
            </div>

            {/* Demo Response & Submit Button */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-center">
                <button
                  onClick={handleUseDemoVoice}
                  className="px-3 py-1.5 bg-[#FAF9F6] hover:bg-[#EAE7DE] border border-[#E2DFD8] rounded-xl text-xs font-mono text-[#0D5C3A] font-semibold"
                >
                  Use Demo Voice Input (Kannada)
                </button>
              </div>

              <button
                onClick={() => setKioskStep('intake-done')}
                disabled={!transcript.trim()}
                className={`w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
                  transcript.trim()
                    ? 'bg-[#0D5C3A] hover:bg-[#08482A] text-white active:scale-95'
                    : 'bg-[#EAE7DE] text-[#8A867C] cursor-not-allowed'
                }`}
              >
                <span>Submit to Doctor Workstation</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* KIOSK 7: HANDOFF READY */}
        {kioskStep === 'intake-done' && (
          <div className="w-full max-w-xl bg-white border-2 border-[#E2DFD8] rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-md">
            <div className="w-16 h-16 rounded-full bg-[#EBF4EE] border border-[#0D5C3A]/30 flex items-center justify-center mx-auto text-[#0D5C3A]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#111111]">
                Token #0247 Dispatched
              </h2>
              <p className="text-xs text-[#5E5B54]">
                Please proceed to OPD Room 104 (Dr. Sharma, MD). Your clinical case history is ready on the physician’s dashboard.
              </p>
            </div>

            <button
              onClick={onProceedToDoctor}
              className="w-full py-4 bg-[#111111] hover:bg-[#0D5C3A] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <span>Open Doctor Dashboard (Simulation)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Kiosk Footer */}
      <div className="text-center font-mono text-[11px] text-[#8A867C] pt-2 border-t border-[#E2DFD8]">
        CodeScribe Health Touch Kiosk v2.4 • Ayushman Bharat Digital Mission (ABDM) Compatible
      </div>
    </div>
  );
};
