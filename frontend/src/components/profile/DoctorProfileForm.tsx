import type { FormEvent } from "react";
import { CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/date-picker";
import { User, Briefcase, Award, ChevronDown, Save } from "lucide-react";
import type { DoctorData } from "../../hooks/useProfile";

interface DoctorProfileFormProps {
  doctorData: DoctorData;
  submitting: boolean;
  onDoctorChange: (field: string, value: any) => void;
  onDoctorQualificationsChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function DoctorProfileForm({
  doctorData,
  submitting,
  onDoctorChange,
  onDoctorQualificationsChange,
  onSubmit,
}: DoctorProfileFormProps) {
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
              <Label htmlFor="doctor-name" className="text-xs font-bold text-[#0F172A]">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  id="doctor-name"
                  type="text"
                  placeholder="Dr. John Doe"
                  className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                  value={doctorData.fullName}
                  onChange={(e) => onDoctorChange("fullName", e.target.value)}
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5">
              <Label htmlFor="doctor-dob" className="text-xs font-bold text-[#0F172A]">
                Date of Birth
              </Label>
              <DatePicker
                id="doctor-dob"
                value={doctorData.dateOfBirth}
                onChange={(e) => onDoctorChange("dateOfBirth", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gender */}
            <div className="space-y-1.5">
              <Label htmlFor="doctor-gender" className="text-xs font-bold text-[#0F172A]">
                Gender
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Select
                  id="doctor-gender"
                  className="pl-10 pr-10 rounded-xl border-[#E2E8F0] bg-white text-sm py-2 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all appearance-none cursor-pointer h-10"
                  value={doctorData.gender}
                  onChange={(e) => onDoctorChange("gender", e.target.value)}
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
          </div>
        </div>

        {/* Part 2: Professional Details */}
        <div className="border-t border-slate-100 pt-5 space-y-4">
          <h3 className="text-sm font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-2">
            <Award size={16} />
            <span>2. Practice Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Specialization */}
            <div className="space-y-1.5">
              <Label htmlFor="doctor-spec" className="text-xs font-bold text-[#0F172A]">
                Specialization
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Select
                  id="doctor-spec"
                  className="pl-10 pr-10 rounded-xl border-[#E2E8F0] bg-white text-sm py-2 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all appearance-none cursor-pointer h-10"
                  value={doctorData.specialization}
                  onChange={(e) => onDoctorChange("specialization", e.target.value)}
                >
                  <option value="">Select Specialty</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Obstetrics and Gynecology">Obstetrics and Gynecology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Ophthalmology">Ophthalmology</option>
                  <option value="ENT (Otolaryngology)">ENT (Otolaryngology)</option>
                  <option value="Dental">Dental</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                </Select>
                <ChevronDown
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={14}
                />
              </div>
            </div>

            {/* Years of Experience */}
            <div className="space-y-1.5">
              <Label htmlFor="doctor-exp" className="text-xs font-bold text-[#0F172A]">
                Years of Experience
              </Label>
              <div className="relative">
                <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  id="doctor-exp"
                  type="number"
                  min="0"
                  max="60"
                  placeholder="10"
                  className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                  value={doctorData.yearsOfExperience}
                  onChange={(e) => onDoctorChange("yearsOfExperience", Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Qualifications */}
          <div className="space-y-1.5">
            <Label htmlFor="doctor-quals" className="text-xs font-bold text-[#0F172A]">
              Qualifications
            </Label>
            <div className="relative">
              <Award className="absolute left-3.5 top-3 text-slate-400" size={16} />
              <textarea
                id="doctor-quals"
                rows={2}
                placeholder="MBBS, MD - Cardiology, FACC (Comma-separated list)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 outline-none transition-all text-sm resize-none leading-relaxed"
                value={doctorData.qualificationsText}
                onChange={(e) => onDoctorQualificationsChange(e.target.value)}
              />
            </div>
            <p className="text-[10px] text-[#64748B] font-medium">
              Enter your professional titles/degrees separated by commas.
            </p>
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
          <span>{submitting ? "Saving Professional Changes..." : "Save Professional Profile"}</span>
        </Button>
      </CardFooter>
    </form>
  );
}
