export interface DoctorProfile {
  _id: string;
  user?: any;
  fullName: string;
  email?: string;
  phone?: string;
  specialization: string;
  yearsOfExperience?: number;
  experience?: number;
  qualifications?: string[];
  clinic?: any;
  gender?: string;
  dateOfBirth?: string;
}
