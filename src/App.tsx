import { useState, useEffect } from 'react';
import type {
  HealthRecord,
  MedicationItem,
  PrescriptionRecord,
  ActiveConsultation,
} from './types/health';
import { storageService, type DoctorPortalState } from './services/storageService';
import { prescriptionService } from './services/prescriptionService';
import { consultationService } from './services/consultationService';
import { recordService } from './services/recordService';
import { INITIAL_HEALTH_IDENTITY } from './mock/healthStore';
import { DoctorWorkstation } from './components/doctor/DoctorWorkstation';

export function App() {
  const [storeState, setStoreState] = useState<DoctorPortalState>(() => storageService.getState());
  const [identity] = useState(INITIAL_HEALTH_IDENTITY);

  // Subscribe to storage updates for real-time reactivity across all components & tabs
  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setStoreState(storageService.getState());
    });
    return unsubscribe;
  }, []);

  // Reset demo state
  const handleResetDemo = () => {
    storageService.resetDemoData();
  };

  // Commit verified record to longitudinal timeline
  const handleCommitVerifiedRecord = (newRecord: HealthRecord) => {
    recordService.addRecord(newRecord);
  };

  // When a prescription is confirmed by the doctor
  const handleSavePrescription = (
    newPrescription: PrescriptionRecord,
    newActiveMeds: MedicationItem[]
  ) => {
    prescriptionService.createPrescription(newPrescription, newActiveMeds);
  };

  // Update active consultation
  const handleUpdateConsultCase = (updated: ActiveConsultation) => {
    consultationService.updateConsultation(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <DoctorWorkstation
        consultCase={storeState.consultation}
        timeline={storeState.timeline}
        identity={identity}
        patients={storeState.patients}
        medications={storeState.medications}
        prescriptions={storeState.prescriptions}
        appointments={storeState.appointments}
        departments={storeState.departments}
        symptomsHistory={storeState.symptomsHistory}
        facilitiesHistory={storeState.facilitiesHistory}
        previousConditions={storeState.previousConditions}
        documents={storeState.documents}
        consent={storeState.consent}
        accessLogs={storeState.accessLogs}
        doctorProfile={storeState.doctorProfile}
        onUpdateConsultCase={handleUpdateConsultCase}
        onVerifyAndAddToTimeline={handleCommitVerifiedRecord}
        onSavePrescription={handleSavePrescription}
        onResetDemo={handleResetDemo}
      />
    </div>
  );
}

export default App;

