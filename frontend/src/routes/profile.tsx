import { createRoute, Link } from "@tanstack/react-router";
import { Card } from "../components/ui/card";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { rootRoute } from "./__root";
import { useProfile } from "../hooks/useProfile";
import { PatientProfileForm } from "../components/profile/PatientProfileForm";
import { DoctorProfileForm } from "../components/profile/DoctorProfileForm";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePageComponent,
});

function ProfilePageComponent() {
  const {
    user,
    authLoading,
    loading,
    submitting,
    error,
    success,
    patientData,
    doctorData,
    handlePatientChange,
    handlePatientNestedChange,
    handleDoctorChange,
    handleDoctorQualificationsChange,
    handlePatientSubmit,
    handleDoctorSubmit,
  } = useProfile();

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#2563EB]/25 border-t-[#2563EB] animate-spin" />
          <span className="text-sm font-semibold text-[#64748B]">Loading your profile details...</span>
        </div>
      </div>
    );
  }

  const isDoctor = user?.role === "doctor";
  const isPatient = user?.role === "patient";

  const displayName = isPatient
    ? patientData?.fullName
    : isDoctor
    ? doctorData?.fullName
    : user?.fullName || user?.name;

  const firstLetter = displayName && displayName.trim()
    ? displayName.trim()[0].toUpperCase()
    : "U";

  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF] to-[#E0F2FE] py-8 px-4 flex justify-center items-start">
      <div className="w-full max-w-2xl my-2">
        {/* Back Link */}
        <div className="flex items-center justify-between mb-5 px-2">
          <Link
            to="/app"
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#2563EB] bg-white border border-slate-100 hover:border-[#2563EB]/20 px-3.5 py-2 rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-100 px-3.5 py-2 rounded-xl shadow-sm">
            Account Settings
          </span>
        </div>

        <Card className="w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.06)] border-0 overflow-hidden">
          {/* Accent Header Banner */}
          <div
            className={`h-28 w-full relative ${
              isDoctor
                ? "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]"
                : isPatient
                ? "bg-gradient-to-r from-[#16A34A] to-[#15803D]"
                : "bg-gradient-to-r from-slate-700 to-slate-800"
            }`}
          >
            {/* Absolute positioned profile circle */}
            <div className="absolute -bottom-8 left-8 flex items-end gap-4">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-black border-4 border-white shadow-md ${
                  isDoctor
                    ? "bg-[#2563EB]"
                    : isPatient
                    ? "bg-[#16A34A]"
                    : "bg-slate-700"
                }`}
              >
                {firstLetter}
              </div>
              <div className="mb-1 bg-white px-3 py-1 rounded-xl shadow-sm border border-slate-100 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                {user?.role} Portal
              </div>
            </div>
          </div>

          <div className="pt-12 pb-5 px-8">
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
              Edit Profile Details
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              {isPatient
                ? "Manage your patient health profile, contact info, and address details."
                : "Manage your professional practice details, experience, qualifications, and specialties."}
            </p>
          </div>

          {/* Success / Error Alerts */}
          <div className="px-8 space-y-3">
            {error && (
              <div className="rounded-xl bg-[#DC2626]/5 p-4 text-xs font-bold text-[#DC2626] border border-[#DC2626]/10 flex items-center gap-2 animate-pulse">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="rounded-xl bg-[#16A34A]/5 p-4 text-xs font-bold text-[#16A34A] border border-[#16A34A]/10 flex items-center gap-2">
                <CheckCircle size={15} />
                <span>{success}</span>
              </div>
            )}
          </div>

          {/* Patient Form */}
          {isPatient && (
            <PatientProfileForm
              patientData={patientData}
              submitting={submitting}
              onPatientChange={handlePatientChange}
              onPatientNestedChange={handlePatientNestedChange}
              onSubmit={handlePatientSubmit}
            />
          )}

          {/* Doctor Form */}
          {isDoctor && (
            <DoctorProfileForm
              doctorData={doctorData}
              submitting={submitting}
              onDoctorChange={handleDoctorChange}
              onDoctorQualificationsChange={handleDoctorQualificationsChange}
              onSubmit={handleDoctorSubmit}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
