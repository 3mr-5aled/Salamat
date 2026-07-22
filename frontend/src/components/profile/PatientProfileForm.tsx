import type { FormEvent } from "react";
import { CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/date-picker";
import {
  User,
  Heart,
  MapPin,
  Building,
  Phone,
  Shield,
  ChevronDown,
  Mail,
  Save,
} from "lucide-react";
import type { PatientData } from "../../hooks/useProfile";

export const CHRONIC_DISEASES = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Chronic Kidney Disease",
  "Arthritis",
  "COPD",
  "Thyroid Disorder",
  "Migraine",
];

interface PatientProfileFormProps {
  patientData: PatientData;
  submitting: boolean;
  onPatientChange: (field: string, value: any) => void;
  onPatientNestedChange: (
    parent: "emergencyContact" | "address",
    field: string,
    value: string
  ) => void;
  onSubmit: (e: FormEvent) => void;
}

export function PatientProfileForm({
  patientData,
  submitting,
  onPatientChange,
  onPatientNestedChange,
  onSubmit,
}: PatientProfileFormProps) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <CardContent className="space-y-6 px-8 pb-6 pt-4">
        {/* Part 1: Personal Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-2">
            <User size={16} />
            <span>1. Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="patient-name" className="text-xs font-bold text-[#0F172A]">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  id="patient-name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                  value={patientData.fullName}
                  onChange={(e) => onPatientChange("fullName", e.target.value)}
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5">
              <Label htmlFor="patient-dob" className="text-xs font-bold text-[#0F172A]">
                Date of Birth
              </Label>
              <DatePicker
                id="patient-dob"
                value={patientData.dateOfBirth}
                onChange={(e) => onPatientChange("dateOfBirth", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gender */}
            <div className="space-y-1.5">
              <Label htmlFor="patient-gender" className="text-xs font-bold text-[#0F172A]">
                Gender
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Select
                  id="patient-gender"
                  className="pl-10 pr-10 rounded-xl border-[#E2E8F0] bg-white text-sm py-2 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all appearance-none cursor-pointer h-10"
                  value={patientData.gender}
                  onChange={(e) => onPatientChange("gender", e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>
                <ChevronDown
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={14}
                />
              </div>
            </div>

            {/* Blood Group */}
            <div className="space-y-1.5">
              <Label htmlFor="patient-blood" className="text-xs font-bold text-[#0F172A]">
                Blood Group
              </Label>
              <div className="relative">
                <Heart className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Select
                  id="patient-blood"
                  className="pl-10 pr-10 rounded-xl border-[#E2E8F0] bg-white text-sm py-2 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all appearance-none cursor-pointer h-10"
                  value={patientData.bloodType}
                  onChange={(e) => onPatientChange("bloodType", e.target.value)}
                >
                  <option value="">Don't specify</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </Select>
                <ChevronDown
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={14}
                />
              </div>
            </div>
          </div>

          {/* Predefined Chronic Diseases Checkboxes */}
          <div className="space-y-2">
            <Label htmlFor="patient-chronic" className="text-xs font-bold text-[#0F172A]">
              Chronic Diseases
            </Label>
            <input
              type="text"
              id="patient-chronic"
              className="sr-only"
              value={patientData.chronicDiseases}
              onChange={(e) => onPatientChange("chronicDiseases", e.target.value)}
              readOnly
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {CHRONIC_DISEASES.map((disease) => {
                const list = patientData.chronicDiseases
                  .split(",")
                  .map((d) => d.trim())
                  .filter((d) => d.length > 0);
                const isChecked = list.includes(disease);

                const handleCheckboxChange = (checked: boolean) => {
                  let newList = [...list];
                  if (checked) {
                    newList.push(disease);
                  } else {
                    newList = newList.filter((d) => d !== disease);
                  }
                  onPatientChange("chronicDiseases", newList.join(", "));
                };

                return (
                  <label
                    key={disease}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]/10"
                      checked={isChecked}
                      onChange={(e) => handleCheckboxChange(e.target.checked)}
                    />
                    <span>{disease}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Part 2: Emergency Contact */}
        <div className="border-t border-slate-100 pt-5 space-y-4">
          <h3 className="text-sm font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-2">
            <Shield size={16} />
            <span>2. Emergency Contact (Optional)</span>
          </h3>

          <div className="space-y-1.5">
            <Label htmlFor="patient-ec-name" className="text-xs font-bold text-[#0F172A]">
              Contact Name
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input
                id="patient-ec-name"
                placeholder="Jane Doe"
                className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                value={patientData.emergencyContact.name}
                onChange={(e) => onPatientNestedChange("emergencyContact", "name", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Relationship */}
            <div className="space-y-1.5">
              <Label htmlFor="patient-ec-rel" className="text-xs font-bold text-[#0F172A]">
                Relationship
              </Label>
              <div className="relative">
                <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  id="patient-ec-rel"
                  placeholder="Spouse, Parent, Sibling"
                  className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                  value={patientData.emergencyContact.relationship}
                  onChange={(e) =>
                    onPatientNestedChange("emergencyContact", "relationship", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="patient-ec-phone" className="text-xs font-bold text-[#0F172A]">
                Emergency Phone
              </Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  id="patient-ec-phone"
                  placeholder="+1 (555) 000-0000"
                  className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                  value={patientData.emergencyContact.phone}
                  onChange={(e) => onPatientNestedChange("emergencyContact", "phone", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Part 3: Address Details */}
        <div className="border-t border-slate-100 pt-5 space-y-4">
          <h3 className="text-sm font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-2">
            <MapPin size={16} />
            <span>3. Address Details (Optional)</span>
          </h3>

          {/* Street */}
          <div className="space-y-1.5">
            <Label htmlFor="patient-addr-street" className="text-xs font-bold text-[#0F172A]">
              Street Address
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input
                id="patient-addr-street"
                placeholder="123 Health Ave"
                className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                value={patientData.address.street}
                onChange={(e) => onPatientNestedChange("address", "street", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* City */}
            <div className="space-y-1.5">
              <Label htmlFor="patient-addr-city" className="text-xs font-bold text-[#0F172A]">
                City
              </Label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  id="patient-addr-city"
                  placeholder="Boston"
                  className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                  value={patientData.address.city}
                  onChange={(e) => onPatientNestedChange("address", "city", e.target.value)}
                />
              </div>
            </div>

            {/* Zip Code */}
            <div className="space-y-1.5">
              <Label htmlFor="patient-addr-zip" className="text-xs font-bold text-[#0F172A]">
                Zip / Postal Code
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  id="patient-addr-zip"
                  placeholder="02115"
                  className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                  value={patientData.address.zipCode}
                  onChange={(e) => onPatientNestedChange("address", "zipCode", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer Submit Button */}
      <CardFooter className="px-8 pb-10 pt-2">
        <Button
          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl py-3 font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.15)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          type="submit"
          disabled={submitting}
        >
          <Save size={18} />
          <span>{submitting ? "Saving Profile Changes..." : "Save Profile Details"}</span>
        </Button>
      </CardFooter>
    </form>
  );
}
