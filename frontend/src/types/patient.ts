export interface EmergencyContact {
  name: string;
  relationship?: string;
  relation?: string;
  phone: string;
}

export interface PatientProfile {
  _id: string;
  user?: any;
  fullName: string;
  email?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: string;
  bloodType?: string;
  chronicDiseases?: string[] | string;
  doctorNotes?: Array<{ doctor: any; notes: string }>;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  emergencyContact?: EmergencyContact;
  medicalHistory?: {
    allergies?: string[];
    medications?: string[];
  };
  medicalRecordNumber?: string;
}
