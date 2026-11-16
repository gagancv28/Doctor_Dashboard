import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Volume2,
  FileCheck,
} from 'lucide-react';
import type { PrescriptionRecord, MedicationItem, PrescriptionItemDetail } from '../../types/health';
import { speechService } from '../../services/speechService';
import { ocrService } from '../../services/ocrService';
import { prescriptionService } from '../../services/prescriptionService';

interface PrescriptionWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  onSavePrescription?: (
    prescription: PrescriptionRecord,
    newActiveMedications: MedicationItem[]
  ) => void;
}

type PrescriptionMode = 'write' | 'voice' | 'ocr' | 'review' | 'success';
type VoiceRecordingState = 'idle' | 'recording' | 'recorded' | 'processing';
type OcrUploadState = 'idle' | 'file-selected' | 'extracting' | 'error' | 'no_text';

export const PrescriptionWorkflowModal: React.FC<PrescriptionWorkflowModalProps> = ({
  isOpen,
  onClose,
  patientId,
  patientName,
  onSavePrescription,
}) => {
  const [currentMode, setCurrentMode] = useState<PrescriptionMode>('write');
  const [sourceType, setSourceType] = useState<'Written' | 'Voice' | 'OCR'>('Written');

  // Prescription Items State (starts with blank fields, NO hardcoded defaults)
  const [items, setItems] = useState<PrescriptionItemDetail[]>([
    {
      id: 'item-1',
      medicine: '',
      dose: '',
      frequency: 'Once daily (1-0-0)',
      duration: '',
      route: 'Oral',
      instructions: '',
      additionalAdvice: '',
    },
  ]);

  const [additionalAdvice, setAdditionalAdvice] = useState<string>('');
  const [followUpDate, setFollowUpDate] = useState<string>('');
  const [freeformText, setFreeformText] = useState<string>('');

  // ==========================================
  // VOICE PRESCRIPTION STATE
  // ==========================================
  const [voiceState, setVoiceState] = useState<VoiceRecordingState>('idle');
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [voiceStatusMsg, setVoiceStatusMsg] = useState<string | null>(null);
  
  const timerRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // ==========================================
  // OCR / UPLOAD STATE
  // ==========================================
  const [ocrState, setOcrState] = useState<OcrUploadState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [ocrExtractedText, setOcrExtractedText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ==========================================
  // DOCTOR REVIEW & VERIFICATION
  // ==========================================
  const [doctorConfirmedCheckbox, setDoctorConfirmedCheckbox] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [savedPrescription, setSavedPrescription] = useState<PrescriptionRecord | null>(null);

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setCurrentMode('write');
      setSourceType('Written');
      setDoctorConfirmedCheckbox(false);
      setSavedPrescription(null);
      setIsSubmitting(false);
      setFreeformText('');
      setAdditionalAdvice('');
      setFollowUpDate('');
      setItems([
        {
          id: `item-${Date.now()}-1`,
          medicine: '',
          dose: '',
          frequency: 'Once daily (1-0-0)',
          duration: '',
          route: 'Oral',
          instructions: '',
          additionalAdvice: '',
        },
      ]);

      // Voice reset
      setVoiceState('idle');
      setRecordingSeconds(0);
      setIsPlayingVoice(false);
      setPlaybackProgress(0);
      setVoiceTranscript('');
      setRecordedAudioBlob(null);
      setRecordedAudioUrl(null);
      setMicError(null);
      setVoiceStatusMsg(null);

      // OCR reset
      setOcrState('idle');
      setSelectedFile(null);
      setFilePreviewUrl(null);
      setUploadError(null);
      setOcrExtractedText('');
    }
  }, [isOpen]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
      speechService.cancelRecording();
    };
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && currentMode !== 'success') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentMode, onClose]);

  if (!isOpen) return null;

  // ==========================================
  // MEDICINE ITEMS HELPERS
  // ==========================================
  const handleAddMedicine = () => {
    const newItem: PrescriptionItemDetail = {
      id: `item-${Date.now()}-${items.length + 1}`,
      medicine: '',
      dose: '',
      frequency: 'Once daily (1-0-0)',
      duration: '',
      route: 'Oral',
      instructions: '',
      additionalAdvice: '',
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveMedicine = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      // Clear the single row
      setItems([
        {
          id: `item-${Date.now()}-1`,
          medicine: '',
          dose: '',
          frequency: 'Once daily (1-0-0)',
          duration: '',
          route: 'Oral',
          instructions: '',
          additionalAdvice: '',
        },
      ]);
    }
  };

  const handleUpdateItem = (id: string, field: keyof PrescriptionItemDetail, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Quick NLP Freeform parser for typed mode
  const handleParseFreeformText = () => {
    if (!freeformText.trim()) return;
    const draft = prescriptionService.extractFromText(freeformText);
    if (draft.items.length > 0) {
      setItems(draft.items);
    }
    if (draft.additionalAdvice) {
      setAdditionalAdvice(draft.additionalAdvice);
    }
    if (draft.followUpDate) {
      setFollowUpDate(draft.followUpDate);
    }
  };

  // ==========================================
  // VOICE WORKFLOW HANDLERS (REAL MEDIARECORDER)
  // ==========================================
  const handleStartRecording = async () => {
    setMicError(null);
    setVoiceStatusMsg(null);
    try {
      await speechService.startRecording((liveText) => {
        setVoiceTranscript(liveText);
      });
      setVoiceState('recording');
      setRecordingSeconds(0);
      setIsPlayingVoice(false);
      setRecordedAudioBlob(null);
      setRecordedAudioUrl(null);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((sec) => sec + 1);
      }, 1000);
    } catch (err: any) {
      setMicError(err.message || 'Microphone access denied. Please allow microphone access in your browser settings and try again.');
      setVoiceState('idle');
    }
  };

  const handleStopRecording = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      const { blob, liveTranscript } = await speechService.stopRecording();
      if (!blob || blob.size === 0) {
        setMicError('No audio was captured. Please record again.');
        setVoiceState('idle');
        return;
      }
      const url = URL.createObjectURL(blob);
      setRecordedAudioBlob(blob);
      setRecordedAudioUrl(url);
      if (liveTranscript) {
        setVoiceTranscript(liveTranscript);
      }
      setVoiceState('recorded');
    } catch (err: any) {
      setMicError(err.message || 'Failed to stop recording audio.');
      setVoiceState('idle');
    }
  };

  const handleTogglePlayRecording = () => {
    if (!recordedAudioUrl) return;

    if (isPlayingVoice) {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      setIsPlayingVoice(false);
    } else {
      if (!audioElementRef.current) {
        const audio = new Audio(recordedAudioUrl);
        audioElementRef.current = audio;

        audio.ontimeupdate = () => {
          if (audio.duration) {
            setPlaybackProgress((audio.currentTime / audio.duration) * 100);
          }
        };

        audio.onended = () => {
          setIsPlayingVoice(false);
          setPlaybackProgress(100);
        };

        audio.onerror = () => {
          setIsPlayingVoice(false);
        };
      }

      audioElementRef.current.play().then(() => {
        setIsPlayingVoice(true);
      }).catch(() => {
        setIsPlayingVoice(false);
      });
    }
  };

  const handleReRecord = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    speechService.cancelRecording();
    setVoiceState('idle');
    setRecordingSeconds(0);
    setIsPlayingVoice(false);
    setPlaybackProgress(0);
    setVoiceTranscript('');
    setRecordedAudioBlob(null);
    setRecordedAudioUrl(null);
    setMicError(null);
    setVoiceStatusMsg(null);
  };

  const handleGenerateFromVoice = async () => {
    if (!recordedAudioBlob || recordedAudioBlob.size === 0) {
      setMicError('No audio was captured. Please record again.');
      return;
    }

    setVoiceState('processing');
    setVoiceStatusMsg(null);

    try {
      const result = await speechService.transcribeAudio(recordedAudioBlob, voiceTranscript);
      
      if (result.status === 'empty_audio') {
        setMicError('No audio was captured. Please record again.');
        setVoiceState('idle');
        return;
      }

      if (result.extractedDraft && result.extractedDraft.items.length > 0) {
        setItems(result.extractedDraft.items);
        if (result.extractedDraft.additionalAdvice) {
          setAdditionalAdvice(result.extractedDraft.additionalAdvice);
        }
        if (result.extractedDraft.followUpDate) {
          setFollowUpDate(result.extractedDraft.followUpDate);
        }
      } else if (result.transcript) {
        // Run NLP extraction on transcript
        const draft = prescriptionService.extractFromText(result.transcript);
        if (draft.items.length > 0) {
          setItems(draft.items);
        } else {
          // Transcript had no detected medicines
          setItems([]);
        }
        if (draft.additionalAdvice) {
          setAdditionalAdvice(draft.additionalAdvice);
        }
        if (draft.followUpDate) {
          setFollowUpDate(draft.followUpDate);
        }
      } else {
        // Prompt manual transcript
        setVoiceStatusMsg(result.message || 'Please enter what was spoken to generate structured medications.');
        setVoiceState('recorded');
        return;
      }

      setSourceType('Voice');
      setVoiceState('idle');
      setCurrentMode('review');
    } catch {
      setVoiceState('recorded');
    }
  };

  // ==========================================
  // OCR / UPLOAD WORKFLOW HANDLERS
  // ==========================================
  const handleFileChange = (file: File | null) => {
    setUploadError(null);
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|pdf)$/i)) {
      setUploadError('Invalid file format. Please upload a JPG, PNG, WEBP, or PDF prescription file.');
      return;
    }

    // Validate size (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File is too large. Maximum supported size is 10 MB.');
      return;
    }

    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl(null);
    }
    setOcrState('file-selected');
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setOcrState('idle');
    setUploadError(null);
    setOcrExtractedText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExtractFromOcr = async () => {
    if (!selectedFile) return;
    setOcrState('extracting');
    setUploadError(null);

    try {
      const ocrResult = await ocrService.extractTextFromImage(selectedFile);
      
      if (ocrResult.status === 'no_text_detected' || !ocrResult.text) {
        setOcrState('no_text');
        setUploadError(ocrResult.message || 'No prescription content could be detected in this image.');
        return;
      }

      setOcrExtractedText(ocrResult.text);

      // Real NLP extraction from actual OCR text
      const draft = prescriptionService.extractFromText(ocrResult.text);
      if (draft.items.length > 0) {
        setItems(draft.items);
      } else {
        setItems([]);
      }
      if (draft.additionalAdvice) {
        setAdditionalAdvice(draft.additionalAdvice);
      }
      if (draft.followUpDate) {
        setFollowUpDate(draft.followUpDate);
      }

      setSourceType('OCR');
      setOcrState('file-selected');
      setCurrentMode('review');
    } catch (err: any) {
      setOcrState('error');
      setUploadError(err.message || 'Failed to extract text from prescription file.');
    }
  };

  // ==========================================
  // SUBMISSION & VERIFICATION HANDLER
  // ==========================================
  const handleFinalSubmit = async () => {
    if (!doctorConfirmedCheckbox || isSubmitting) return;

    setIsSubmitting(true);

    const validItems = items.filter((it) => it.medicine.trim().length > 0);
    const rxId = `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPrescription: PrescriptionRecord = {
      id: rxId,
      patientId: patientId.replace(/^#/, ''),
      patientName: patientName,
      doctorName: 'Dr. Sharma, MD',
      doctorRegistration: 'KMC-2018-88492',
      facility: 'CodeScribe Health Center',
      department: 'General Medicine / OPD',
      date: '11 Sep 2026',
      time: '10:52 AM',
      items: validItems,
      additionalAdvice: additionalAdvice || 'Follow general medical advice and take medications as directed.',
      followUpDate: followUpDate || 'As advised during review',
      doctorVerified: true,
      verifiedBy: 'Dr. Sharma, MD',
      verifiedAt: '11 Sep 2026, 10:52 AM',
      status: 'Doctor Verified',
      source: sourceType,
      syncedToPatientApp: true,
      auditTrail: {
        createdBy: 'Dr. Sharma, MD',
        createdAt: '11 Sep 2026, 10:52 AM',
        verifiedBy: 'Dr. Sharma, MD',
        verifiedAt: '11 Sep 2026, 10:52 AM',
        sourceType: sourceType,
      },
    };

    const newActiveMeds: MedicationItem[] = validItems.map((it, idx) => ({
      id: `med-${Date.now()}-${idx + 1}`,
      name: it.medicine,
      dosage: it.dose,
      frequency: it.frequency,
      route: it.route || 'Oral',
      startDate: '11 Sep 2026',
      duration: it.duration,
      instructions: it.instructions || 'After food',
      prescribedBy: 'Dr. Sharma, MD',
      facility: 'CodeScribe Health Center',
      reason: 'OPD Consultation Prescription',
      status: 'Active',
      verifiedBy: 'Dr. Sharma, MD',
      verifiedAt: '11 Sep 2026',
      source: sourceType,
    }));

    try {
      await prescriptionService.createPrescription(newPrescription, newActiveMeds);

      if (onSavePrescription) {
        onSavePrescription(newPrescription, newActiveMeds);
      }

      setSavedPrescription(newPrescription);
      setIsSubmitting(false);
      setCurrentMode('success');
    } catch {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
    >
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* =========================================================================
            HEADER
           ========================================================================= */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">Clinical Prescription Station</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {patientName} ({patientId})
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Create and verify digital prescription records
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =========================================================================
            MODE TABS
           ========================================================================= */}
        {currentMode !== 'success' && (
          <div className="px-6 pt-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentMode('write');
                setSourceType('Written');
              }}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
                currentMode === 'write'
                  ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              Write / Type
            </button>

            <button
              onClick={() => {
                setCurrentMode('voice');
                setSourceType('Voice');
              }}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
                currentMode === 'voice'
                  ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Mic className="w-4 h-4" />
              Voice Prescription
            </button>

            <button
              onClick={() => {
                setCurrentMode('ocr');
                setSourceType('OCR');
              }}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
                currentMode === 'ocr'
                  ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload Prescription Photo
            </button>

            {items.some((i) => i.medicine.trim().length > 0) && (
              <button
                onClick={() => setCurrentMode('review')}
                className={`ml-auto px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  currentMode === 'review'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Review Draft ({items.filter((i) => i.medicine.trim().length > 0).length})
              </button>
            )}
          </div>
        )}

        {/* =========================================================================
            BODY CONTENT
           ========================================================================= */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-900 bg-slate-50">
          {/* =========================================================================
              MODE 1: WRITE / TYPE FORM
             ========================================================================= */}
          {currentMode === 'write' && (
            <div className="space-y-4">
              {/* Quick NLP Box */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-blue-900">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Quick Clinical Entry (NLP Auto-Structure)</span>
                  </div>
                  {freeformText.trim() && (
                    <button
                      onClick={handleParseFreeformText}
                      className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all text-[11px] cursor-pointer"
                    >
                      Extract Structured Items
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={freeformText}
                  onChange={(e) => setFreeformText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleParseFreeformText();
                  }}
                  placeholder="e.g. Tab. Amoxicillin 500mg TDS for 5 days after food. Tab. Paracetamol 650mg SOS. Review in 5 days."
                  className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-white text-xs text-slate-900 focus:border-blue-600 focus:outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Structured Medication Items</h4>
                  <p className="text-slate-500 text-xs">
                    Specify medicine, dosage, frequency, and instructions
                  </p>
                </div>
                <button
                  onClick={handleAddMedicine}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Medicine
                </button>
              </div>

              {/* Medicine Table / Rows */}
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-xs text-blue-600 font-mono">
                        #{index + 1} Medication
                      </span>
                      <button
                        onClick={() => handleRemoveMedicine(item.id)}
                        className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 cursor-pointer font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">
                          Medicine Name *
                        </label>
                        <input
                          type="text"
                          value={item.medicine}
                          onChange={(e) => handleUpdateItem(item.id, 'medicine', e.target.value)}
                          placeholder="e.g. Amoxicillin, Cetirizine, Paracetamol..."
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">
                          Dosage / Strength
                        </label>
                        <input
                          type="text"
                          value={item.dose}
                          onChange={(e) => handleUpdateItem(item.id, 'dose', e.target.value)}
                          placeholder="e.g. 500 mg, 10 mg"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">
                          Frequency
                        </label>
                        <select
                          value={item.frequency}
                          onChange={(e) => handleUpdateItem(item.id, 'frequency', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                        >
                          <option value="Once daily (1-0-0)">Once daily (1-0-0)</option>
                          <option value="Once daily at bedtime (0-0-1)">Once daily at bedtime (0-0-1)</option>
                          <option value="Twice daily (1-0-1)">Twice daily (1-0-1)</option>
                          <option value="Thrice daily (1-1-1)">Thrice daily (1-1-1)</option>
                          <option value="Four times daily (1-1-1-1)">Four times daily (1-1-1-1)</option>
                          <option value="Once daily SOS (As needed)">Once daily SOS (As needed)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={item.duration}
                          onChange={(e) => handleUpdateItem(item.id, 'duration', e.target.value)}
                          placeholder="e.g. 3 days, 5 days, 1 week"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">
                          Timing & Instructions
                        </label>
                        <input
                          type="text"
                          value={item.instructions}
                          onChange={(e) => handleUpdateItem(item.id, 'instructions', e.target.value)}
                          placeholder="e.g. After food, Before food, With warm water..."
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Advice and Follow up */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Dietary & Lifestyle Advice (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={additionalAdvice}
                    onChange={(e) => setAdditionalAdvice(e.target.value)}
                    placeholder="e.g. Adequate hydration, avoid bright lights, take rest..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:border-blue-600 focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="w-64">
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Follow-up Date / Advice (Optional)
                  </label>
                  <input
                    type="text"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    placeholder="e.g. Review after 5 days, 15 Sep 2026"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 font-mono focus:border-blue-600 focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setSourceType('Written');
                    setCurrentMode('review');
                  }}
                  disabled={!items.some((i) => i.medicine.trim().length > 0)}
                  className={`px-5 py-2.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                    items.some((i) => i.medicine.trim().length > 0)
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Proceed to Doctor Review <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODE 2: VOICE PRESCRIPTION (EXPLICIT RECORDING INTERACTION FLOW)
             ========================================================================= */}
          {currentMode === 'voice' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Doctor Voice Dictation</h4>
                <p className="text-slate-500 text-xs">
                  Speak clinical prescription instructions using your microphone
                </p>
              </div>

              {/* Error Banner when Microphone is Denied */}
              {micError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col items-center justify-center text-center space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-rose-700">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Microphone Notice</span>
                  </div>
                  <p className="text-slate-600 max-w-md">
                    {micError}
                  </p>
                  <button
                    onClick={handleStartRecording}
                    className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 transition-all text-xs cursor-pointer shadow-xs"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* STATE 1: IDLE */}
              {voiceState === 'idle' && !micError && (
                <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                    <Mic className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-base text-slate-900">Ready to Record Voice Prescription</h5>
                    <p className="text-xs text-slate-500 max-w-md">
                      Click start when ready. Speak medication names, dosages, and instructions clearly into your microphone.
                    </p>
                  </div>
                  <button
                    onClick={handleStartRecording}
                    className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md cursor-pointer text-sm"
                  >
                    <Mic className="w-4 h-4" /> Start Recording
                  </button>
                </div>
              )}

              {/* STATE 2: RECORDING IN PROGRESS */}
              {voiceState === 'recording' && (
                <div className="p-8 rounded-2xl bg-rose-50/50 border-2 border-rose-400 shadow-sm flex flex-col items-center justify-center text-center space-y-5 animate-pulse">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg animate-bounce">
                      <Mic className="w-10 h-10" />
                    </div>
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600"></span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2 font-mono text-2xl font-bold text-rose-700">
                      <Clock className="w-5 h-5 text-rose-600" />
                      {formatTimer(recordingSeconds)}
                    </div>
                    <p className="text-xs font-semibold text-rose-800">
                      ● Recording in progress — speak clearly...
                    </p>
                    {voiceTranscript && (
                      <p className="text-xs text-slate-600 italic max-w-md pt-2">
                        "{voiceTranscript}"
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleStopRecording}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-all flex items-center gap-2 shadow-md cursor-pointer text-xs"
                  >
                    <Square className="w-4 h-4" /> Stop Recording
                  </button>
                </div>
              )}

              {/* STATE 3: RECORDED / STOPPED */}
              {(voiceState === 'recorded' || voiceState === 'processing') && (
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Recording Complete</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        Duration: {formatTimer(recordingSeconds)}
                      </span>
                    </div>

                    {/* Audio Player */}
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
                      <button
                        onClick={handleTogglePlayRecording}
                        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all cursor-pointer shrink-0 shadow-xs"
                      >
                        {isPlayingVoice ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                          <span className="flex items-center gap-1">
                            <Volume2 className="w-3.5 h-3.5 text-blue-600" /> Real Audio Stream
                          </span>
                          <span>{isPlayingVoice ? 'Playing...' : 'Ready'}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full transition-all duration-100"
                            style={{ width: `${playbackProgress}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleReRecord}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Re-record
                      </button>
                    </div>

                    {/* Status Notice if STT required manual text */}
                    {voiceStatusMsg && (
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                        {voiceStatusMsg}
                      </div>
                    )}

                    {/* Editable Transcript Field */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Voice Transcript (Review / Edit)
                      </label>
                      <textarea
                        rows={3}
                        value={voiceTranscript}
                        onChange={(e) => setVoiceTranscript(e.target.value)}
                        placeholder="Spoken transcript will appear here. You can also type or edit instructions before generating structured medications."
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:border-blue-600 focus:outline-none placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={handleReRecord}
                        className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                      >
                        Discard Recording
                      </button>

                      <button
                        onClick={handleGenerateFromVoice}
                        disabled={voiceState === 'processing'}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm cursor-pointer text-xs disabled:opacity-50"
                      >
                        {voiceState === 'processing' ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Extracting Medications...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" /> Generate Prescription Draft
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              MODE 3: UPLOAD PRESCRIPTION PHOTO (OCR)
             ========================================================================= */}
          {currentMode === 'ocr' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Upload Prescription Photo (OCR)</h4>
                <p className="text-slate-500 text-xs">
                  Upload a photo of a physical prescription document to extract structured medications
                </p>
              </div>

              {uploadError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <p className="font-bold text-rose-800">{uploadError}</p>
                    {ocrState === 'no_text' && (
                      <p className="text-slate-600 text-[11px]">
                        The uploaded image did not contain readable prescription text. Please upload a clear photo or enter medications manually.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* File Dropzone */}
              {!selectedFile && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  />
                  <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-sm">
                      Click to choose prescription image
                    </p>
                    <p className="text-xs text-slate-500">
                      Supports JPG, PNG, WEBP, or PDF (up to 10 MB)
                    </p>
                  </div>
                </div>
              )}

              {/* File Preview & Actions */}
              {selectedFile && (
                <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-xs text-slate-900">{selectedFile.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="text-rose-500 hover:text-rose-700 text-xs font-semibold cursor-pointer"
                    >
                      Remove File
                    </button>
                  </div>

                  {filePreviewUrl ? (
                    <div className="flex justify-center p-2 bg-slate-100 rounded-lg max-h-60 overflow-hidden">
                      <img
                        src={filePreviewUrl}
                        alt="Prescription preview"
                        className="max-h-56 object-contain rounded"
                      />
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 border rounded-lg text-center font-mono text-xs text-slate-600">
                      PDF Document: {selectedFile.name}
                    </div>
                  )}

                  {ocrExtractedText && (
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">
                        Extracted OCR Text
                      </label>
                      <pre className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-800 font-mono whitespace-pre-wrap">
                        {ocrExtractedText}
                      </pre>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                    >
                      Replace File
                    </button>

                    <button
                      onClick={handleExtractFromOcr}
                      disabled={ocrState === 'extracting'}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm cursor-pointer text-xs disabled:opacity-50"
                    >
                      {ocrState === 'extracting' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Running OCR Extraction...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" /> Extract Structured Prescription
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              MODE 4: DOCTOR REVIEW & MANDATORY VERIFICATION GUARD
             ========================================================================= */}
          {currentMode === 'review' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Doctor Prescription Review & Verification</h4>
                  <p className="text-slate-500 text-xs">
                    Review and verify extracted medications before submitting to patient record
                  </p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Source: {sourceType === 'Voice' ? 'Doctor Voice Dictation' : sourceType === 'OCR' ? 'Prescription Photo OCR' : 'Doctor Manual Entry'}
                </span>
              </div>

              {/* Raw Source Traceability */}
              {sourceType === 'Voice' && voiceTranscript && (
                <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-200 text-xs space-y-1">
                  <span className="font-bold text-blue-800 block text-[11px]">Original Spoken Transcript:</span>
                  <p className="text-slate-700 italic">"{voiceTranscript}"</p>
                </div>
              )}

              {sourceType === 'OCR' && ocrExtractedText && (
                <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-200 text-xs space-y-1">
                  <span className="font-bold text-blue-800 block text-[11px]">Original OCR Text:</span>
                  <p className="text-slate-700 font-mono text-[11px] whitespace-pre-wrap">{ocrExtractedText}</p>
                </div>
              )}

              {/* Review Medication List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-700">Prescription Items ({items.length})</span>
                  <button
                    onClick={handleAddMedicine}
                    className="text-xs text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Item
                  </button>
                </div>

                {items.length === 0 ? (
                  <div className="p-6 rounded-xl bg-white border border-slate-200 text-center space-y-2">
                    <p className="text-slate-500 text-xs">No medication items extracted from input.</p>
                    <button
                      onClick={handleAddMedicine}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs"
                    >
                      + Add Medication Manually
                    </button>
                  </div>
                ) : (
                  items.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-xs text-blue-600 font-mono">
                          #{index + 1} Medication
                        </span>
                        <button
                          onClick={() => handleRemoveMedicine(item.id)}
                          className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 cursor-pointer font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">
                            Medicine Name
                          </label>
                          <input
                            type="text"
                            value={item.medicine}
                            onChange={(e) => handleUpdateItem(item.id, 'medicine', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">
                            Dosage
                          </label>
                          <input
                            type="text"
                            value={item.dose}
                            onChange={(e) => handleUpdateItem(item.id, 'dose', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">
                            Frequency
                          </label>
                          <select
                            value={item.frequency}
                            onChange={(e) => handleUpdateItem(item.id, 'frequency', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                          >
                            <option value="Once daily (1-0-0)">Once daily (1-0-0)</option>
                            <option value="Once daily at bedtime (0-0-1)">Once daily at bedtime (0-0-1)</option>
                            <option value="Twice daily (1-0-1)">Twice daily (1-0-1)</option>
                            <option value="Thrice daily (1-1-1)">Thrice daily (1-1-1)</option>
                            <option value="Four times daily (1-1-1-1)">Four times daily (1-1-1-1)</option>
                            <option value="Once daily SOS (As needed)">Once daily SOS (As needed)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={item.duration}
                            onChange={(e) => handleUpdateItem(item.id, 'duration', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">
                            Instructions
                          </label>
                          <input
                            type="text"
                            value={item.instructions}
                            onChange={(e) => handleUpdateItem(item.id, 'instructions', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Advice & Follow-up */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Doctor Advice & Lifestyle Recommendations
                  </label>
                  <textarea
                    rows={2}
                    value={additionalAdvice}
                    onChange={(e) => setAdditionalAdvice(e.target.value)}
                    placeholder="e.g. Adequate hydration, avoid bright lights, take rest..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="w-64">
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Follow-up Date / Advice
                  </label>
                  <input
                    type="text"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    placeholder="e.g. Review after 5 days, 15 Sep 2026"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 font-mono focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* MANDATORY VERIFICATION GUARD */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-300 shadow-xs space-y-3">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={doctorConfirmedCheckbox}
                    onChange={(e) => setDoctorConfirmedCheckbox(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-emerald-950 block">
                      I have reviewed and verified this prescription as the attending physician.
                    </span>
                    <p className="text-[11px] text-emerald-800">
                      Verifying stamps this prescription as "Doctor Verified" and syncs it across OPD Queue, Patient History, and Active Medications.
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentMode(sourceType === 'Voice' ? 'voice' : sourceType === 'OCR' ? 'ocr' : 'write')}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  Back to Input
                </button>

                <button
                  onClick={handleFinalSubmit}
                  disabled={!doctorConfirmedCheckbox || isSubmitting}
                  className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer text-xs ${
                    doctorConfirmedCheckbox && !isSubmitting
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving to Patient Record...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" /> Confirm & Submit Prescription
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODE 5: SUCCESS STATE
             ========================================================================= */}
          {currentMode === 'success' && savedPrescription && (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-lg text-slate-900">Prescription Verified & Submitted</h4>
                <p className="text-xs text-slate-500 font-mono">
                  Prescription ID: {savedPrescription.id} • {savedPrescription.patientName} ({savedPrescription.patientId})
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md w-full text-left space-y-2 text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                    Doctor Verified
                  </span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-slate-500">Prescribed Medicines:</span>
                  <span className="font-bold text-slate-900">
                    {savedPrescription.items.length} item(s)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Attending Doctor:</span>
                  <span className="font-bold text-slate-900">{savedPrescription.doctorName}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all text-xs cursor-pointer shadow-xs"
              >
                Close Prescription Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
