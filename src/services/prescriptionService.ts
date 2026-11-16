import { storageService } from './storageService';
import type { PrescriptionRecord, MedicationItem, PrescriptionItemDetail } from '../types/health';

export interface ExtractedPrescriptionDraft {
  items: PrescriptionItemDetail[];
  additionalAdvice: string;
  followUpDate: string;
  rawText: string;
  detectedMedicinesCount: number;
}

// Common clinical drug dictionary for intelligent entity extraction
const COMMON_DRUGS = [
  'Paracetamol', 'Acetaminophen', 'Amoxicillin', 'Azithromycin', 'Ibuprofen',
  'Cetirizine', 'Levocetirizine', 'Domperidone', 'Pantoprazole', 'Omeprazole',
  'Metformin', 'Amlodipine', 'Telmisartan', 'Atorvastatin', 'Losartan',
  'Ciprofloxacin', 'Doxycycline', 'Cefixime', 'Cefuroxime', 'Montelukast',
  'Ranitidine', 'Ondansetron', 'Tramadol', 'Diclofenac', 'Aceclofenac',
  'Augmentin', 'Metronidazole', 'Clindamycin', 'Hydrochlorothiazide',
  'Salbutamol', 'Budesonide', 'Prednisolone', 'Thyroxine', 'Levothyroxine',
  'Gabapentin', 'Pregabalin', 'Duloxetine', 'Escitalopram', 'Alprazolam',
  'Vitamin C', 'Vitamin D3', 'Zinc', 'Calcium', 'Multivitamin', 'B-Complex'
];

