export interface PrescriptionItem {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface PatientRegistration {
  _id?: string;
  patientId: any;
  registrationStatus: "pending" | "approved" | "rejected";
  registeredAt?: string;
  approvedAt?: string;
  rejectionReason?: string;
  symptoms?: string;
}

export interface AppointmentSlot {
  _id: string;
  doctor: any;
  clinic?: any;
  date: string;
  time: string;
  duration: number;
  type?: "regular" | "emergency" | "surgery" | "follow-up";
  status: "Scheduled" | "Completed" | "Cancelled";
  NumberOfPatients?: number;
  MaxNumberOfPatients?: number;
  IsFull?: boolean;
  notes?: string;
  patient?: PatientRegistration[];
}

export interface MappedPatientBooking {
  appointmentId: string;
  doctor: any;
  clinic: any;
  date: string;
  time: string;
  duration: number;
  notes?: string;
  status: string;
  registrationStatus: string;
  registeredAt?: string;
  approvedAt?: string;
  rejectionReason?: string;
  symptoms?: string;
}
