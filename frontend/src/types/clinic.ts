export interface Clinic {
  _id: string;
  name: string;
  clinicNumber: string;
  specialty: string;
  description?: string;
  floor?: string;
  roomNumber?: string;
  location?: string;
  doctors?: any[];
}
