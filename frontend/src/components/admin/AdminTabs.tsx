import React from "react";
import {
  Building,
  User,
  Users,
  Calendar,
  Plus,
  Trash2,
  Edit3,
  Link2Off,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import MedicalNotesDisplay from "../MedicalNotesDisplay";
import { formatTimeInterval, getLocalDateString } from "../../lib/formatters";
import type { useAdminDashboard } from "../../hooks/useAdminDashboard";

interface AdminTabsProps {
  admin: ReturnType<typeof useAdminDashboard>;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({ admin }) => {
  const [openDoctorIntervals, setOpenDoctorIntervals] = React.useState<Record<string, boolean>>({});
  const {
    activeTab,
    clinics,
    doctors,
    patients,
    appointments,
    setBookingModalPatient,
    setBookingClinicId,
    setBookingDoctorId,
    setSelectedSlotId,
    setAvailableSlots,
    handleOpenCreateClinic,
    setAssignModalClinic,
    handleOpenEditClinic,
    handleDeleteClinic,
    handleRemoveDoctor,
    handleOpenAddDoctor,
    handleOpenEditDoctor,
    handleOpenAddPatient,
    handleOpenEditPatient,
    setActiveContactPatient,
    handleTogglePatientAppts,
    expandedPatientApptId,
    loadingPatientAppts,
    patientAppts,
    slotsFilterDoctorId,
    setSlotsFilterDoctorId,
    slotsDateFilter,
    setSlotsDateFilter,
    setActionError,
    setEditingSlot,
    setAdminSlotDate,
    setAdminSlotTime,
    setAdminSlotEndTime,
    setAdminSlotDuration,
    setAdminSlotModalOpen,
    loadingSlots,
    filteredSlots,
    handleDeleteAdminSlot,
    handleResetSlotFilters,
    adminTodaySlotsOpen,
    setAdminTodaySlotsOpen,
    adminUpcomingSlotsOpen,
    setAdminUpcomingSlotsOpen,
    adminPastSlotsOpen,
    setAdminPastSlotsOpen,
    loadingMessages,
    messages,
    slotsCancelDate,
    setSlotsCancelDate,
    handleAdminCancelDay,
  } = admin as any;

  return (
    <div className="pt-2">
      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-slate-100 shadow-sm p-5 flex items-center gap-4 bg-white">
              <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl"><Building size={24} /></div>
              <div>
                <div className="text-2xl font-black text-slate-800">{clinics.length}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Clinics</div>
              </div>
            </Card>
            <Card className="rounded-2xl border-slate-100 shadow-sm p-5 flex items-center gap-4 bg-white">
              <div className="p-3.5 bg-teal-50 text-teal-600 rounded-2xl"><User size={24} /></div>
              <div>
                <div className="text-2xl font-black text-slate-800">{doctors.length}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Active Doctors</div>
              </div>
            </Card>
            <Card className="rounded-2xl border-slate-100 shadow-sm p-5 flex items-center gap-4 bg-white">
              <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl"><Users size={24} /></div>
              <div>
                <div className="text-2xl font-black text-slate-800">{patients.length}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Registered Patients</div>
              </div>
            </Card>
            <Card className="rounded-2xl border-slate-100 shadow-sm p-5 flex items-center gap-4 bg-white">
              <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl"><Calendar size={24} /></div>
              <div>
                <div className="text-2xl font-black text-slate-800">{appointments.length}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Appointments</div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Actions Card */}
            <Card className="rounded-2xl border-slate-100 shadow-sm bg-white p-6 md:col-span-2 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-[#0F172A] text-sm">Quick Booking Portal</h3>
                <p className="text-xs text-slate-500 mt-1">Book an appointment for a patient instantly without leaving this tab.</p>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs text-slate-400 font-medium leading-normal max-w-md">
                  Instantly select or register a patient, select their target clinic and doctor, and confirm a free time slot in a single, streamlined process.
                </span>
                <Button
                  onClick={() => {
                    setBookingModalPatient({ _id: "", fullName: "" });
                    setBookingClinicId("");
                    setBookingDoctorId("");
                    setSelectedSlotId("");
                    setAvailableSlots([]);
                  }}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold px-5 py-2.5 cursor-pointer shadow-sm shrink-0"
                >
                  Start Quick Booking
                </Button>
              </div>
            </Card>

            {/* System Status Card */}
            <Card className="rounded-2xl border-slate-100 shadow-sm bg-white p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-[#0F172A] text-sm">System Health</h3>
                <p className="text-xs text-slate-500 mt-1">All hospital portal modules are running normally.</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[#16A34A] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] inline-block animate-pulse" />
                  All Modules Online
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">v1.0.0</span>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* CLINICS TAB */}
      {activeTab === "clinics" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-black text-[#0F172A]">Clinics Registry</h2>
            <Button onClick={handleOpenCreateClinic} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl flex items-center gap-1 text-xs py-2 font-bold cursor-pointer">
              <Plus size={16} />
              <span>Add Clinic</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clinics.map((clinic: any) => (
              <Card key={clinic._id} className="rounded-2xl border-slate-100 shadow-sm overflow-hidden bg-white flex flex-col justify-between">
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#2563EB]/10 text-[#2563EB] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {clinic.specialty}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{clinic.clinicNumber}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0F172A] text-sm">{clinic.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{clinic.description || "No description provided."}</p>
                  </div>
                  <div className="text-xs font-semibold text-slate-500 flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl">
                    <span>Floor: {clinic.floor || "N/A"}</span>
                    <span>Room: {clinic.roomNumber || "N/A"}</span>
                  </div>

                  {/* Clinic Assigned Doctors list */}
                  <div className="space-y-1.5 pt-2">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Assigned Doctors ({clinic.doctors?.length || 0})</div>
                    {clinic.doctors && clinic.doctors.length > 0 ? (
                      <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                        {clinic.doctors.map((doc: any) => (
                          <div key={doc._id || doc} className="flex items-center justify-between text-xs bg-slate-50 px-2 py-1 rounded-lg">
                            <span className="font-bold text-slate-700">{doc.fullName || "Loading..."}</span>
                            <button
                              type="button" 
                              onClick={() => handleRemoveDoctor(clinic._id, doc._id || doc)} 
                              className="text-red-500 hover:text-red-700 cursor-pointer p-0.5"
                            >
                              <Link2Off size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400 italic">No assigned doctors.</div>
                    )}
                  </div>
                </div>
                <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setAssignModalClinic(clinic)} className="text-xs rounded-lg py-1.5 font-bold cursor-pointer">
                    Assign Doctor
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleOpenEditClinic(clinic)} className="text-xs rounded-lg p-1.5 cursor-pointer">
                    <Edit3 size={14} className="text-slate-600" />
                  </Button>
                  <button onClick={() => handleDeleteClinic(clinic._id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* DOCTORS TAB */}
      {activeTab === "doctors" && (
        <div className="space-y-6">
          <Card className="rounded-2xl border-slate-100 shadow-sm bg-white overflow-hidden">
            <CardHeader className="px-6 py-4 border-b border-slate-100 flex flex-row justify-between items-center">
              <CardTitle className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Doctors Directory</CardTitle>
              <Button onClick={handleOpenAddDoctor} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl flex items-center gap-1 text-xs py-2 font-bold cursor-pointer">
                <Plus size={16} />
                <span>Add Doctor</span>
              </Button>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[#475569] font-bold">
                    <th className="p-4">Name</th>
                    <th className="p-4">Specialization</th>
                    <th className="p-4">Experience</th>
                    <th className="p-4">Clinic Location</th>
                    <th className="p-4">Qualifications</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {doctors.map((doc: any) => (
                    <tr key={doc._id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-800">{doc.fullName}</td>
                      <td className="p-4"><span className="bg-blue-50 text-blue-600 font-bold px-2.5 py-0.5 rounded-full">{doc.specialization}</span></td>
                      <td className="p-4 font-semibold text-slate-600">{doc.yearsOfExperience} Years</td>
                      <td className="p-4 font-semibold text-slate-600">
                        {doc.clinic?.name || <span className="text-slate-400 italic">Unassigned</span>}
                      </td>
                      <td className="p-4 text-slate-500 line-clamp-1">{doc.qualifications?.join(", ") || "None"}</td>
                      <td className="p-4 text-right">
                        <Button variant="outline" size="sm" onClick={() => handleOpenEditDoctor(doc)} className="text-xs rounded-lg p-1.5 cursor-pointer">
                          <Edit3 size={14} className="text-slate-600" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* PATIENTS TAB */}
      {activeTab === "patients" && (
        <div className="space-y-6">
          <Card className="rounded-2xl border-slate-100 shadow-sm bg-white overflow-hidden">
            <CardHeader className="px-6 py-4 border-b border-slate-100 flex flex-row justify-between items-center">
              <CardTitle className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Patients Directory (Public Info Only)</CardTitle>
              <Button onClick={handleOpenAddPatient} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl flex items-center gap-1 text-xs py-2 font-bold cursor-pointer">
                <Plus size={16} />
                <span>Add Patient</span>
              </Button>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[#475569] font-bold">
                    <th className="p-4">Name</th>
                    <th className="p-4">Gender</th>
                    <th className="p-4">Blood Group</th>
                    <th className="p-4">Chronic Diseases</th>
                    <th className="p-4">Emergency Contact</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {patients.map((pat: any) => (
                    <React.Fragment key={pat._id}>
                      <tr className="hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-slate-800">{pat.fullName}</td>
                        <td className="p-4 capitalize text-slate-600 font-semibold">{pat.gender}</td>
                        <td className="p-4 font-bold text-slate-600">{pat.bloodType || "Unknown"}</td>
                        <td className="p-4 text-slate-500">{pat.chronicDiseases?.join(", ") || "None"}</td>
                        <td className="p-4">
                          {pat.emergencyContact?.name ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setActiveContactPatient(pat)}
                              className="text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer"
                            >
                              Show Contact
                            </Button>
                          ) : (
                            <span className="text-slate-400 italic">None</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleOpenEditPatient(pat)} className="text-xs rounded-lg p-1.5 cursor-pointer">
                            <Edit3 size={14} className="text-slate-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTogglePatientAppts(pat._id)}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/5"
                          >
                            {expandedPatientApptId === pat._id ? "Hide ▲" : "View Appointments ▼"}
                          </Button>
                          <Button size="sm" onClick={() => {
                            setBookingModalPatient(pat);
                            setBookingClinicId("");
                            setBookingDoctorId("");
                            setSelectedSlotId("");
                            setAvailableSlots([]);
                          }} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-[10px] font-bold px-2.5 py-1 cursor-pointer">
                            Book Appointment
                          </Button>
                        </td>
                      </tr>

                      {expandedPatientApptId === pat._id && (
                        <tr>
                          <td colSpan={6} className="bg-slate-50/70 px-6 py-4 border-t border-slate-100">
                            {loadingPatientAppts[pat._id] ? (
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 border-t-[#2563EB] animate-spin" />
                                <span>Loading appointments...</span>
                              </div>
                            ) : patientAppts[pat._id] && patientAppts[pat._id].length > 0 ? (
                              <div className="space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                  Appointments for {pat.fullName}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                  {patientAppts[pat._id].map((appt: any) => {
                                    const now = new Date();
                                    const apptDate = new Date(appt.date);
                                    const isUpcoming = apptDate > now && appt.status !== "Completed" && appt.status !== "Cancelled";
                                    const myReg = appt.patient?.find((p: any) => {
                                      const pid = p.patientId?._id || p.patientId;
                                      return pid?.toString() === pat._id?.toString();
                                    });

                                    return (
                                      <div key={appt._id} className={`bg-white rounded-xl border p-3 text-xs space-y-1.5 ${
                                        isUpcoming ? "border-[#2563EB]/20 shadow-[0_2px_8px_rgba(37,99,235,0.04)]" : "border-slate-100"
                                      }`}>
                                        <div className="flex items-center justify-between">
                                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                            appt.status === "Completed" ? "bg-[#16A34A]/10 text-[#16A34A]"
                                            : appt.status === "Cancelled" ? "bg-red-500/10 text-red-500"
                                            : isUpcoming ? "bg-[#2563EB]/10 text-[#2563EB]"
                                            : "bg-[#F59E0B]/10 text-[#F59E0B]"
                                          }`}>
                                            {appt.status}
                                          </span>
                                          <span className="text-[10px] text-slate-400 font-semibold">
                                            {new Date(appt.date).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <p className="font-bold text-slate-800">Dr. {appt.doctor?.fullName || "Specialist"}</p>
                                        {appt.clinic?.name && <p className="text-slate-500">{appt.clinic.name}</p>}
                                        {myReg?.registrationStatus && (
                                          <p className="text-slate-500">
                                            Registration: <span className="font-semibold capitalize">{myReg.registrationStatus}</span>
                                          </p>
                                        )}
                                        {appt.notes && (
                                          <div className="mt-1">
                                            <MedicalNotesDisplay notes={appt.notes} compact={true} />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs italic text-slate-400">No appointment history found for this patient.</p>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SLOTS TAB */}
      {activeTab === "slots" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Label htmlFor="slots-doc-select" className="text-xs font-bold whitespace-nowrap">Filter Doctor:</Label>
                <select
                  id="slots-doc-select"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none w-full sm:w-56"
                  value={slotsFilterDoctorId}
                  onChange={(e) => setSlotsFilterDoctorId(e.target.value)}
                >
                  <option value="">-- All Doctors --</option>
                  {doctors.map((doc: any) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.fullName} ({doc.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="slots-date-select" className="text-xs font-bold whitespace-nowrap">Date:</Label>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const baseDate = slotsDateFilter ? new Date(slotsDateFilter) : new Date();
                      baseDate.setDate(baseDate.getDate() - 1);
                      setSlotsDateFilter(baseDate.toISOString().split("T")[0]);
                    }}
                    className="h-8 px-2 rounded-lg border-slate-200 hover:bg-slate-50 text-xs cursor-pointer"
                  >
                    ←
                  </Button>
                  <Input
                    id="slots-date-select"
                    type="date"
                    value={slotsDateFilter}
                    onChange={(e) => setSlotsDateFilter(e.target.value)}
                    className="h-8 rounded-lg border-slate-200 text-xs px-2 focus:border-[#2563EB] w-36"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const baseDate = slotsDateFilter ? new Date(slotsDateFilter) : new Date();
                      baseDate.setDate(baseDate.getDate() + 1);
                      setSlotsDateFilter(baseDate.toISOString().split("T")[0]);
                    }}
                    className="h-8 px-2 rounded-lg border-slate-200 hover:bg-slate-50 text-xs cursor-pointer"
                  >
                    →
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSlotsDateFilter(new Date().toISOString().split("T")[0])}
                    className="h-8 px-2 text-[#2563EB] hover:bg-[#2563EB]/5 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Today
                  </Button>
                </div>
              </div>

              {(slotsFilterDoctorId || slotsDateFilter) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetSlotFilters}
                  className="h-8 px-3 rounded-lg border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Reset Filters</span>
                </Button>
              )}
            </div>

            <Button
              disabled={!slotsFilterDoctorId}
              onClick={() => {
                const selectedDoc = doctors.find((d: any) => d._id === slotsFilterDoctorId);
                const clinicId = selectedDoc?.clinic?._id || selectedDoc?.clinic;
                if (!clinicId) {
                  setActionError("Cannot create slots. Please select a doctor assigned to a clinic first.");
                  return;
                }
                setEditingSlot(null);
                setAdminSlotDate("");
                setAdminSlotTime("08:00");
                setAdminSlotEndTime("12:00");
                setAdminSlotDuration(30);
                setAdminSlotModalOpen(true);
              }}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white disabled:bg-slate-200 rounded-xl text-xs py-2 font-bold cursor-pointer"
            >
              <Plus size={16} className="mr-1" />
              <span>Create Session</span>
            </Button>
          </div>

          <Card className="rounded-2xl border-slate-100 shadow-sm p-5 bg-white space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Cancel Doctor's Day (Vacation / Sickness)</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Cancel all remaining sessions for today or full day sessions for future dates.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="cancel-doc-select" className="text-xs font-bold whitespace-nowrap">Select Doctor:</Label>
                <select
                  id="cancel-doc-select"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none w-full sm:w-56"
                  value={slotsFilterDoctorId}
                  onChange={(e) => setSlotsFilterDoctorId(e.target.value)}
                >
                  <option value="">-- Select Doctor --</option>
                  {doctors.map((doc: any) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.fullName} ({doc.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="cancel-date-select" className="text-xs font-bold whitespace-nowrap">Date:</Label>
                <Input
                  id="cancel-date-select"
                  type="date"
                  value={slotsCancelDate}
                  onChange={(e) => setSlotsCancelDate(e.target.value)}
                  min={getLocalDateString()}
                  className="h-9 text-xs border border-slate-200 rounded-xl px-3 text-[#0F172A] focus:outline-none focus:border-[#2563EB] bg-white cursor-pointer"
                />
              </div>

              <Button
                disabled={!slotsFilterDoctorId}
                size="sm"
                variant="outline"
                onClick={handleAdminCancelDay}
                className="border-red-500 text-red-500 hover:bg-red-500/5 hover:border-red-600 hover:text-red-600 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer flex items-center gap-1.5 disabled:opacity-30 self-end sm:self-center"
              >
                <XCircle size={14} />
                <span>
                  {!slotsCancelDate || slotsCancelDate === getLocalDateString()
                    ? "Cancel Rest of Today"
                    : "Cancel Full Day"}
                </span>
              </Button>
            </div>
          </Card>

          {(() => {
            if (loadingSlots) {
              return (
                <div className="p-10 text-center text-xs text-slate-500 font-semibold bg-white rounded-2xl border border-slate-100 shadow-sm">
                  Loading consultation slots...
                </div>
              );
            }

            if (filteredSlots.length === 0) {
              return (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center max-w-md mx-auto my-6">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-4">
                    <Calendar size={32} />
                  </div>
                  <h3 className="font-bold text-lg text-[#0F172A] mb-2">No Slots Found</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    {slotsFilterDoctorId || slotsDateFilter
                      ? "No consultation slots match the selected date or doctor filter."
                      : "No consultation slots have been created yet."}
                  </p>
                </div>
              );
            }

            const calculateGroupInterval = (slots: any[]) => {
              if (!slots || slots.length === 0) return "";
              const times = slots.map((s) => {
                const [h, m] = (s.time || "00:00").split(":").map(Number);
                const dur = s.duration || 30;
                return { startMin: h * 60 + m, endMin: h * 60 + m + dur };
              });
              times.sort((a, b) => a.startMin - b.startMin);

              const minStart = times[0].startMin;
              const maxEnd = times[times.length - 1].endMin;

              const minH = String(Math.floor(minStart / 60)).padStart(2, "0");
              const minM = String(minStart % 60).padStart(2, "0");
              const maxH = String(Math.floor(maxEnd / 60)).padStart(2, "0");
              const maxM = String(maxEnd % 60).padStart(2, "0");

              return `${minH}:${minM} - ${maxH}:${maxM}`;
            };

            const renderSlotTable = (slotsList: any[]) => {
              if (slotsList.length === 0) {
                return (
                  <div className="p-6 text-center text-xs text-slate-400 italic">
                    No slots scheduled in this period.
                  </div>
                );
              }

              // Group slots by Doctor + Date + Session Time Interval
              const groupsMap = new Map<string, {
                key: string;
                doctorName: string;
                clinicName: string;
                dateStr: string;
                intervalStr: string;
                slots: any[];
              }>();

              for (const slot of slotsList) {
                const docObj = slot.doctor;
                const docId = docObj?._id || (typeof docObj === "string" ? docObj : "unknown");
                const docName = docObj?.fullName || doctors.find((d: any) => d._id === docId)?.fullName || "Specialist";
                const clinicName = slot.clinic?.name || docObj?.clinic?.name || "";
                const dateStr = slot.date ? new Date(slot.date).toLocaleDateString() : "";
                const dateKey = slot.date ? new Date(slot.date).toISOString().split("T")[0] : "";
                const sessionKey = slot.session?._id || slot.session || `${docId}_${dateKey}`;
                const groupKey = `${docId}_${dateKey}_${sessionKey}`;

                if (!groupsMap.has(groupKey)) {
                  groupsMap.set(groupKey, {
                    key: groupKey,
                    doctorName: docName,
                    clinicName,
                    dateStr,
                    intervalStr: "",
                    slots: [],
                  });
                }

                groupsMap.get(groupKey)!.slots.push(slot);
              }

              const groupsArr = Array.from(groupsMap.values());
              for (const group of groupsArr) {
                group.slots.sort((a, b) => (a.time || "").localeCompare(b.time || ""));
                const firstSlot = group.slots[0];
                if (firstSlot.session && firstSlot.session.startTime && firstSlot.session.endTime) {
                  group.intervalStr = `${firstSlot.session.startTime} - ${firstSlot.session.endTime}`;
                } else {
                  group.intervalStr = calculateGroupInterval(group.slots);
                }
              }

              return (
                <div className="space-y-3 p-3 bg-slate-50/50">
                  {groupsArr.map((group) => {
                    const isOpen = Boolean(openDoctorIntervals[group.key]);
                    return (
                      <div key={group.key} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all">
                        {/* TOGGLED HEADER SECTION (Closed by default) */}
                        <button
                          type="button"
                          onClick={() =>
                            setOpenDoctorIntervals((prev) => ({
                              ...prev,
                              [group.key]: !prev[group.key],
                            }))
                          }
                          className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-slate-50/80 transition-colors cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-black text-xs shrink-0">
                              <User size={16} />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#0F172A] flex items-center gap-2">
                                <span>{group.doctorName}</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#2563EB]/10 text-[#2563EB]">
                                  {group.intervalStr}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                                {group.clinicName && <span>{group.clinicName}</span>}
                                {group.clinicName && <span>•</span>}
                                <span>{group.dateStr}</span>
                                <span>•</span>
                                <span className="font-semibold text-slate-600">{group.slots.length} Slots</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {isOpen ? "Hide Slots" : "Show Slots"}
                            </span>
                            <span className="text-slate-400 text-xs font-bold">{isOpen ? "▲" : "▼"}</span>
                          </div>
                        </button>

                        {/* TOGGLED CONTENT (Renders when clicked) */}
                        {isOpen && (
                          <div className="border-t border-slate-100 overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100 text-[#475569] font-bold">
                                  <th className="p-3.5">Time Interval</th>
                                  <th className="p-3.5">Slot Duration</th>
                                  <th className="p-3.5">Max Patients</th>
                                  <th className="p-3.5">Status</th>
                                  <th className="p-3.5 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {group.slots.map((slot: any) => (
                                  <tr key={slot._id} className="hover:bg-slate-50/50">
                                    <td className="p-3.5 font-bold text-[#2563EB]">
                                      {formatTimeInterval(slot.time, slot.duration)}
                                    </td>
                                    <td className="p-3.5 text-slate-500">{slot.duration / (slot.MaxNumberOfPatients || 1)} Mins</td>
                                    <td className="p-3.5 text-slate-500">{slot.MaxNumberOfPatients}</td>
                                    <td className="p-3.5">
                                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                        slot.status === "Scheduled" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
                                      }`}>
                                        {slot.status}
                                      </span>
                                    </td>
                                    <td className="p-3.5 text-right space-x-2">
                                      {(() => {
                                        const isSlotPast = slot.appointmentTime ? new Date(slot.appointmentTime) < new Date() : false;
                                        return (
                                          <button
                                            disabled={(slot.patient && slot.patient.length > 0) || isSlotPast}
                                            onClick={() => handleDeleteAdminSlot(slot._id)}
                                            className="text-red-500 hover:bg-red-500/5 disabled:opacity-30 p-1.5 rounded-lg transition-all cursor-pointer inline-flex items-center align-middle"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        );
                                      })()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            };

            const isDateFiltered = Boolean(slotsDateFilter);

            if (isDateFiltered) {
              // Direct flat view ONLY when date filter is applied - NO section organizers
              return (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-0">
                  <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Filtered Sessions ({filteredSlots.length})
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Showing results for {slotsFilterDoctorId ? doctors.find((d: any) => d._id === slotsFilterDoctorId)?.fullName || "Selected Doctor" : "All Doctors"}
                      {` on ${new Date(slotsDateFilter).toLocaleDateString()}`}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    {renderSlotTable(filteredSlots)}
                  </div>
                </div>
              );
            }

            // Unfiltered View: Section accordions for Today, Upcoming 2 Days, and Past 2 Days
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayTime = today.getTime();
            const oneDayMs = 24 * 60 * 60 * 1000;
            const todayStr = today.toISOString().split("T")[0];

            const todaySlots = filteredSlots.filter((s: any) => {
              const dStr = new Date(s.date).toISOString().split("T")[0];
              return dStr === todayStr;
            });

            const upcomingSlots = filteredSlots.filter((s: any) => {
              const sDate = new Date(s.date);
              sDate.setHours(0, 0, 0, 0);
              const diffDays = Math.round((sDate.getTime() - todayTime) / oneDayMs);
              return diffDays >= 1 && diffDays <= 2;
            });

            const pastSlots = filteredSlots
              .filter((s: any) => {
                const sDate = new Date(s.date);
                sDate.setHours(0, 0, 0, 0);
                const diffDays = Math.round((todayTime - sDate.getTime()) / oneDayMs);
                return diffDays >= 1 && diffDays <= 2;
              })
              .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

            return (
              <div className="space-y-4">
                {/* TODAY SECTION */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setAdminTodaySlotsOpen(!adminTodaySlotsOpen)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider text-[#16A34A] border-b border-slate-100 cursor-pointer text-left"
                  >
                    <span>Today's Sessions ({todaySlots.length})</span>
                    <span>{adminTodaySlotsOpen ? "▲" : "▼"}</span>
                  </button>
                  {adminTodaySlotsOpen && (
                    <div className="p-0 overflow-x-auto">
                      {todaySlots.length > 0 ? (
                        renderSlotTable(todaySlots)
                      ) : (
                        <div className="p-6 text-center text-xs text-slate-400 italic">No sessions scheduled for today.</div>
                      )}
                    </div>
                  )}
                </div>

                {/* UPCOMING 2 DAYS SECTION */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setAdminUpcomingSlotsOpen(!adminUpcomingSlotsOpen)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider text-[#2563EB] border-b border-slate-100 cursor-pointer text-left"
                  >
                    <span>Upcoming Sessions (Next 2 Days) ({upcomingSlots.length})</span>
                    <span>{adminUpcomingSlotsOpen ? "▲" : "▼"}</span>
                  </button>
                  {adminUpcomingSlotsOpen && (
                    <div className="p-0 overflow-x-auto">
                      {upcomingSlots.length > 0 ? (
                        renderSlotTable(upcomingSlots)
                      ) : (
                        <div className="p-6 text-center text-xs text-slate-400 italic">No sessions scheduled for the next 2 days.</div>
                      )}
                    </div>
                  )}
                </div>

                {/* PAST 2 DAYS SECTION */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setAdminPastSlotsOpen(!adminPastSlotsOpen)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 cursor-pointer text-left"
                  >
                    <span>Past Sessions (Last 2 Days) ({pastSlots.length})</span>
                    <span>{adminPastSlotsOpen ? "▲" : "▼"}</span>
                  </button>
                  {adminPastSlotsOpen && (
                    <div className="p-0 overflow-x-auto opacity-75">
                      {pastSlots.length > 0 ? (
                        renderSlotTable(pastSlots)
                      ) : (
                        <div className="p-6 text-center text-xs text-slate-400 italic">No sessions found for the last 2 days.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === "messages" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Doctor Inbox & Requests</h2>
            <p className="text-sm text-[#64748B]">Read and manage support and scheduling request messages from doctors.</p>
          </div>

          {loadingMessages ? (
            <div className="p-10 text-center text-xs text-slate-500 font-semibold">Loading messages...</div>
          ) : (() => {
            const docMessages = messages.filter((m: any) => m.senderRole === "doctor");
            if (docMessages.length === 0) {
              return (
                <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm w-full mt-6">
                  <p className="text-sm font-semibold text-[#64748B]">No messages received from doctors.</p>
                </div>
              );
            }
            return (
              <div className="grid grid-cols-1 gap-4">
                {docMessages.map((msg: any) => (
                  <Card key={msg._id} className="rounded-2xl border-slate-100 shadow-sm p-6 bg-white space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-50 pb-3">
                      <div>
                        <h3 className="font-bold text-[#0F172A] text-sm">{msg.senderName}</h3>
                        <p className="text-[10px] text-[#64748B] font-semibold mt-0.5">{msg.senderEmail}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] bg-blue-50 text-[#2563EB] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {msg.senderRole}
                        </span>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">
                          {new Date(msg.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    </div>
                  </Card>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
