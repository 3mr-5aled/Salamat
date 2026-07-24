import React, { useState } from "react";
import {
  CalendarCheck,
  Award,
  Heart,
  Search,
  CalendarDays,
  Calendar,
  Briefcase,
  Clock,
  FileText,
  XCircle,
  Baby,
  Brain,
  Eye,
  Smile,
  Stethoscope,
  Sparkles,
  Shield,
  Activity,
  ArrowLeft,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import MedicalNotesDisplay from "../MedicalNotesDisplay";
import { WELLNESS_TIPS } from "../../lib/wellnessTips";
import { formatTimeInterval } from "../../lib/formatters";
import { useProfile } from "../../hooks/useProfile";
import { PatientProfileForm } from "../profile/PatientProfileForm";
import type { usePatientDashboard } from "../../hooks/usePatientDashboard";

const SPECIALTY_MAP: Record<
  string,
  { icon: React.ComponentType<any>; color: string; bg: string; border: string }
> = {
  Cardiology: { icon: Heart, color: "#E11D48", bg: "#FFF1F2", border: "#FFE4E6" },
  Pediatrics: { icon: Baby, color: "#D97706", bg: "#FEF3C7", border: "#FDE68A" },
  Orthopedics: { icon: Activity, color: "#0284C7", bg: "#F0F9FF", border: "#E0F2FE" },
  Oncology: { icon: Shield, color: "#4F46E5", bg: "#EEF2FF", border: "#E0E7FF" },
  Neurology: { icon: Brain, color: "#7C3AED", bg: "#F5F3FF", border: "#EDE9FE" },
  "Obstetrics and Gynecology": { icon: Sparkles, color: "#DB2777", bg: "#FDF2F8", border: "#FCE7F3" },
  Dermatology: { icon: Sparkles, color: "#0D9488", bg: "#F0FDFA", border: "#CCFBF1" },
  Ophthalmology: { icon: Eye, color: "#059669", bg: "#ECFDF5", border: "#D1FAE5" },
  Dental: { icon: Smile, color: "#0891B2", bg: "#ECFEFF", border: "#CFFAFE" },
  "Internal Medicine": { icon: Stethoscope, color: "#475569", bg: "#F8FAFC", border: "#F1F5F9" },
  "ENT (Otolaryngology)": { icon: Stethoscope, color: "#2563EB", bg: "#EFF6FF", border: "#DBEAFE" },
};

const getSpecialtyData = (spec: string) => {
  const normalized = spec.trim().toLowerCase();
  for (const [key, value] of Object.entries(SPECIALTY_MAP)) {
    if (key.toLowerCase() === normalized) {
      return value;
    }
  }
  return { icon: Stethoscope, color: "#2563EB", bg: "#EFF6FF", border: "#DBEAFE" };
};

const formatAvailability = (availability: any[]) => {
  if (!availability || availability.length === 0) return "No set schedule";

  const convertTo12Hour = (timeStr: string) => {
    if (!timeStr) return "";
    const [hoursStr, minutesStr] = timeStr.split(":");
    let hours = parseInt(hoursStr, 10);
    const minutes = minutesStr;
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const dayAbbreviationMap: Record<string, string> = {
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
  };

  return availability
    .map((slot) => {
      const day = slot.dayOfWeek ? (dayAbbreviationMap[slot.dayOfWeek.toLowerCase()] || slot.dayOfWeek) : "";
      const start = convertTo12Hour(slot.startTime);
      const end = convertTo12Hour(slot.endTime);
      return `${day} ${start} to ${end}`;
    })
    .join(", ");
};

interface PatientTabsProps {
  patient: ReturnType<typeof usePatientDashboard>;
  user: any;
}

export const PatientTabs: React.FC<PatientTabsProps> = ({ patient, user }) => {
  const {
    activeTab,
    setActiveTab,
    doctors,
    searchDoc,
    setSearchDoc,
    selectedDoc,
    slotDateFilter,
    setSlotDateFilter,
    docSlots,
    bookingMsg,
    setSymptoms,
    bookings,
    setBookingSlot,
    setViewingPrescription,
    cancelError,
    cancelSuccess,
    patientArchivedOpen,
    setPatientArchivedOpen,
    tipIndex,
    handleSelectDoctor,
    handleCancel,
  } = patient as any;

  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  // Get unique specialties present in all doctors
  const uniqueSpecialties = Array.from(
    new Set(doctors.map((d: any) => d.specialization || d.specialty).filter(Boolean) as string[])
  ).sort();

  // Filter doctors based on selected category/specialty
  const filteredDoctors = doctors.filter((doc: any) => {
    if (!selectedSpecialty) return true;
    const spec = doc.specialization || doc.specialty || "";
    return spec.toLowerCase() === selectedSpecialty.toLowerCase();
  });

  return (
    <>
      {activeTab === "overview" && (
        <div className="space-y-8 max-w-5xl">
          <div>
            <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">
              Welcome back, {user?.name}
            </h2>
            <p className="text-sm text-[#64748B] mt-1.5">
              Access your medical appointments, specialist care, and wellness updates in one place.
            </p>
          </div>

          {/* Daily Wellness Tip Card */}
          {(() => {
            const currentTip = WELLNESS_TIPS[tipIndex] || WELLNESS_TIPS[0];
            return (
              <section
                aria-label="Daily Health and Wellness Insight"
                role="region"
                className="bg-gradient-to-br from-[#1E40AF] via-[#1D4ED8] to-[#1E3A8A] rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-[#1D4ED8]/20 relative overflow-hidden border border-blue-400/20"
              >
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 space-y-4 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold tracking-wide uppercase border border-white/25 text-white shadow-sm">
                    <span role="img" aria-hidden="true" className="text-base">{currentTip.icon}</span>
                    <span>{currentTip.category} Wellness Insight</span>
                  </div>
                  
                  <blockquote className="text-lg md:text-2xl font-bold leading-relaxed text-white tracking-tight">
                    "{currentTip.tip}"
                  </blockquote>
                  
                  <p className="text-xs text-blue-100 font-medium leading-relaxed pt-1 flex items-center gap-2">
                    <Heart size={14} className="text-rose-300 shrink-0" aria-hidden="true" />
                    <span>Tip updates automatically each day. Stay proactive about your health goals.</span>
                  </p>
                </div>
              </section>
            );
          })()}

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-start gap-4">
              <div className="p-3 bg-[#2563EB]/5 rounded-xl text-[#2563EB]">
                <CalendarCheck size={24} />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Active Bookings
                </span>
                <h3 className="text-3xl font-bold text-[#0F172A]">
                  {bookings.filter((b: any) => b.status !== "Completed" && b.status !== "Cancelled").length}
                </h3>
                <p className="text-[11px] text-[#64748B]">Scheduled consultations</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-start gap-4">
              <div className="p-3 bg-[#14B8A6]/5 rounded-xl text-[#14B8A6]">
                <Award size={24} />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Registered Clinics
                </span>
                <h3 className="text-3xl font-bold text-[#0F172A]">1</h3>
                <p className="text-[11px] text-[#64748B]">Active health branch</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-start gap-4">
              <div className="p-3 bg-indigo-500/5 rounded-xl text-indigo-500">
                <Heart size={24} />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Health Records
                </span>
                <h3 className="text-3xl font-bold text-[#0F172A]">
                  {bookings.filter((b: any) => b.status === "Completed").length}
                </h3>
                <p className="text-[11px] text-[#64748B]">Completed visits</p>
              </div>
            </div>
          </div>

          {/* Quick Action Cards */}
          <Card className="rounded-2xl border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-50 p-6">
              <CardTitle className="text-lg font-bold text-[#0F172A]">
                Need to see a Doctor?
              </CardTitle>
              <CardDescription className="text-sm text-[#64748B]">
                Find top-rated specialists, check available consultation hours, and book instant appointment slots.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => setActiveTab("find-doctor")}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl px-5 py-2.5 font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.15)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)] transition-all cursor-pointer"
                >
                  Find a Doctor
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("bookings")}
                  className="border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50 rounded-xl px-5 py-2.5 font-semibold transition-all cursor-pointer"
                >
                  View Registered Bookings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "find-doctor" && (
        <div className="space-y-6 max-w-5xl">
          {!selectedDoc ? (
            <>
              {/* Header / Search Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                    Book an Appointment
                  </h2>
                  <p className="text-sm text-[#64748B]">
                    Search specialists by name, specialty, or clinic to view consultation hours.
                  </p>
                </div>

                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input
                    placeholder="Search doctors, specialty, or clinic..."
                    className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2.5"
                    value={searchDoc}
                    onChange={(e) => setSearchDoc(e.target.value)}
                  />
                </div>
              </div>

              {/* Clinic Specialty Categories (Horizontal Scroll) */}
              {uniqueSpecialties.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider px-1">
                    Filter by Specialty
                  </Label>
                  <div
                    className="flex gap-3 overflow-x-auto pb-3 pt-1 -mx-6 px-6 md:-mx-8 md:px-8 scrollbar-none"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {/* "All" Specialties filter option */}
                    <button
                      onClick={() => setSelectedSpecialty(null)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border text-xs font-bold whitespace-nowrap cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95 shrink-0 snap-start bg-white shadow-[0_4px_12px_rgba(0,0,0,0.015)] border-slate-100/80 hover:border-slate-200"
                      style={{
                        backgroundColor: selectedSpecialty === null ? "#EFF6FF" : undefined,
                        borderColor: selectedSpecialty === null ? "#2563EB" : undefined,
                        color: selectedSpecialty === null ? "#2563EB" : "#475569",
                        boxShadow: selectedSpecialty === null ? "0 10px 20px -5px rgba(37,99,235,0.2)" : undefined,
                      }}
                    >
                      <div
                        className="p-1.5 rounded-lg flex items-center justify-center transition-colors"
                        style={{
                          backgroundColor: selectedSpecialty === null ? "#FFFFFF" : "#EFF6FF",
                          color: "#2563EB",
                        }}
                      >
                        <Stethoscope size={16} />
                      </div>
                      <span>All Specialties</span>
                    </button>

                    {uniqueSpecialties.map((spec) => {
                      const mapData = getSpecialtyData(spec);
                      const IconComp = mapData.icon;
                      const isActive = selectedSpecialty?.toLowerCase() === spec.toLowerCase();

                      return (
                        <button
                          key={spec}
                          onClick={() => setSelectedSpecialty(isActive ? null : spec)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border text-xs font-bold whitespace-nowrap cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95 shrink-0 snap-start bg-white shadow-[0_4px_12px_rgba(0,0,0,0.015)] border-slate-100/80 hover:border-slate-200"
                          style={{
                            backgroundColor: isActive ? mapData.bg : undefined,
                            borderColor: isActive ? mapData.color : undefined,
                            color: isActive ? mapData.color : "#475569",
                            boxShadow: isActive ? `0 10px 20px -5px ${mapData.color}25` : undefined,
                          }}
                        >
                          <div
                            className="p-1.5 rounded-lg flex items-center justify-center transition-colors"
                            style={{
                              backgroundColor: isActive ? "#FFFFFF" : mapData.bg,
                              color: mapData.color,
                            }}
                          >
                            <IconComp size={16} />
                          </div>
                          <span>{spec}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Doctors Grid */}
              {filteredDoctors.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                  {filteredDoctors.map((doc: any) => (
                    <Card
                      key={doc._id}
                      className="rounded-2xl border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col justify-between overflow-hidden bg-white"
                    >
                      <CardHeader className="p-6 pb-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-lg font-bold text-[#0F172A]">
                              {doc.fullName || doc.user?.name || "Dr. Care"}
                            </CardTitle>
                            {(() => {
                              const specName = doc.specialization || doc.specialty || "Specialist";
                              const specData = getSpecialtyData(specName);
                              const SpecIcon = specData.icon;
                              return (
                                <span
                                  className="inline-flex items-center gap-1.5 mt-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border"
                                  style={{
                                    backgroundColor: specData.bg,
                                    color: specData.color,
                                    borderColor: specData.border,
                                  }}
                                >
                                  <SpecIcon size={12} style={{ color: specData.color }} />
                                  <span>{specName}</span>
                                </span>
                              );
                            })()}
                          </div>
                          <div className="w-10 h-10 rounded-full bg-[#2563EB]/5 flex items-center justify-center text-[#2563EB]">
                            <Award size={20} />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 pt-0 flex flex-col gap-4">
                        {doc.clinic?.name && (
                          <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                            <Award size={14} className="text-[#2563EB]" />
                            <span>{doc.clinic.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
                          <Briefcase size={14} className="text-slate-400" />
                          <span>{doc.experience || doc.yearsOfExperience || 0} years medical experience</span>
                        </div>

                        {/* Availability Small Cards Grid */}
                        {doc.availability && doc.availability.length > 0 && (
                          <div className="space-y-2 mt-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                              <Clock size={14} className="text-[#2563EB]" />
                              <span>Weekly Schedule</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {doc.availability.map((avail: any, idx: number) => {
                                const convertTo12Hour = (timeStr: string) => {
                                  if (!timeStr) return "";
                                  const [hoursStr, minutesStr] = timeStr.split(":");
                                  let hours = parseInt(hoursStr, 10);
                                  const ampm = hours >= 12 ? "PM" : "AM";
                                  hours = hours % 12;
                                  hours = hours ? hours : 12;
                                  return `${hours}:${minutesStr} ${ampm}`;
                                };
                                const dayMap: Record<string, string> = {
                                  monday: "Mon",
                                  tuesday: "Tue",
                                  wednesday: "Wed",
                                  thursday: "Thu",
                                  friday: "Fri",
                                  saturday: "Sat",
                                  sunday: "Sun",
                                };
                                const dayLabel = dayMap[avail.dayOfWeek?.toLowerCase()] || avail.dayOfWeek;
                                return (
                                  <div
                                    key={idx}
                                    className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-xl flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.005)]"
                                  >
                                    <span className="text-[10px] font-bold uppercase text-[#2563EB] tracking-wide">
                                      {dayLabel}
                                    </span>
                                    <span className="text-[10px] font-semibold text-[#64748B]">
                                      {convertTo12Hour(avail.startTime)} - {convertTo12Hour(avail.endTime)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <Button
                          size="sm"
                          onClick={() => handleSelectDoctor(doc)}
                          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl py-2.5 font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.1)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.2)] transition-all cursor-pointer mt-2"
                        >
                          View Slots
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-md mx-auto my-6 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-4">
                    <Search size={32} />
                  </div>
                  <h3 className="font-bold text-lg text-[#0F172A] mb-2">No Doctors Found</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    {selectedSpecialty
                      ? `No specialists found in "${selectedSpecialty}". Try selecting another category.`
                      : searchDoc
                      ? `No doctor or specialty matches "${searchDoc}". Try searching another name or specialty.`
                      : "No medical specialists are currently registered in the system."}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Collapsed Back Button & Doctor Compact Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
                <div>
                  <Button
                    onClick={() => handleSelectDoctor(null)}
                    variant="outline"
                    className="rounded-xl border-slate-200 text-xs font-semibold px-4 py-2 hover:bg-slate-50 flex items-center gap-1.5 w-fit cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Doctors List</span>
                  </Button>
                </div>
                {(() => {
                  const specName = selectedDoc.specialization || selectedDoc.specialty || "Specialist";
                  const specData = getSpecialtyData(specName);
                  const SpecIcon = specData.icon;
                  return (
                    <div className="flex items-center gap-3">
                      <div className="text-right sm:text-right text-left">
                        <h4 className="text-sm font-bold text-[#0F172A]">
                          {selectedDoc.fullName || selectedDoc.user?.name}
                        </h4>
                        <p className="text-[10px] text-[#64748B] font-semibold">
                          {selectedDoc.clinic?.name || "Clinic Specialist"}
                        </p>
                      </div>
                      <span
                        className="inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border"
                        style={{
                          backgroundColor: specData.bg,
                          color: specData.color,
                          borderColor: specData.border,
                        }}
                      >
                        <SpecIcon size={10} style={{ color: specData.color }} />
                        <span>{specName}</span>
                      </span>
                    </div>
                  );
                })()}
              </div>
            </>
          )}

          {bookingMsg && (
            <div className="bg-[#2563EB]/10 border border-[#2563EB]/20 text-sm font-medium text-[#2563EB] p-4 rounded-xl flex items-center gap-2">
              <CalendarCheck size={18} />
              <span>{bookingMsg}</span>
            </div>
          )}

          {/* Booking Drawer/Card */}
          {selectedDoc && (
            <Card className="mt-8 rounded-3xl border-slate-100 shadow-[0_15px_45px_rgba(37,99,235,0.05)] bg-white overflow-hidden">
              <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/50">
                <CardTitle className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                  <Calendar size={18} className="text-[#2563EB]" />
                  Schedule with {selectedDoc.fullName || selectedDoc.user?.name}
                </CardTitle>
                {selectedDoc.availability && selectedDoc.availability.length > 0 && (
                  <CardDescription className="text-xs text-[#64748B] mt-1 font-semibold flex items-center gap-1.5 pl-6">
                    <Clock size={12} className="text-[#2563EB]" />
                    <span>Weekly Schedule: {formatAvailability(selectedDoc.availability)}</span>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Step 1: Select Date of Appointment */}
                {(() => {
                  const uniqueSlotDates: string[] = (() => {
                    const days = [];
                    const now = new Date();
                    for (let i = 0; i < 5; i++) {
                      const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
                      days.push(d.toISOString().split("T")[0]);
                    }
                    return days;
                  })();

                  const getDayLabel = (dStr: string) => {
                    const todayStr = new Date().toISOString().split("T")[0];
                    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                    const tomorrowStr = tomorrow.toISOString().split("T")[0];

                    if (dStr === todayStr) return "Today";
                    if (dStr === tomorrowStr) return "Tomorrow";

                    return new Date(dStr + "T00:00:00").toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      weekday: "short",
                    });
                  };

                  return (
                    <div className="space-y-3 pb-4 border-b border-slate-100">
                      <Label className="text-xs font-bold text-[#0F172A] block uppercase tracking-wider">
                        1. Select Date of Appointment
                      </Label>
                      <div className="flex flex-wrap items-center gap-2">
                        <Input
                          type="date"
                          value={slotDateFilter}
                          onChange={(e) => setSlotDateFilter(e.target.value)}
                          className="w-44 rounded-xl border-slate-200 text-xs h-9 focus:border-[#2563EB]"
                        />
                        {slotDateFilter && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSlotDateFilter("")}
                            className="h-9 px-3 text-xs text-slate-600 rounded-xl cursor-pointer"
                          >
                            All Dates
                          </Button>
                        )}
                        {uniqueSlotDates.map((dStr: any) => (
                          <Button
                            key={dStr}
                            type="button"
                            variant={slotDateFilter === dStr ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSlotDateFilter(dStr)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              slotDateFilter === dStr
                                ? "bg-[#2563EB] text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 border-0 hover:bg-slate-200"
                            }`}
                          >
                            {getDayLabel(dStr)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Step 2: Choose Preferred Slot */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-[#0F172A] block uppercase tracking-wider">
                    2. Choose Preferred Slot {slotDateFilter ? `for ${new Date(slotDateFilter).toLocaleDateString()}` : "(All Available Dates)"}
                  </Label>
                  {(() => {
                    const now = new Date();
                    const filteredDocSlots = docSlots.filter((slot: any) => {
                      // Don't show past slots
                      const [slotHour, slotMin] = (slot.time || "00:00").split(":").map(Number);
                      const slotStart = new Date(slot.date);
                      slotStart.setHours(slotHour, slotMin, 0, 0);
                      if (slotStart < now) {
                        return false;
                      }
                      if (!slotDateFilter) return true;
                      const dStr = new Date(slot.date).toISOString().split("T")[0];
                      return dStr === slotDateFilter;
                    });

                    if (filteredDocSlots.length === 0) {
                      return (
                        <div className="p-8 bg-slate-50 border border-slate-100 rounded-2xl text-center text-xs text-slate-500 font-medium">
                          {slotDateFilter
                            ? `No available slots on ${new Date(slotDateFilter).toLocaleDateString()}. Please select another date.`
                            : "No consultation slots available for this doctor."}
                        </div>
                      );
                    }

                    const intervalGroups = [
                      {
                        label: "🌅 Morning Shift (08:00 - 12:00)",
                        slots: filteredDocSlots.filter((s: any) => {
                          const h = parseInt(s.time?.split(":")[0] || "0", 10);
                          return h < 12;
                        }),
                      },
                      {
                        label: "☀️ Afternoon Shift (12:00 - 17:00)",
                        slots: filteredDocSlots.filter((s: any) => {
                          const h = parseInt(s.time?.split(":")[0] || "0", 10);
                          return h >= 12 && h < 17;
                        }),
                      },
                      {
                        label: "🌙 Evening Shift (17:00 - 22:00)",
                        slots: filteredDocSlots.filter((s: any) => {
                          const h = parseInt(s.time?.split(":")[0] || "0", 10);
                          return h >= 17;
                        }),
                      },
                    ].filter((g) => g.slots.length > 0);

                    return (
                      <div className="space-y-6">
                        {intervalGroups.map((group, idx) => (
                          <div key={idx} className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100">
                              <span>{group.label}</span>
                              <span className="text-[10px] text-slate-500 font-semibold">{group.slots.length} available</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              {group.slots.map((slot: any) => {
                                const isFull = slot.IsFull || (slot.NumberOfPatients >= slot.MaxNumberOfPatients);
                                const existingBooking = bookings.find(
                                  (b: any) =>
                                    b.appointmentId === slot._id &&
                                    (b.registrationStatus === "pending" || b.registrationStatus === "approved")
                                );
                                const [slotHour, slotMin] = (slot.time || "00:00").split(":").map(Number);
                                const slotStart = new Date(slot.date);
                                slotStart.setHours(slotHour, slotMin, 0, 0);
                                const isPast = slotStart < new Date();
                                return (
                                  <div
                                    key={slot._id}
                                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                                      isFull || isPast
                                        ? "bg-slate-50 border-slate-100 opacity-60"
                                        : "bg-white border-[#E2E8F0] hover:border-[#2563EB] hover:shadow-[0_4px_20px_rgba(37,99,235,0.05)]"
                                    }`}
                                  >
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-[#2563EB]">{formatTimeInterval(slot.time, slot.duration)}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                          slot.type === "emergency"
                                            ? "bg-red-500/10 text-red-500"
                                            : slot.type === "surgery"
                                            ? "bg-amber-500/10 text-amber-500"
                                            : "bg-slate-100 text-slate-600"
                                        }`}>
                                          {slot.type}
                                        </span>
                                      </div>
                                      <div className="text-xs font-semibold text-[#0F172A] flex items-center gap-1">
                                        <Calendar size={12} className="text-slate-400" />
                                        <span>{new Date(slot.date).toLocaleDateString()}</span>
                                      </div>
                                      {slot.clinic && (
                                        <div className="text-[11px] text-[#64748B] flex items-center gap-1">
                                          <Award size={12} className="text-slate-400" />
                                          <span>{slot.clinic.name}</span>
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-50 pt-2 text-[10px] font-bold mb-1">
                                      <span className={isFull ? "text-red-500" : "text-[#16A34A]"}>
                                        {isFull ? "Fully Booked" : "Available"}
                                      </span>
                                      <span className="text-[#64748B]">
                                        {slot.NumberOfPatients || 0}/{slot.MaxNumberOfPatients || 1} Booked
                                      </span>
                                    </div>

                                    {existingBooking ? (
                                      <Button
                                        size="sm"
                                        disabled
                                        className="w-full bg-[#F59E0B]/10 text-[#F59E0B] rounded-xl py-1.5 text-xs font-semibold border border-[#F59E0B]/20 cursor-not-allowed"
                                      >
                                        {existingBooking.registrationStatus === "approved"
                                          ? "✓ Approved"
                                          : "⏳ Under Review"}
                                      </Button>
                                    ) : isPast ? (
                                      <Button
                                        size="sm"
                                        disabled
                                        className="w-full bg-slate-100 text-slate-400 rounded-xl py-1.5 text-xs font-semibold cursor-not-allowed"
                                      >
                                        Past Slot
                                      </Button>
                                    ) : !isFull ? (
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          setBookingSlot(slot);
                                          setSymptoms("");
                                        }}
                                        className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl py-1.5 text-xs font-semibold cursor-pointer"
                                      >
                                        Book Slot
                                      </Button>
                                    ) : (
                                      <Button
                                        size="sm"
                                        disabled
                                        className="w-full bg-slate-100 text-slate-400 rounded-xl py-1.5 text-xs font-semibold cursor-not-allowed"
                                      >
                                        Full
                                      </Button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "bookings" && (
        <div className="space-y-6 max-w-5xl">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              My Scheduled Registrations
            </h2>
            <p className="text-sm text-[#64748B]">
              Track approval states, view clinical prescriptions, and manage your scheduled medical visits.
            </p>
          </div>

          {cancelError && (
            <div className="bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-500 p-4 rounded-xl">
              {cancelError}
            </div>
          )}

          {cancelSuccess && (
            <div className="bg-[#16A34A]/10 border border-[#16A34A]/20 text-sm font-medium text-[#16A34A] p-4 rounded-xl">
              {cancelSuccess}
            </div>
          )}

          {(() => {
            const active = bookings.filter((b: any) => b.status !== "Completed" && b.status !== "Cancelled");
            const archived = bookings.filter((b: any) => b.status === "Completed" || b.status === "Cancelled");

            const renderBookingCard = (booking: any) => {
              let badgeColor = "bg-[#F59E0B]/10 text-[#F59E0B]";
              let statusLabel = "Pending Approval";
              let showCancel = false;
              let showViewRx = false;

              if (booking.status === "Cancelled" || booking.sessionStatus === "Cancelled") {
                badgeColor = "bg-slate-100 text-slate-500 border border-slate-200";
                statusLabel = booking.sessionStatus === "Cancelled" ? "Cancelled (Session Cancelled)" : "Cancelled";
              } else if (booking.status === "Completed") {
                badgeColor = "bg-[#2563EB]/10 text-[#2563EB]";
                statusLabel = "Completed";
                showViewRx = true;
              } else if (booking.registrationStatus === "approved") {
                badgeColor = "bg-[#16A34A]/10 text-[#16A34A]";
                statusLabel = "Approved / Scheduled";
                showCancel = true;
              } else if (booking.registrationStatus === "rejected") {
                badgeColor = "bg-red-500/10 text-red-500";
                statusLabel = "Rejected";
              } else {
                badgeColor = "bg-[#F59E0B]/10 text-[#F59E0B]";
                statusLabel = "Pending Approval";
                showCancel = true;
              }

              return (
                <Card
                  key={booking.appointmentId}
                  className="rounded-2xl border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-6 bg-white flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all"
                >
                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-[#0F172A]">
                        {booking.doctor?.fullName || "Doctor Specialist"}
                      </h3>
                      {booking.doctor?.specialization && (() => {
                        const specName = booking.doctor.specialization;
                        const specData = getSpecialtyData(specName);
                        const SpecIcon = specData.icon;
                        return (
                          <span
                            className="inline-flex items-center gap-1 mt-0.5 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border"
                            style={{
                              backgroundColor: specData.bg,
                              color: specData.color,
                              borderColor: specData.border,
                            }}
                          >
                            <SpecIcon size={10} style={{ color: specData.color }} />
                            <span>{specName}</span>
                          </span>
                        );
                      })()}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs font-semibold text-[#64748B]">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#2563EB]" />
                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                         <Clock size={14} className="text-[#2563EB]" />
                         <span>{formatTimeInterval(booking.time, booking.duration)}</span>
                      </div>
                      {booking.clinic && (
                        <div className="flex items-center gap-1.5">
                          <Award size={14} className="text-[#14B8A6]" />
                          <span>{booking.clinic.name}</span>
                        </div>
                      )}
                    </div>

                    {booking.symptoms && (
                      <div className="max-w-xl">
                        {booking.symptoms.trim().startsWith("{") ? (
                          <div className="space-y-1">
                            <span className="font-bold text-[#0F172A] text-xs block mb-1">Medical Diagnosis & Prescription:</span>
                            <MedicalNotesDisplay notes={booking.symptoms} />
                          </div>
                        ) : (
                          <p className="text-xs text-[#64748B] italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <span className="font-bold text-[#0F172A] not-italic block mb-0.5">Symptoms:</span>
                            {booking.symptoms}
                          </p>
                        )}
                      </div>
                    )}

                    {booking.registrationStatus === "rejected" && booking.rejectionReason && (
                      <div className="text-xs text-red-500 italic bg-red-50 p-2.5 rounded-xl border border-red-100 max-w-xl">
                        <span className="font-bold not-italic block mb-0.5">Rejection Reason:</span>
                        {booking.rejectionReason}
                      </div>
                    )}

                    <div className="pt-1">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {statusLabel}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 shrink-0 mt-2 sm:mt-0 self-end sm:self-auto">
                    {showViewRx && (
                      <Button
                        onClick={() => setViewingPrescription(booking)}
                        className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer shadow-[0_4px_12px_rgba(37,99,235,0.15)]"
                      >
                        <FileText size={14} />
                        <span>View Prescription</span>
                      </Button>
                    )}

                    {showCancel && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(booking.appointmentId)}
                        className="flex items-center gap-1.5 border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626]/5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
                      >
                        <XCircle size={14} />
                        <span>{booking.registrationStatus === "pending" ? "Cancel Request" : "Cancel Booking"}</span>
                      </Button>
                    )}
                  </div>
                </Card>
              );
            };

            if (bookings.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] max-w-md mx-auto mt-10">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4">
                    <CalendarDays size={32} />
                  </div>
                  <h3 className="font-bold text-lg text-[#0F172A] mb-2">No Appointments Scheduled</h3>
                  <p className="text-sm text-[#64748B] mb-6 max-w-[280px]">
                    You don't have any upcoming or completed medical appointments.
                  </p>
                  <Button
                    onClick={() => setActiveTab("find-doctor")}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl px-6 py-2.5 font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.15)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)] transition-all cursor-pointer"
                  >
                    Find a Doctor
                  </Button>
                </div>
              );
            }

            return (
              <div className="space-y-6">
                {/* Active Bookings */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Upcoming Scheduled Visits</h3>
                  {active.length > 0 ? (
                    <div className="space-y-4">
                      {active.map(renderBookingCard)}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-white border border-dashed border-slate-200 rounded-2xl">
                      <p className="text-xs text-slate-400 font-semibold">No upcoming appointments scheduled.</p>
                    </div>
                  )}
                </div>

                {/* Archived / Past Bookings */}
                {archived.length > 0 && (
                  <div className="space-y-3 border-t border-slate-100 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPatientArchivedOpen(!patientArchivedOpen)}
                      className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider cursor-pointer select-none bg-slate-50 border border-slate-100 hover:border-slate-200 px-4 py-2.5 rounded-xl w-fit"
                    >
                      <span>{patientArchivedOpen ? "Hide Consultation History ▲" : `View Consultation History (${archived.length}) ▼`}</span>
                    </Button>

                    {patientArchivedOpen && (
                      <div className="space-y-4 pt-2 animate-fade-in">
                        {archived.map(renderBookingCard)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {activeTab === "profile" && <PatientProfileSection />}
    </>
  );
};

function PatientProfileSection() {
  const profile = useProfile();
  return (
    <div className="space-y-6 max-w-4xl bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Patient Profile Settings</h2>
        <p className="text-sm text-[#64748B] mt-1">Update your personal information, emergency contact, address, and medical records.</p>
      </div>
      {profile.error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-4 rounded-xl font-medium">
          {profile.error}
        </div>
      )}
      {profile.success && (
        <div className="bg-green-50 border border-green-200 text-green-600 text-xs p-4 rounded-xl font-medium">
          {profile.success}
        </div>
      )}
      <PatientProfileForm
        patientData={profile.patientData}
        submitting={profile.submitting}
        onPatientChange={profile.handlePatientChange}
        onPatientNestedChange={profile.handlePatientNestedChange}
        onSubmit={profile.handlePatientSubmit}
      />
    </div>
  );
}