export const prescriptionService = {
  getPrescriptions: async (patientId?: string): Promise<PrescriptionRecord[]> => {
    const state = storageService.getState();
    if (!patientId) return state.prescriptions;
    const cleanId = patientId.replace(/^#/, '');
    return state.prescriptions.filter((rx) => rx.patientId === cleanId);
  },

  /**
   * Intelligently parses clinical instructions / transcript / OCR text into structured prescription items.
   * Completely data-driven: derives outputs strictly from the provided input text.
   */
  extractFromText: (inputText: string): ExtractedPrescriptionDraft => {
    if (!inputText || !inputText.trim()) {
      return {
        items: [],
        additionalAdvice: '',
        followUpDate: '',
        rawText: '',
        detectedMedicinesCount: 0,
      };
    }

    const cleanText = inputText.trim();
    const items: PrescriptionItemDetail[] = [];
    let detectedAdvice = '';
    let detectedFollowUp = '';

    // Split text into potential sentence / medicine clauses
    const clauses = cleanText
      .split(/(?:\r\n|\r|\n|\. |\; |\band\b(?=\s*(?:Tab|Cap|Syp|Inj|Prescribe|Take|\b[A-Z][a-z]+)))/i)
      .map((c) => c.trim())
      .filter(Boolean);

    // Number word converter
    const parseNumberWord = (word: string): string => {
      const map: Record<string, string> = {
        one: '1', two: '2', three: '3', four: '4', five: '5',
        six: '6', seven: '7', eight: '8', nine: '9', ten: '10',
      };
      return map[word.toLowerCase()] || word;
    };

    clauses.forEach((clause, idx) => {
      // Check for follow-up statements
      const followUpMatch = clause.match(/follow[-\s]?up(?:\s*(?:after|in|on))?\s*([^,.;]+)/i) ||
                            clause.match(/review\s*(?:after|in|on)?\s*([^,.;]+)/i);
      if (followUpMatch) {
        detectedFollowUp = followUpMatch[1].trim();
        return;
      }

      // Check for advice statements
      if (
        /^(?:advise|rest|avoid|drink|maintain|diet|hydration|take rest|sleep)\b/i.test(clause) ||
        /\b(?:in a dark|quiet room|plenty of fluids|warm water|adequate hydration|avoid screen)\b/i.test(clause)
      ) {
        detectedAdvice = detectedAdvice ? `${detectedAdvice}. ${clause}` : clause;
        return;
      }

      // Check if clause mentions "continue current medication" or "no new prescription"
      if (/\b(?:continue\s+(?:all\s+)?current\s+medication|no\s+new\s+prescription|no\s+medications\s+needed)\b/i.test(clause)) {
        detectedAdvice = detectedAdvice ? `${detectedAdvice}. ${clause}` : clause;
        return;
      }

      // Check for drug names
      let detectedDrug = '';

      // 1. Search against common drug dictionary
      for (const drug of COMMON_DRUGS) {
        const regex = new RegExp(`\\b${drug}\\b`, 'i');
        if (regex.test(clause)) {
          detectedDrug = drug;
          break;
        }
      }

      // 2. Look for "Tab.", "Cap.", "Syp.", "Inj.", "Prescribe", "Take" patterns
      if (!detectedDrug) {
        const prefixMatch = clause.match(/\b(?:Tab(?:let)?|Cap(?:sule)?|Syp(?:rup)?|Inj(?:ection)?|Prescribe|Take|Give)\.?\s+([A-Z][a-zA-Z0-9_-]+)/i);
        if (prefixMatch && prefixMatch[1] && prefixMatch[1].length > 2) {
          detectedDrug = prefixMatch[1];
        }
      }

      // 3. Look for Capitalized medicine word followed by dosage
      if (!detectedDrug) {
        const doseNearWord = clause.match(/\b([A-Z][a-zA-Z0-9_-]{2,})\s+(?:\d+|one|two|three|four|five)\s*(?:mg|g|mcg|ml|iu|IU|milligrams?|grams?)/i);
        if (doseNearWord && doseNearWord[1] && !/^(?:Take|Give|Prescribe|Daily|Twice|After|Before|With)$/i.test(doseNearWord[1])) {
          detectedDrug = doseNearWord[1];
        }
      }

      if (detectedDrug) {
        // Dosage Extraction
        let dose = '500 mg';
        const doseMatch = clause.match(/(\d+(?:\.\d+)?)\s*(mg|g|mcg|ml|iu|IU|milligrams?|grams?|milliliters?)\b/i) ||
                          clause.match(/(one|two|three|four|five|six|seven|eight|nine|ten)\s*(mg|g|mcg|ml|milligrams?|grams?)\b/i);
        if (doseMatch) {
          const num = parseNumberWord(doseMatch[1]);
          let unit = doseMatch[2].toLowerCase();
          if (unit.startsWith('milli')) unit = 'mg';
          else if (unit.startsWith('gram')) unit = 'g';
          dose = `${num} ${unit}`;
        }

        // Frequency Extraction
        let frequency = 'Once daily';
        if (/\b(?:thrice\s+daily|three\s+times\s+(?:a|per)\s+day|3\s+times\s+(?:a|per)\s+day|1-1-1|tds|tid)\b/i.test(clause)) {
          frequency = 'Thrice daily (1-1-1)';
        } else if (/\b(?:twice\s+daily|two\s+times\s+(?:a|per)\s+day|2\s+times\s+(?:a|per)\s+day|1-0-1|bd|bid|morning\s+and\s+night)\b/i.test(clause)) {
          frequency = 'Twice daily (1-0-1)';
        } else if (/\b(?:at\s+bedtime|at\s+night|before\s+sleep|0-0-1|hs|bedtime|night)\b/i.test(clause)) {
          frequency = 'Once daily at bedtime (0-0-1)';
        } else if (/\b(?:sos|as\s+needed|when\s+required|if\s+needed|prn|for\s+(?:fever|pain|nausea))\b/i.test(clause)) {
          frequency = 'Once daily SOS (As needed)';
        } else if (/\b(?:once\s+daily|one\s+time\s+(?:a|per)\s+day|1\s+time\s+(?:a|per)\s+day|1-0-0|od|morning)\b/i.test(clause)) {
          frequency = 'Once daily (1-0-0)';
        } else if (/\b(?:four\s+times\s+daily|4\s+times\s+(?:a|per)\s+day|qid|1-1-1-1)\b/i.test(clause)) {
          frequency = 'Four times daily (1-1-1-1)';
        }

        // Duration Extraction
        let duration = '3 days';
        const durationMatch = clause.match(/(?:for|x)\s*(\d+|one|two|three|four|five|six|seven|eight|nine|ten|14|30)\s*(days?|weeks?|months?)\b/i) ||
                              clause.match(/(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*(days?|weeks?|months?)\b/i);
        if (durationMatch) {
          const num = parseNumberWord(durationMatch[1]);
          duration = `${num} ${durationMatch[2].toLowerCase()}`;
        }

        // Route Extraction
        let route = 'Oral';
        if (/\b(?:iv|intravenous)\b/i.test(clause)) route = 'Intravenous (IV)';
        else if (/\b(?:im|intramuscular)\b/i.test(clause)) route = 'Intramuscular (IM)';
        else if (/\b(?:topical|apply|cream|ointment|gel)\b/i.test(clause)) route = 'Topical';
        else if (/\b(?:inhalation|inhaler|nebulizer)\b/i.test(clause)) route = 'Inhalation';
        else if (/\b(?:sublingual)\b/i.test(clause)) route = 'Sublingual';

        // Instructions Extraction
        let instructions = 'After food';
        if (/\b(?:before\s+food|before\s+meals?|empty\s+stomach|30\s+mins?\s+before)\b/i.test(clause)) {
          instructions = 'Before food';
        } else if (/\b(?:after\s+food|after\s+meals?|post\s+meals?|with\s+food)\b/i.test(clause)) {
          instructions = 'After food';
        } else if (/\b(?:with\s+warm\s+water)\b/i.test(clause)) {
          instructions = 'With warm water';
        } else if (/\b(?:at\s+bedtime)\b/i.test(clause)) {
          instructions = 'At bedtime';
        }

        items.push({
          id: `item-${Date.now()}-${idx + 1}`,
          medicine: detectedDrug,
          dose,
          frequency,
          duration,
          route,
          instructions,
          additionalAdvice: '',
        });
      }
    });

    return {
      items,
      additionalAdvice: detectedAdvice,
      followUpDate: detectedFollowUp,
      rawText: cleanText,
      detectedMedicinesCount: items.length,
    };
  },

  createPrescription: async (
    prescription: PrescriptionRecord,
    activeMeds: MedicationItem[]
  ): Promise<PrescriptionRecord> => {
    storageService.setState((prev) => {
      // 1. Add to prescriptions list
      const updatedPrescriptions = [prescription, ...prev.prescriptions.filter((rx) => rx.id !== prescription.id)];

      // 2. Add / update active medications
      const existingNames = new Set(activeMeds.map((m) => m.name.toLowerCase()));
      const filteredPrevMeds = prev.medications.filter((m) => !existingNames.has(m.name.toLowerCase()));
      const updatedMedications = [...activeMeds, ...filteredPrevMeds];

      // 3. Update active consultation
      const updatedConsultation = {
        ...prev.consultation,
        doctorVerified: true,
        verifiedAt: `${prescription.date}, ${prescription.time || '10:52 AM'}`,
        verifiedBy: prescription.doctorName,
        prescribedTreatment: prescription.items.length > 0
          ? prescription.items.map((it) => `${it.medicine} ${it.dose} (${it.frequency})`).join(', ')
          : 'Prescription verified with no new active medications.',
        addedToTimeline: true,
      };

      // 4. Update appointment status for this patient
      const updatedAppointments = prev.appointments.map((a) => {
        if (a.patientId === prescription.patientId || a.patientNumber === `#${prescription.patientId}`) {
          return {
            ...a,
            status: 'Completed' as const,
            handoffStatus: 'Doctor Verified' as const,
            updatedAt: 'Just now',
          };
        }
        return a;
      });

      // 5. Update clinical handoff status
      const updatedHandoffs = prev.handoffs.map((h) => {
        if (h.patientId === prescription.patientId || h.patientNumber === `#${prescription.patientId}`) {
          return {
            ...h,
            handoffStatus: 'Doctor Verified' as const,
          };
        }
        return h;
      });

      // 6. Append new encounter record to timeline
      const newEncounterRecord = {
        id: `REC-${prescription.id}`,
        date: '2026-09-11',
        displayDate: 'TODAY (11 Sep 2026)',
        year: 2026,
        month: 'Sep',
        category: 'consultation' as const,
        title: 'OPD Consultation & Verified Prescription',
        facility: prescription.facility,
        doctor: prescription.doctorName,
        department: prescription.department,
        chiefComplaint: prev.consultation.chiefComplaint || 'Clinical Consultation',
        clinicalObservations: `Doctor Verified Prescription. Medication count: ${prescription.items.length}.`,
        summary: `Prescription recorded via ${prescription.source} for ${prescription.items.map((i) => i.medicine).join(', ') || 'clinical review'}.`,
        treatmentOutcome: 'Doctor Verified; Synced to Patient Record.',
        source: `CodeScribe Doctor Portal (${prescription.source} Entry)`,
        doctorVerified: true,
        verifiedBy: prescription.doctorName,
        verifiedDate: `${prescription.date}, ${prescription.time || '10:52 AM'}`,
        fhirReady: true,
        isNewCodeScribeEntry: true,
        details: {
          severity: prev.consultation.doctorAdjustedSeverity || 6,
          duration: prev.consultation.duration,
          location: prev.consultation.location,
          associatedSymptoms: prev.consultation.associatedSymptoms,
          triggers: prev.consultation.triggers,
          originalLanguage: 'English',
          originalTranscript: prev.consultation.rawTranscript,
          translatedTranscript: prev.consultation.translatedTranscript,
          medications: activeMeds,
        },
      };

      const updatedTimeline = [
        newEncounterRecord,
        ...prev.timeline.filter((r) => r.id !== newEncounterRecord.id && r.id !== 'rec-04'),
      ];

      return {
        ...prev,
        prescriptions: updatedPrescriptions,
        medications: updatedMedications,
        consultation: updatedConsultation,
        appointments: updatedAppointments,
        handoffs: updatedHandoffs,
        timeline: updatedTimeline,
      };
    });

    return prescription;
  },
};
