import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormHandleSubmit,
} from "react-hook-form";
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
  Globe,
  Flag,
  Phone,
  Shield,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Mail,
} from "lucide-react";
import {
  CHRONIC_DISEASES,
  type ProfileFormValues,
} from "../../hooks/useProfileSetup";

export interface ProfileSetupFormProps {
  register: UseFormRegister<ProfileFormValues>;
  handleSubmit: UseFormHandleSubmit<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
  isSubmitting: boolean;
  setValue: UseFormSetValue<ProfileFormValues>;
  watchChronicDiseases: string;
  error: string | null;
  onSubmit: (data: ProfileFormValues) => Promise<void>;
}

export function ProfileSetupForm({
  register,
  handleSubmit,
  errors,
  isSubmitting,
  setValue,
  watchChronicDiseases,
  error,
  onSubmit,
}: ProfileSetupFormProps) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <CardContent className="space-y-6 px-8 pb-6">
        {error && (
          <div className="rounded-xl bg-[#DC2626]/5 p-4 text-sm font-semibold text-[#DC2626] border border-[#DC2626]/10 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Part 1: Personal Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#2563EB] uppercase tracking-wider">
            1. Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="dob" className="text-xs font-bold text-[#0F172A]">
                Date of Birth
              </Label>
              <DatePicker id="dob" {...register("dateOfBirth")} />
              {errors.dateOfBirth && (
                <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  <span>{errors.dateOfBirth.message}</span>
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <Label htmlFor="gender" className="text-xs font-bold text-[#0F172A]">
                Gender
              </Label>
              <div className="relative">
                <User
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <Select
                  id="gender"
                  className="pl-10 pr-10 rounded-xl border-[#E2E8F0] bg-white text-sm py-2 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all appearance-none cursor-pointer h-10"
                  {...register("gender")}
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

          {/* Blood Group */}
          <div className="space-y-1.5">
            <Label htmlFor="blood" className="text-xs font-bold text-[#0F172A]">
              Blood Group
            </Label>
            <div className="relative">
              <Heart
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <Select
                id="blood"
                className="pl-10 pr-10 rounded-xl border-[#E2E8F0] bg-white text-sm py-2 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all appearance-none cursor-pointer h-10"
                {...register("bloodType")}
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

          {/* Predefined Chronic Diseases Checkboxes */}
          <div className="space-y-2">
            <Label htmlFor="chronicDiseases" className="text-xs font-bold text-[#0F172A]">
              Chronic Diseases
            </Label>
            <input
              type="text"
              id="chronicDiseases"
              className="sr-only"
              {...register("chronicDiseases")}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {CHRONIC_DISEASES.map((disease) => {
                const list = watchChronicDiseases
                  .split(",")
                  .map((d) => d.trim())
                  .filter(Boolean);
                const isChecked = list.includes(disease);

                return (
                  <label
                    key={disease}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={disease}
                      className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]/10"
                      checked={isChecked}
                      onChange={(e) => {
                        let newList = [...list];
                        if (e.target.checked) {
                          newList.push(disease);
                        } else {
                          newList = newList.filter((d) => d !== disease);
                        }
                        setValue("chronicDiseases", newList.join(", "));
                      }}
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
          <h3 className="text-sm font-bold text-[#2563EB] uppercase tracking-wider">
            2. Emergency Contact
          </h3>

          <div className="space-y-1.5">
            <Label htmlFor="ec-name" className="text-xs font-bold text-[#0F172A]">
              Name
            </Label>
            <div className="relative">
              <User
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <Input
                id="ec-name"
                placeholder="Jane Doe"
                className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                {...register("emergencyContact.name")}
              />
            </div>
            {errors.emergencyContact?.name && (
              <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1 font-medium">
                <AlertCircle size={12} />
                <span>{errors.emergencyContact.name.message}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Relationship */}
            <div className="space-y-1.5">
              <Label htmlFor="ec-rel" className="text-xs font-bold text-[#0F172A]">
                Relationship
              </Label>
              <div className="relative">
                <Shield
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <Input
                  id="ec-rel"
                  placeholder="Spouse, Parent, Sibling"
                  className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                  {...register("emergencyContact.relationship")}
                />
              </div>
              {errors.emergencyContact?.relationship && (
                <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  <span>{errors.emergencyContact.relationship.message}</span>
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="ec-phone" className="text-xs font-bold text-[#0F172A]">
                Emergency Phone
              </Label>
              <div className="relative">
                <Phone
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <Input
                  id="ec-phone"
                  placeholder="+1 (555) 000-0000"
                  className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                  {...register("emergencyContact.phone")}
                />
              </div>
              {errors.emergencyContact?.phone && (
                <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  <span>{errors.emergencyContact.phone.message}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Part 3: Address Details */}
        <div className="border-t border-slate-100 pt-5 space-y-4">
          <h3 className="text-sm font-bold text-[#2563EB] uppercase tracking-wider">
            3. Address Details
          </h3>

          {/* Street */}
          <div className="space-y-1.5">
            <Label htmlFor="addr-street" className="text-xs font-bold text-[#0F172A]">
              Street Address
            </Label>
            <div className="relative">
              <MapPin
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <Input
                id="addr-street"
                placeholder="123 Health Ave"
                className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                {...register("address.street")}
              />
            </div>
            {errors.address?.street && (
              <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1 font-medium">
                <AlertCircle size={12} />
                <span>{errors.address.street.message}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* City */}
            <div className="space-y-1.5">
              <Label htmlFor="addr-city" className="text-xs font-bold text-[#0F172A]">
                City
              </Label>
              <div className="relative">
                <Building
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <Input
                  id="addr-city"
                  placeholder="Boston"
                  className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                  {...register("address.city")}
                />
              </div>
              {errors.address?.city && (
                <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  <span>{errors.address.city.message}</span>
                </p>
              )}
            </div>

            {/* State */}
            <div className="space-y-1.5">
              <Label htmlFor="addr-state" className="text-xs font-bold text-[#0F172A]">
                State / Province
              </Label>
              <div className="relative">
                <Globe
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <Input
                  id="addr-state"
                  placeholder="MA"
                  className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                  {...register("address.state")}
                />
              </div>
              {errors.address?.state && (
                <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  <span>{errors.address.state.message}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Zip */}
            <div className="space-y-1.5">
              <Label htmlFor="addr-zip" className="text-xs font-bold text-[#0F172A]">
                Zip / Postal Code
              </Label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <Input
                  id="addr-zip"
                  placeholder="02115"
                  className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                  {...register("address.zipCode")}
                />
              </div>
              {errors.address?.zipCode && (
                <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  <span>{errors.address.zipCode.message}</span>
                </p>
              )}
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <Label htmlFor="addr-country" className="text-xs font-bold text-[#0F172A]">
                Country
              </Label>
              <div className="relative">
                <Flag
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <Input
                  id="addr-country"
                  placeholder="United States"
                  className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                  {...register("address.country")}
                />
              </div>
              {errors.address?.country && (
                <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  <span>{errors.address.country.message}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-8 pb-10 pt-2">
        <Button
          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl py-3 font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.15)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          type="submit"
          disabled={isSubmitting}
        >
          <span>{isSubmitting ? "Saving Profile..." : "Submit Profile"}</span>
          {!isSubmitting && <CheckCircle size={18} />}
        </Button>
      </CardFooter>
    </form>
  );
}
