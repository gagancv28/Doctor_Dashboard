/**
 * Speech Service — Browser MediaRecorder & Audio Transcription Pipeline
 * Captures real microphone audio streams, creates audio Blobs, and processes transcription.
 * Strictly decoupled from hardcoded templates.
 */

import { prescriptionService, type ExtractedPrescriptionDraft } from './prescriptionService';

export interface TranscriptionResult {
  transcript: string;
  durationSeconds: number;
  extractedDraft?: ExtractedPrescriptionDraft;
  status: 'transcribed' | 'manual_entry_required' | 'empty_audio';
  message?: string;
}

export interface SpeechRecognitionOptions {
  languageCode: string;
  onStart?: () => void;
  onResult?: (transcript: string, isFinal?: boolean) => void;
  onError?: (error: { message: string }) => void;
  onEnd?: () => void;
}

export class SpeechRecognitionSession {
  private recognition: any = null;
  private isListening = false;
  private options: SpeechRecognitionOptions;

  constructor(options: SpeechRecognitionOptions) {
    this.options = options;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = getLanguageSpeechCode(options.languageCode);

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.options.onStart) this.options.onStart();
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      if (this.options.onResult) {
        this.options.onResult(text, Boolean(finalTranscript));
      }
    };

    this.recognition.onerror = (event: any) => {
      if (this.options.onError) {
        this.options.onError({ message: event.error || 'Speech recognition error' });
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.options.onEnd) this.options.onEnd();
    };
  }

  start(_existingText?: string): boolean {
    if (!this.recognition) return false;
    if (!this.isListening) {
      try {
        this.recognition.start();
        return true;
      } catch {
        return false;
      }
    }
    return true;
  }

  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.isListening = false;
    }
  }

  abort() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // ignore
      }
      this.isListening = false;
    }
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}

export function getLanguageSpeechCode(langCode: string): string {
  const map: Record<string, string> = {
    kn: 'kn-IN',
    Kannada: 'kn-IN',
    en: 'en-IN',
    English: 'en-IN',
    hi: 'hi-IN',
    Hindi: 'hi-IN',
    ta: 'ta-IN',
    Tamil: 'ta-IN',
    te: 'te-IN',
    Telugu: 'te-IN',
    mr: 'mr-IN',
    Marathi: 'mr-IN',
    bn: 'bn-IN',
    Bengali: 'bn-IN',
    ml: 'ml-IN',
    Malayalam: 'ml-IN',
  };
  return map[langCode] || 'en-IN';
}

export function speakQuestion(
  text: string,
  languageCode: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: () => void
): () => void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onEnd) onEnd();
    return () => {};
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = getLanguageSpeechCode(languageCode);
  utterance.rate = 0.95;

  if (onStart) {
    utterance.onstart = onStart;
  }
  if (onEnd) {
    utterance.onend = onEnd;
  }
  if (onError) {
    utterance.onerror = onError;
  }

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
    if (onEnd) onEnd();
  };
}

export class SpeechService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private mediaStream: MediaStream | null = null;
  private liveRecognition: any = null;
  private currentLiveTranscript = '';

  /**
   * Check if microphone capture is supported in this browser
   */
  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;
  }

  /**
   * Request microphone permission and start recording real audio stream
   */
  public async startRecording(onLiveTranscript?: (text: string) => void): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Microphone audio recording is not supported in this browser.');
    }

    try {
      this.audioChunks = [];
      this.currentLiveTranscript = '';
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/ogg';

      this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100);

      // Start Browser Speech Recognition in parallel if supported
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          this.liveRecognition = new SpeechRecognition();
          this.liveRecognition.continuous = true;
          this.liveRecognition.interimResults = true;
          this.liveRecognition.lang = 'en-IN';

          this.liveRecognition.onresult = (event: any) => {
            let fullText = '';
            for (let i = 0; i < event.results.length; ++i) {
              fullText += event.results[i][0].transcript + ' ';
            }
            this.currentLiveTranscript = fullText.trim();
            if (onLiveTranscript) {
              onLiveTranscript(this.currentLiveTranscript);
            }
          };

          this.liveRecognition.start();
        } catch {
          this.liveRecognition = null;
        }
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        throw new Error('Microphone access denied. Please allow microphone access in your browser settings and try again.');
      }
      throw new Error(err.message || 'Failed to initialize microphone recording.');
    }
  }

  /**
   * Stop recording, release all audio tracks, and return the real Audio Blob
   */
  public async stopRecording(): Promise<{ blob: Blob; liveTranscript: string }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('MediaRecorder was not initialized.'));
        return;
      }

      if (this.liveRecognition) {
        try {
          this.liveRecognition.stop();
        } catch {
          // ignore
        }
        this.liveRecognition = null;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        const transcript = this.currentLiveTranscript;
        
        // Clean up stream tracks
        if (this.mediaStream) {
          this.mediaStream.getTracks().forEach((track) => track.stop());
          this.mediaStream = null;
        }
        this.mediaRecorder = null;
        resolve({ blob: audioBlob, liveTranscript: transcript });
      };

      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      } else {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        resolve({ blob: audioBlob, liveTranscript: this.currentLiveTranscript });
      }
    });
  }

  /**
   * Cancel recording and release microphone
   */
  public cancelRecording(): void {
    if (this.liveRecognition) {
      try {
        this.liveRecognition.abort();
      } catch {
        // ignore
      }
      this.liveRecognition = null;
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.currentLiveTranscript = '';
  }

  /**
   * Transcribe recorded audio Blob into structured prescription draft.
   * Isolates speech-to-text API for future Supabase/Whisper/Google Cloud Speech replacement.
   * Derives medication items strictly from the actual transcript.
   */
  public async transcribeAudio(
    audioBlob: Blob,
    providedTranscript?: string
  ): Promise<TranscriptionResult> {
    if (!audioBlob || audioBlob.size === 0) {
      return {
        transcript: '',
        durationSeconds: 0,
        status: 'empty_audio',
        message: 'No audio was captured. Please record again.',
      };
    }

    // Simulated async processing latency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const durationSeconds = Math.max(1, Math.round(audioBlob.size / 16000));
    const transcriptText = (providedTranscript || this.currentLiveTranscript || '').trim();

    if (transcriptText) {
      const draft = prescriptionService.extractFromText(transcriptText);
      return {
        transcript: transcriptText,
        durationSeconds,
        extractedDraft: draft,
        status: 'transcribed',
      };
    }

    // If live speech recognition didn't catch speech and no cloud API is configured,
    // allow the doctor to review the audio and type/edit the transcript honestly.
    return {
      transcript: '',
      durationSeconds,
      status: 'manual_entry_required',
      message: 'Cloud Speech-to-Text service is not connected yet. Audio was captured successfully. Please enter what was spoken below to generate structured medications.',
    };
  }
}

export const speechService = new SpeechService();
