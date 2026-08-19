import React from "react";
import {
  CalendarCheck,
  Clock,
  ShieldCheck,
  Award,
  CalendarDays,
  Calendar,
  XCircle,
  FileText,
  Search,
  User,
  Check,
  Printer,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import MedicalNotesDisplay from "../MedicalNotesDisplay";
import { formatTimeInterval, getAge } from "../../lib/formatters";
import { buildConsultationPrintHTML } from "../../lib/printHelper";

import { useProfile } from "../../hooks/useProfile";
import { DoctorProfileForm } from "../profile/DoctorProfileForm";
import { EmptyState } from "../shared/EmptyState";
import { DatePicker } from "../ui/date-picker";
import type { useDoctorDashboard } from "../../hooks/useDoctorDashboard";

interface DoctorTabsProps {
  doctor: ReturnType<typeof useDoctorDashboard>;
  user: any;
}

export const DoctorTabs: React.FC<DoctorTabsProps> = ({ doctor, user }) => {
  const {
    activeTab,
    doctorAppointments,
    loadingAppointments,
    actionError,
    actionSuccess,
    myPatients,
    patientNotes,
    setPatientNotes,
    savingNoteId,
    patientSearch,
    setPatientSearch,
    expandedPatientId,
    setExpandedPatientId,
    patientHistory,
    loadingHistory,
    doctorSlotsArchivedOpen,
    setDoctorSlotsArchivedOpen,
    doctorVisitsArchivedOpen,
    setDoctorVisitsArchivedOpen,
    handleSaveNote,
    handleCancelSessions,
    handleApproveRegistration,
    handleRejectRegistration,
    handleStartConsultation,
    doctorProfileId,
    doctorProfile,
    setActiveTab,
  } = doctor as any;

  const getTodayString = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const [cancelDate, setCancelDate] = React.useState(getTodayString());
  const [cancelRange, setCancelRange] = React.useState<"rest" | "whole">("rest");
  const [cancelReason, setCancelReason] = React.useState("");

  const isCancelDateToday = cancelDate === getTodayString();

  React.useEffect(() => {
    if (!isCancelDateToday) {
      setCancelRange("whole");
    } else {
      setCancelRange("rest");
    }
  }, [cancelDate, isCancelDateToday]);





  return (
    <>
      {activeTab === "overview" && (
        <div className="space-y-8 max-w-5xl">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">
                Welcome, {user?.name}
              </h2>
              <span className="bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {user?.specialization || "Medical Specialist"}
              </span>
            </div>
            <p className="text-sm text-[#64748B] mt-1.5">
              Your clinical dashboard is active. Review your scheduled consultations and patient records below.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-start gap-4">
              <div className="p-3 bg-[#2563EB]/5 rounded-xl text-[#2563EB]">
                <CalendarCheck size={24} />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Visits Today
                </span>
                <h3 className="text-3xl font-bold text-[#0F172A]">0</h3>
                <p className="text-[11px] text-[#64748B]">Scheduled patients</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-start gap-4">
              <div className="p-3 bg-[#14B8A6]/5 rounded-xl text-[#14B8A6]">
                <Clock size={24} />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Practice Hours
                </span>
                <div className="space-y-0.5">
                  {doctorProfile?.availability && doctorProfile.availability.length > 0 ? (
                    doctorProfile.availability.map((av: any, i: number) => (
                      <span key={i} className="block text-[11px] font-bold text-[#0F172A]">
                        {av.dayOfWeek.slice(0, 3)}: {av.startTime} - {av.endTime}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm font-bold text-slate-400 italic">No set schedule</span>
                  )}
                </div>
                <p className="text-[10px] text-[#64748B] pt-0.5">Configured availability</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-start gap-4">
              <div className="p-3 bg-[#16A34A]/5 rounded-xl text-[#16A34A]">
                <ShieldCheck size={24} />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Account Status
                </span>
                <h3 className="text-lg font-bold text-[#16A34A] pt-1 uppercase tracking-wider">
                  Verified
                </h3>
                <p className="text-[11px] text-[#64748B]">Full access granted</p>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <Card className="rounded-2xl border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-50 p-6">
              <CardTitle className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <Award size={20} className="text-[#2563EB]" />
                Doctor Practice Guidelines
              </CardTitle>
              <CardDescription className="text-sm text-[#64748B]">
                Ensure that all clinical consultation notes and diagnoses are saved securely in the patient electronic medical records.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Button
                onClick={() => setActiveTab("bookings")}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl px-5 py-2.5 font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.15)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)] transition-all cursor-pointer"
              >
                View Patient Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "bookings" && (
        <div className="space-y-6 max-w-5xl">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              Patient Visits & Registrations
            </h2>
            <p className="text-sm text-[#64748B]">
              Review patient visits, clinical details, and conduct consultations.
            </p>
          </div>

          {actionError && (
            <div className="bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-500 p-4 rounded-xl">
              {actionError}
            </div>
          )}

          {actionSuccess && (
            <div className="bg-[#16A34A]/10 border border-[#16A34A]/20 text-sm font-medium text-[#16A34A] p-4 rounded-xl">
              {actionSuccess}
            </div>
          )}

          {loadingAppointments ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 rounded-full border-2 border-[#2563EB]/25 border-t-[#2563EB] animate-spin" />
            </div>
          ) : (() => {
            const slotsWithPatients = doctorAppointments.filter(
              (slot: any) => slot.patient && slot.patient.length > 0
            );

            if (slotsWithPatients.length === 0) {
              return (
                <EmptyState
                  title="No Registered Visits"
                  description="No patients have registered for your consultation slots yet."
                  icon={CalendarDays}
                  className="bg-white my-6"
                />
              );
            }

            const renderVisitCard = (slot: any) => (
              <Card key={slot._id} className="rounded-2xl border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden bg-white">
                <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      slot.type === "emergency"
                        ? "bg-red-500/10 text-red-500"
                        : slot.type === "surgery"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-[#2563EB]/10 text-[#2563EB]"
                    }`}>
                      {slot.type}
                    </span>
                    <div className="flex items-center gap-1 text-sm font-bold text-[#0F172A]">
                      <Calendar size={14} className="text-slate-400" />
                      <span>{new Date(slot.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#64748B]">
                      <Clock size={14} className="text-slate-400" />
                      <span>{formatTimeInterval(slot.time, slot.duration)}</span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-[#64748B]">
                    Capacity: {slot.NumberOfPatients}/{slot.MaxNumberOfPatients} Patients
                  </div>
                </div>

                <CardContent className="p-6 divide-y divide-slate-100">
                  {slot.patient.map((reg: any) => {
                    const pDetails = reg.patientId || {};
                    const pId = pDetails._id;

                    return (
                      <div key={reg._id || pId} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1.5 flex-1 w-full">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base text-[#0F172A]">{pDetails.fullName || "Unknown Patient"}</h4>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              reg.registrationStatus === "approved"
                                ? "bg-[#16A34A]/10 text-[#16A34A]"
                                : reg.registrationStatus === "rejected"
                                ? "bg-red-500/10 text-red-500"
                                : "bg-[#F59E0B]/10 text-[#F59E0B]"
                            }`}>
                              {reg.registrationStatus}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#64748B] bg-slate-50/50 p-3 rounded-xl border border-slate-100/80 mt-1.5">
                            {pDetails.email && <span><strong>Email:</strong> {pDetails.email}</span>}
                            {pDetails.phone && <span><strong>Phone:</strong> {pDetails.phone}</span>}
                            {pDetails.gender && <span className="capitalize"><strong>Gender:</strong> {pDetails.gender}</span>}
                            {pDetails.dateOfBirth && (
                              <span>
                                <strong>Age:</strong> {getAge(pDetails.dateOfBirth)} Yrs ({new Date(pDetails.dateOfBirth).toLocaleDateString()})
                              </span>
                            )}
                            {pDetails.bloodType && <span><strong>Blood Type:</strong> {pDetails.bloodType}</span>}
                            {pDetails.chronicDiseases && pDetails.chronicDiseases.length > 0 && (
                              <span>
                                <strong>Chronic Diseases:</strong> {Array.isArray(pDetails.chronicDiseases) ? pDetails.chronicDiseases.join(", ") : pDetails.chronicDiseases}
                              </span>
                            )}
                            {pDetails.emergencyContact?.name && (
                              <span>
                                <strong>Emergency Contact:</strong> {pDetails.emergencyContact.name} ({pDetails.emergencyContact.relation || "Contact"}) - {pDetails.emergencyContact.phone}
                              </span>
                            )}
                          </div>


                          {reg.symptoms && (
                            <p className="text-xs text-[#64748B] bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1">
                              <span className="font-semibold text-[#0F172A] block mb-0.5">Symptoms:</span>
                              {reg.symptoms}
                            </p>
                          )}

                           {slot.status === "Completed" && slot.notes && (
                            <div className="mt-2 space-y-2">
                              <MedicalNotesDisplay notes={slot.notes} />
                              <button
                                type="button"
                                onClick={() => {
                                  const win = window.open("", "_blank", "width=800,height=600");
                                  if (!win) return;
                                  const docNameStr = user?.name || slot.doctor?.fullName || "Doctor";
                                  const clinicNameStr = slot.clinic?.name || "";
                                  win.document.write(
                                    buildConsultationPrintHTML({
                                      patientName: pDetails.fullName,
                                      date: new Date(slot.date).toLocaleDateString(),
                                      time: formatTimeInterval(slot.time, slot.duration),
                                      notes: slot.notes,
                                      doctorName: docNameStr,
                                      clinicName: clinicNameStr,
                                    })
                                  );
                                  win.document.close();
                                }}
                                className="flex items-center gap-1.5 text-[11px] font-bold text-[#2563EB] hover:text-[#1D4ED8] bg-[#2563EB]/5 hover:bg-[#2563EB]/10 border border-[#2563EB]/10 px-2.5 py-1 rounded-lg cursor-pointer transition-all w-fit"
                              >
                                <Printer size={12} />
                                <span>Print Record</span>
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-auto shrink-0 mt-2 md:mt-0">
                          {reg.registrationStatus === "pending" && slot.status !== "Completed" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApproveRegistration(slot._id, pId)}
                                className="bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl px-3.5 py-2 text-xs font-bold cursor-pointer flex items-center gap-1"
                              >
                                <Check size={12} />
                                <span>Approve</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectRegistration(slot._id, pId)}
                                className="border-red-500 text-red-500 hover:bg-red-500/5 rounded-xl px-3.5 py-2 text-xs font-bold cursor-pointer flex items-center gap-1"
                              >
                                <XCircle size={12} />
                                <span>Reject</span>
                              </Button>
                            </>
                          )}

                          {reg.registrationStatus === "approved" && slot.status === "Scheduled" && (
                            <Button
                              size="sm"
                              onClick={() => handleStartConsultation(slot, reg)}
                              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl px-4 py-2 text-xs font-bold shadow-[0_4px_12px_rgba(37,99,235,0.1)] cursor-pointer flex items-center gap-1.5"
                            >
                              <FileText size={14} />
                              <span>Start Consultation</span>
                            </Button>
                          )}

                          {reg.registrationStatus === "rejected" && reg.rejectionReason && (
                            <div className="text-xs text-red-500 italic bg-red-50 p-2 rounded-lg border border-red-100">
                              Reason: {reg.rejectionReason}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );

            const todayStr = new Date().toISOString().split("T")[0];
            const isSameDay = (d: string) => new Date(d).toISOString().split("T")[0] === todayStr;
            const isFuture = (d: string) => new Date(d).toISOString().split("T")[0] > todayStr;

            const todayVisits = slotsWithPatients.filter((s: any) => isSameDay(s.date) && s.status !== "Completed" && s.status !== "Cancelled");
            const upcomingVisits = slotsWithPatients.filter((s: any) => isFuture(s.date) && s.status !== "Completed" && s.status !== "Cancelled");
            const pastVisits = slotsWithPatients
              .filter((s: any) => ((!isSameDay(s.date) && !isFuture(s.date)) || s.status === "Completed" || s.status === "Cancelled"))
              .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

            const renderVisitsGroup = (label: string, visitsList: any[], accent: string) => (
              <div className="space-y-3">
                <h3 className={`text-xs font-bold uppercase tracking-wider ${accent}`}>{label} <span className="text-slate-300">({visitsList.length})</span></h3>
                {visitsList.length > 0 ? (
                  <div className="space-y-6">
                    {visitsList.map(renderVisitCard)}
                  </div>
                ) : (
                  <div className="text-center p-6 bg-white border border-dashed border-slate-200 rounded-2xl">
                    <p className="text-xs text-slate-400 font-semibold">No visits in this period.</p>
                  </div>
                )}
              </div>
            );

            return (
              <div className="space-y-6">
                {renderVisitsGroup("Today", todayVisits, "text-[#16A34A]")}
                {renderVisitsGroup("Upcoming", upcomingVisits, "text-[#2563EB]")}

                {/* Collapsible Past Visits */}
                {pastVisits.length > 0 && (
                  <div className="space-y-3 border-t border-slate-100 pt-6">
                    <button
                      type="button"
                      onClick={() => setDoctorVisitsArchivedOpen(!doctorVisitsArchivedOpen)}
                      className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider cursor-pointer select-none bg-slate-50 border border-slate-100 hover:border-slate-200 px-4 py-2.5 rounded-xl w-fit"
                    >
                      <span>{doctorVisitsArchivedOpen ? "Hide Past Visits \u25b2" : `View Past Visits (${pastVisits.length}) \u25bc`}</span>
                    </button>
                    {doctorVisitsArchivedOpen && (
                      <div className="space-y-6 pt-2 animate-fade-in opacity-70">
                        {pastVisits.map(renderVisitCard)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {activeTab === "slots" && (
        <div className="space-y-8 max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                Consultation Hours
              </h2>
              <p className="text-sm text-[#64748B]">
                View your available clinic hours and slot capacities.
              </p>
            </div>
          </div>

          {/* Cancellation Control Panel */}
          <Card className="rounded-3xl border border-red-100 bg-red-500/[0.02] shadow-[0_10px_30px_rgba(220,38,38,0.01)] overflow-visible relative z-10">
            <div className="p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#DC2626] uppercase tracking-wider flex items-center gap-2">
                  <XCircle size={16} className="text-[#DC2626]" />
                  <span>Cancel Scheduled Shift / Sessions</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Cancel all remaining sessions for the rest of today, or an entire day of scheduled sessions. Requires a reason.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="space-y-1.5">
                  <Label htmlFor="cancel-date" className="text-xs font-bold text-slate-700">Date to Cancel</Label>
                  <DatePicker
                    id="cancel-date"
                    value={cancelDate}
                    onChange={(e) => setCancelDate(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cancel-range" className="text-xs font-bold text-slate-700">Cancellation Range</Label>
                  <select
                    id="cancel-range"
                    value={cancelRange}
                    onChange={(e) => setCancelRange(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-[#2563EB]"
                  >
                    {isCancelDateToday && <option value="rest">Rest of the Day</option>}
                    <option value="whole">Whole Day</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <Label htmlFor="cancel-reason" className="text-xs font-bold text-slate-700">Reason for Cancellation</Label>
                  <Input
                    id="cancel-reason"
                    placeholder="Enter reason..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="rounded-xl border-slate-200 text-xs py-2 bg-white"
                  />
                </div>
              </div>

              <Button
                onClick={() => {
                  handleCancelSessions(cancelDate, cancelReason, cancelRange);
                  setCancelReason("");
                }}
                disabled={!cancelReason.trim()}
                className="w-full sm:w-auto px-6 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl py-2.5 text-xs font-bold shadow-[0_4px_12px_rgba(220,38,38,0.1)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <XCircle size={14} />
                <span>Cancel Selected Sessions</span>
              </Button>
            </div>
          </Card>

          {actionError && (
            <div className="bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-500 p-4 rounded-xl">
              {actionError}
            </div>
          )}

          {actionSuccess && (
            <div className="bg-[#16A34A]/10 border border-[#16A34A]/20 text-sm font-medium text-[#16A34A] p-4 rounded-xl">
              {actionSuccess}
            </div>
          )}

          {loadingAppointments ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 rounded-full border-2 border-[#2563EB]/25 border-t-[#2563EB] animate-spin" />
            </div>
          ) : (() => {
            const renderSlotCard = (slot: any) => {
              return (
                <Card
                  key={slot._id}
                  className="rounded-2xl border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-5 bg-white flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        slot.type === "emergency"
                          ? "bg-red-500/10 text-red-500"
                          : slot.type === "surgery"
                          ? "bg-amber-500/10 text-amber-500"
                          : slot.type === "follow-up"
                          ? "bg-purple-500/10 text-purple-500"
                          : "bg-[#2563EB]/10 text-[#2563EB]"
                      }`}>
                        {slot.type}
                      </span>
                      <span className="text-xs font-semibold text-[#64748B]">
                        Capacity: {slot.NumberOfPatients || 0}/{slot.MaxNumberOfPatients || 1}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-[#0F172A]">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{new Date(slot.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                        <Clock size={14} className="text-slate-400" />
                        <span>{formatTimeInterval(slot.time, slot.duration) || "N/A"}</span>
                      </div>
                      {slot.notes && (
                        <div className="mt-1">
                          <MedicalNotesDisplay notes={slot.notes} compact={true} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-1">
                    <span className={`text-xs font-bold ${
                      slot.status === "Completed"
                        ? "text-[#16A34A]"
                        : slot.status === "Cancelled"
                        ? "text-red-500"
                        : "text-[#2563EB]"
                    }`}>
                      {slot.status}
                    </span>
                  </div>
                </Card>
              );
            };

            if (doctorAppointments.length === 0) {
              return (
                <div className="text-center p-10 bg-white rounded-2xl border border-slate-100">
                  <CalendarDays size={32} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#64748B]">No slots created yet.</p>
                </div>
              );
            }

            const todayStr = new Date().toISOString().split("T")[0];
            const isSameDay = (d: string) => new Date(d).toISOString().split("T")[0] === todayStr;
            const isFuture = (d: string) => new Date(d).toISOString().split("T")[0] > todayStr;

            const todaySlots = doctorAppointments.filter((s: any) => isSameDay(s.date) && s.status !== "Completed" && s.status !== "Cancelled");
            const upcomingSlots = doctorAppointments.filter((s: any) => isFuture(s.date) && s.status !== "Completed" && s.status !== "Cancelled");
            const pastSlots = doctorAppointments
              .filter((s: any) => ((!isSameDay(s.date) && !isFuture(s.date)) || s.status === "Completed" || s.status === "Cancelled"))
              .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

            const renderGroup = (label: string, slotsList: any[], accent: string) => (
              <div className="space-y-3">
                <h3 className={`text-xs font-bold uppercase tracking-wider ${accent}`}>{label} <span className="text-slate-300">({slotsList.length})</span></h3>
                {slotsList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {slotsList.map(renderSlotCard)}
                  </div>
                ) : (
                  <div className="text-center p-6 bg-white border border-dashed border-slate-200 rounded-2xl">
                    <p className="text-xs text-slate-400 font-semibold">No slots in this period.</p>
                  </div>
                )}
              </div>
            );

            return (
              <div className="space-y-6">
                {renderGroup("Today", todaySlots, "text-[#16A34A]")}
                {renderGroup("Upcoming", upcomingSlots, "text-[#2563EB]")}

                {/* Collapsible Past Sessions */}
                {pastSlots.length > 0 && (
                  <div className="space-y-3 border-t border-slate-100 pt-6">
                    <button
                      type="button"
                      onClick={() => setDoctorSlotsArchivedOpen(!doctorSlotsArchivedOpen)}
                      className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider cursor-pointer select-none bg-slate-50 border border-slate-100 hover:border-slate-200 px-4 py-2.5 rounded-xl w-fit"
                    >
                      <span>{doctorSlotsArchivedOpen ? "Hide Past Sessions \u25b2" : `View Past Sessions (${pastSlots.length}) \u25bc`}</span>
                    </button>
                    {doctorSlotsArchivedOpen && (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2 animate-fade-in opacity-70">
                        {pastSlots.map(renderSlotCard)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {activeTab === "patients" && (
        <div className="space-y-6 max-w-5xl">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              My Patients Directory
            </h2>
            <p className="text-sm text-[#64748B]">
              View patient profiles, chronic diseases, and update clinical notes.
            </p>
          </div>

          {actionError && (
            <div className="bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-500 p-4 rounded-xl">
              {actionError}
            </div>
          )}

          {actionSuccess && (
            <div className="bg-[#16A34A]/10 border border-[#16A34A]/20 text-sm font-medium text-[#16A34A] p-4 rounded-xl">
              {actionSuccess}
            </div>
          )}

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              type="text"
              placeholder="Search patients by name..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="pl-10 rounded-xl border-slate-200 bg-white text-xs focus:border-[#2563EB]"
            />
          </div>

          {loadingAppointments ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 rounded-full border-2 border-[#2563EB]/25 border-t-[#2563EB] animate-spin" />
            </div>
          ) : (() => {
            const renderChronicDiseases = (diseases: any) => {
              if (!diseases) return "None";
              if (Array.isArray(diseases)) {
                return diseases.length > 0 ? diseases.join(", ") : "None";
              }
              if (typeof diseases === "string") {
                return diseases.trim() || "None";
              }
              return "None";
            };

            const filteredPatients = myPatients.filter((pat: any) =>
              pat.fullName?.toLowerCase().includes(patientSearch.toLowerCase())
            );

            if (filteredPatients.length === 0) {
              return (
                <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-12 flex flex-col items-center justify-center text-center my-6">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4">
                    <User size={32} />
                  </div>
                  <h3 className="font-bold text-lg text-[#0F172A] mb-2">
                    No Patients Found
                  </h3>
                  <p className="text-sm text-[#64748B] max-w-md leading-relaxed">
                    {patientSearch ? "No patients match your search criteria." : "You don't have any appointments booked with patients yet."}
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 gap-4">
                {filteredPatients.map((pat: any) => {
                  const notesVal = patientNotes[pat._id] !== undefined
                    ? patientNotes[pat._id]
                    : (pat.doctorNotes?.find((n: any) =>
                        n.doctor === doctorProfileId ||
                        n.doctor?._id === doctorProfileId ||
                        n.doctor === user?._id ||
                        n.doctor?._id === user?._id
                      )?.notes || "");

                  return (
                    <Card
                      key={pat._id}
                      className="rounded-2xl border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden bg-white p-6 space-y-4"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        {/* Left: Patient Avatar & Details */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-full bg-[#2563EB]/5 flex items-center justify-center text-[#2563EB] shrink-0">
                            <User size={24} />
                          </div>
                          <div className="space-y-1.5">
                            <h4 className="font-bold text-base text-[#0F172A]">
                              {pat.fullName}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium flex flex-wrap items-center gap-2">
                              <span>Gender: <strong className="text-slate-700 capitalize">{pat.gender || "N/A"}</strong></span>
                              <span>|</span>
                              <span>Blood Type: <strong className="text-slate-700">{pat.bloodType || "N/A"}</strong></span>
                              {getAge(pat.dateOfBirth) !== null && (
                                <>
                                  <span>|</span>
                                  <span>Age: <strong className="text-slate-700">{getAge(pat.dateOfBirth)}</strong></span>
                                </>
                              )}
                            </p>
                            <div className="text-xs text-slate-500 font-medium pt-0.5">
                              <span className="font-semibold text-slate-700">Chronic Diseases: </span>
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                                {renderChronicDiseases(pat.chronicDiseases)}
                              </span>
                            </div>

                            {/* Expand toggle */}
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedPatientId(
                                  expandedPatientId === pat._id ? null : pat._id
                                )
                              }
                              className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer mt-2 inline-flex items-center gap-1"
                            >
                              {expandedPatientId === pat._id ? "Hide Details ▲" : "View Details & History ▼"}
                            </button>
                          </div>
                        </div>

                        {/* Right: Doctor Clinical Notes Box */}
                        <div className="w-full md:w-80 space-y-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                          <label className="text-xs font-bold text-[#0F172A] flex items-center justify-between">
                            <span>Doctor Clinical Notes</span>
                            <span className="text-[10px] text-slate-400 font-normal">Private</span>
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Add clinical observations or internal medical notes..."
                            value={notesVal}
                            onChange={(e) =>
                              setPatientNotes({
                                ...patientNotes,
                                [pat._id]: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-[#E2E8F0] bg-slate-50 p-2.5 text-xs focus:bg-white focus:border-[#2563EB] focus:outline-none transition-all"
                          />
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              disabled={savingNoteId === pat._id}
                              onClick={() => handleSaveNote(pat._id, notesVal)}
                              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl px-3.5 py-1.5 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                            >
                              {savingNoteId === pat._id ? (
                                <span className="w-3 h-3 rounded-full border-2 border-white/25 border-t-white animate-spin" />
                              ) : (
                                <>
                                  <Check size={12} />
                                  <span>Save Notes</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Section (Spans Full Width at Bottom) */}
                      {expandedPatientId === pat._id && (
                        <div className="w-full mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 text-xs text-[#64748B] animate-fade-in">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {pat.address?.city && (
                              <div className="space-y-1">
                                <span className="font-bold text-[#0F172A] text-[11px] uppercase tracking-wider block">Address</span>
                                <p className="text-slate-700">
                                  {[pat.address.street, pat.address.city, pat.address.state, pat.address.country]
                                    .filter(Boolean)
                                    .join(", ")}
                                </p>
                              </div>
                            )}
                            {pat.emergencyContact?.name && (
                              <div className="space-y-1">
                                <span className="font-bold text-[#0F172A] text-[11px] uppercase tracking-wider block">Emergency Contact</span>
                                <p className="text-slate-700">
                                  {pat.emergencyContact.name} ({pat.emergencyContact.relationship || pat.emergencyContact.relation || "Contact"}) - {pat.emergencyContact.phone}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Patient History */}
                          <div className="border-t border-slate-200/60 pt-3 space-y-2">
                            <span className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px] block">
                              Prior Consultation History
                            </span>
                            {loadingHistory[pat._id] ? (
                              <p className="italic text-[11px]">Loading history...</p>
                            ) : patientHistory[pat._id] && patientHistory[pat._id].length > 0 ? (
                              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                {patientHistory[pat._id].map((hItem: any, idx: number) => (
                                  <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
                                    <div className="flex justify-between items-center text-[11px]">
                                      <span className="font-bold text-[#0F172A]">
                                        {new Date(hItem.date).toLocaleDateString()} ({hItem.time || "N/A"})
                                      </span>
                                      <span className="text-slate-500 font-medium">
                                        Dr. {hItem.doctor?.fullName || "Doctor"}
                                      </span>
                                    </div>
                                    {hItem.notes && <MedicalNotesDisplay notes={hItem.notes} compact={true} />}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="italic text-[11px] text-slate-400">No completed prior consultations found.</p>
                            )}
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {activeTab === "profile" && <DoctorProfileSection />}
    </>
  );
};

function DoctorProfileSection() {
  const profile = useProfile();
  return (
    <div className="space-y-6 max-w-4xl bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Doctor Profile Settings</h2>
        <p className="text-sm text-[#64748B] mt-1">Manage your clinical specialization, qualifications, and personal details.</p>
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
      <DoctorProfileForm
        doctorData={profile.doctorData}
        submitting={profile.submitting}
        onDoctorChange={profile.handleDoctorChange}
        onDoctorQualificationsChange={profile.handleDoctorQualificationsChange}
        onSubmit={profile.handleDoctorSubmit}
      />
    </div>
  );
}
