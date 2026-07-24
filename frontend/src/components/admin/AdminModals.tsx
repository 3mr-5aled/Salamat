import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { DatePicker } from "../ui/date-picker";
import { TimeSelectPair } from "../shared/TimeSelectPair";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { getLocalDateString } from "../../lib/formatters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";

interface AdminModalsProps {
  admin: ReturnType<typeof useAdminDashboard>;
}

export const AdminModals: React.FC<AdminModalsProps> = ({ admin }) => {
  const {
    // Clinic modal
    clinicModalOpen,
    setClinicModalOpen,
    editingClinic,
    clinicName,
    setClinicName,
    clinicNum,
    setClinicNum,
    clinicSpec,
    setClinicSpec,
    clinicDesc,
    setClinicDesc,
    clinicFloor,
    setClinicFloor,
    clinicRoom,
    setClinicRoom,
    handleSaveClinic,

    // Assign doctor modal
    assignModalClinic,
    setAssignModalClinic,
    doctors,
    handleAssignDoctor,

    // Book appointment modal
    bookingModalPatient,
    setBookingModalPatient,
    qbActiveTab,
    setQbActiveTab,
    qbSearchQuery,
    setQbSearchQuery,
    patients,
    bookingClinicId,
    setBookingClinicId,
    bookingDoctorId,
    setBookingDoctorId,
    bookingDateFilter,
    setBookingDateFilter,
    availableSlots,
    selectedSlotId,
    setSelectedSlotId,
    handleCreateQuickPatient,
    qbNewName,
    setQbNewName,
    qbNewPhone,
    setQbNewPhone,
    qbNewGender,
    setQbNewGender,
    qbNewDob,
    setQbNewDob,
    clinics,
    handleBookAppointment,

    // Emergency contact modal
    activeContactPatient,
    setActiveContactPatient,

    // Add Doctor modal
    doctorModalOpen,
    setDoctorModalOpen,
    editingDoctor,
    docName,
    setDocName,
    docEmail,
    setDocEmail,
    docPassword,
    setDocPassword,
    docPhone,
    setDocPhone,
    docSpec,
    setDocSpec,
    docGender,
    setDocGender,
    docDob,
    setDocDob,
    docClinic,
    setDocClinic,
    docAvailability,
    setDocAvailability,
    handleCreateDoctor,


    // Add Patient modal
    patientModalOpen,
    setPatientModalOpen,
    editingPatient,
    patName,
    setPatName,
    patEmail,
    setPatEmail,
    patPassword,
    setPatPassword,
    patPhone,
    setPatPhone,
    patGender,
    setPatGender,
    patDob,
    setPatDob,
    handleCreatePatient,

    // Admin Slot modal
    adminSlotModalOpen,
    setAdminSlotModalOpen,
    editingSlot,
    setEditingSlot,
    adminSlotDate,
    setAdminSlotDate,
    adminSlotTime,
    setAdminSlotTime,
    adminSlotEndTime,
    setAdminSlotEndTime,
    adminSlotDuration,
    setAdminSlotDuration,
    adminSlotRepeat,
    setAdminSlotRepeat,
    adminSlotRepeatUntil,
    setAdminSlotRepeatUntil,
    handleCreateAdminSlot,
  } = admin;

  return (
    <>
      {/* CLINIC CREATE / EDIT MODAL */}
      <Dialog open={clinicModalOpen} onOpenChange={(open) => { if (!open) setClinicModalOpen(false); }}>
        <DialogContent className="max-w-md sm:rounded-3xl p-0 overflow-hidden">
          <DialogHeader className="p-6 bg-slate-50/50 border-b border-slate-100 text-left sm:text-left">
            <div className="flex items-center justify-between pr-6">
              <DialogTitle className="text-lg font-black text-[#0F172A]">
                {editingClinic ? "Edit Clinic Details" : "Create New Clinic"}
              </DialogTitle>
              <Badge variant={editingClinic ? "secondary" : "default"}>
                {editingClinic ? "Editing" : "New"}
              </Badge>
            </div>
          </DialogHeader>
          <form onSubmit={handleSaveClinic}>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="c-name" className="text-xs font-bold">
                    Clinic Name
                  </Label>
                  <Input
                    id="c-name"
                    required
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="rounded-xl border-slate-200 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="c-num" className="text-xs font-bold">
                    Clinic Number
                  </Label>
                  <Input
                    id="c-num"
                    required
                    placeholder="CL-001"
                    value={clinicNum}
                    onChange={(e) => setClinicNum(e.target.value)}
                    className="rounded-xl border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="c-spec" className="text-xs font-bold">
                  Clinical Specialty
                </Label>
                <select
                  id="c-spec"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none"
                  value={clinicSpec}
                  onChange={(e) => setClinicSpec(e.target.value)}
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Obstetrics and Gynecology">
                    Obstetrics and Gynecology
                  </option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Ophthalmology">Ophthalmology</option>
                  <option value="ENT (Otolaryngology)">
                    ENT (Otolaryngology)
                  </option>
                  <option value="Dental">Dental</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="c-floor" className="text-xs font-bold">
                    Floor
                  </Label>
                  <Input
                    id="c-floor"
                    placeholder="1st Floor"
                    value={clinicFloor}
                    onChange={(e) => setClinicFloor(e.target.value)}
                    className="rounded-xl border-slate-200 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="c-room" className="text-xs font-bold">
                    Room Number
                  </Label>
                  <Input
                    id="c-room"
                    placeholder="102"
                    value={clinicRoom}
                    onChange={(e) => setClinicRoom(e.target.value)}
                    className="rounded-xl border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="c-desc" className="text-xs font-bold">
                  Description
                </Label>
                <textarea
                  id="c-desc"
                  rows={2}
                  value={clinicDesc}
                  onChange={(e) => setClinicDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:outline-none resize-none"
                />
              </div>
            </div>
            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex sm:justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setClinicModalOpen(false)}
                className="rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Save Clinic
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ASSIGN DOCTOR MODAL */}
      <Dialog open={Boolean(assignModalClinic)} onOpenChange={(open) => { if (!open) setAssignModalClinic(null); }}>
        <DialogContent className="max-w-md sm:rounded-3xl p-0 overflow-hidden">
          <DialogHeader className="p-6 bg-slate-50/50 border-b border-slate-100 text-left sm:text-left">
            <div className="flex items-center justify-between pr-6">
              <div>
                <DialogTitle className="text-lg font-black text-[#0F172A]">
                  Assign Doctor
                </DialogTitle>
                {assignModalClinic && (
                  <DialogDescription className="text-xs text-slate-500 font-semibold mt-0.5">
                    Select doctor to assign to {assignModalClinic.name} (
                    {assignModalClinic.specialty}).
                  </DialogDescription>
                )}
              </div>
              {assignModalClinic && (
                <Badge variant="outline">{assignModalClinic.specialty}</Badge>
              )}
            </div>
          </DialogHeader>
          <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
            {assignModalClinic && doctors.filter(
              (doc) =>
                doc.specialization === assignModalClinic.specialty &&
                doc.clinic?._id !== assignModalClinic._id
            ).length > 0 ? (
              doctors
                .filter(
                  (doc) =>
                    doc.specialization === assignModalClinic.specialty &&
                    doc.clinic?._id !== assignModalClinic._id
                )
                .map((doc) => (
                  <div
                    key={doc._id}
                    className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {doc.fullName}
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold">
                        Current clinic: {doc.clinic?.name || "Unassigned"}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAssignDoctor(doc._id)}
                      className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Assign
                    </Button>
                  </div>
                ))
            ) : (
              <div className="text-center py-6 text-xs text-slate-400 italic">
                No unassigned doctors available for specialty{" "}
                {assignModalClinic?.specialty}.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* BOOK APPOINTMENT MODAL */}
      <Dialog open={Boolean(bookingModalPatient)} onOpenChange={(open) => { if (!open) setBookingModalPatient(null); }}>
        <DialogContent className="max-w-md sm:rounded-3xl p-0 overflow-hidden">
          {bookingModalPatient && bookingModalPatient._id === "" ? (
            // Step 1: Patient Selection / Creation
            <>
              <DialogHeader className="p-6 bg-slate-50/50 border-b border-slate-100 text-left sm:text-left">
                <div>
                  <DialogTitle className="text-lg font-black text-[#0F172A]">
                    Quick Booking — Select Patient
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 font-semibold mt-0.5">
                    Choose an existing patient or create a temporary patient record.
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="px-6 pt-4">
                <div className="flex border-b border-slate-200 gap-1.5 pb-px">
                  <button
                    type="button"
                    onClick={() => setQbActiveTab("search")}
                    className={`px-4 py-2 text-xs font-bold uppercase border-b-2 cursor-pointer ${
                      qbActiveTab === "search"
                        ? "border-[#2563EB] text-[#2563EB]"
                        : "border-transparent text-slate-400"
                    }`}
                  >
                    Search Existing
                  </button>
                  <button
                    type="button"
                    onClick={() => setQbActiveTab("create")}
                    className={`px-4 py-2 text-xs font-bold uppercase border-b-2 cursor-pointer ${
                      qbActiveTab === "create"
                        ? "border-[#2563EB] text-[#2563EB]"
                        : "border-transparent text-slate-400"
                    }`}
                  >
                    Create Temporary
                  </button>
                </div>
              </div>

              {qbActiveTab === "search" ? (
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="qb-search" className="text-xs font-bold">
                      Search Patient Name or Phone
                    </Label>
                    <Input
                      id="qb-search"
                      type="text"
                      placeholder="Type name or phone..."
                      value={qbSearchQuery}
                      onChange={(e) => setQbSearchQuery(e.target.value)}
                      className="rounded-xl border-slate-200 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {patients
                      .filter(
                        (p) =>
                          p.fullName
                            .toLowerCase()
                            .includes(qbSearchQuery.toLowerCase()) ||
                          (p.phone && p.phone.includes(qbSearchQuery))
                      )
                      .slice(0, 5)
                      .map((p) => (
                        <div
                          key={p._id}
                          className="flex items-center justify-between p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all text-xs"
                        >
                          <div>
                            <div className="font-bold text-slate-800">
                              {p.fullName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-semibold">
                              {p.phone || "No phone"} ·{" "}
                              {p.medicalRecordNumber}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              setBookingModalPatient(p);
                              setBookingClinicId("");
                              setBookingDoctorId("");
                              setSelectedSlotId("");
                            }}
                            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-[10px] font-bold py-1.5 px-2.5 cursor-pointer"
                          >
                            Select
                          </Button>
                        </div>
                      ))}
                    {patients.filter(
                      (p) =>
                        p.fullName
                          .toLowerCase()
                          .includes(qbSearchQuery.toLowerCase()) ||
                        (p.phone && p.phone.includes(qbSearchQuery))
                    ).length === 0 && (
                      <div className="text-center py-6 text-xs text-slate-400 italic">
                        No matching patients found.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateQuickPatient}>
                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="qb-name" className="text-xs font-bold">
                        Full Name
                      </Label>
                      <Input
                        id="qb-name"
                        required
                        value={qbNewName}
                        onChange={(e) => setQbNewName(e.target.value)}
                        className="rounded-xl border-slate-200 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="qb-phone" className="text-xs font-bold">
                        Phone Number (Optional)
                      </Label>
                      <Input
                        id="qb-phone"
                        placeholder="01012345678"
                        value={qbNewPhone}
                        onChange={(e) => setQbNewPhone(e.target.value)}
                        className="rounded-xl border-slate-200 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label
                          htmlFor="qb-gender"
                          className="text-xs font-bold"
                        >
                          Gender
                        </Label>
                        <select
                          id="qb-gender"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none"
                          value={qbNewGender}
                          onChange={(e) => setQbNewGender(e.target.value)}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="qb-dob" className="text-xs font-bold">
                          Date of Birth
                        </Label>
                        <DatePicker
                          id="qb-dob"
                          value={qbNewDob}
                          onChange={(e) => setQbNewDob(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex sm:justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setBookingModalPatient(null)}
                      className="rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Create & Select
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </>
          ) : (
            // Step 2: Book appointment slot
            <>
              <DialogHeader className="p-6 bg-slate-50/50 border-b border-slate-100 text-left sm:text-left">
                <div>
                  <DialogTitle className="text-lg font-black text-[#0F172A]">
                    Book Appointment Slot
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 font-semibold mt-0.5">
                    Register appointment for patient{" "}
                    {bookingModalPatient?.fullName}.
                  </DialogDescription>
                </div>
              </DialogHeader>
              <form onSubmit={handleBookAppointment}>
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="b-clinic" className="text-xs font-bold">
                      Select Clinic
                    </Label>
                    <select
                      id="b-clinic"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none"
                      value={bookingClinicId}
                      onChange={(e) => {
                        setBookingClinicId(e.target.value);
                        setBookingDoctorId("");
                      }}
                    >
                      <option value="">Choose Clinic</option>
                      {clinics.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name} ({c.specialty})
                        </option>
                      ))}
                    </select>
                  </div>

                  {(() => {
                    const selectedClinic = clinics.find(
                      (c) => c._id === bookingClinicId
                    );
                    const clinicHasNoDoctors =
                      selectedClinic &&
                      (!selectedClinic.doctors ||
                        selectedClinic.doctors.length === 0);
                    if (bookingClinicId && clinicHasNoDoctors) {
                      return (
                        <Badge variant="destructive" className="w-full justify-start p-3 text-xs rounded-xl font-medium flex items-center gap-2">
                          <AlertCircle size={14} className="shrink-0" />
                          <span>No doctors assigned for this clinic. Please assign a doctor first.</span>
                        </Badge>
                      );
                    }
                    return null;
                  })()}

                  <div className="space-y-1">
                    <Label htmlFor="b-doc" className="text-xs font-bold">
                      Select Doctor
                    </Label>
                    <select
                      id="b-doc"
                      required
                      disabled={
                        !bookingClinicId ||
                        clinics.find((c) => c._id === bookingClinicId)
                          ?.doctors?.length === 0
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none disabled:opacity-50"
                      value={bookingDoctorId}
                      onChange={(e) => {
                        setBookingDoctorId(e.target.value);
                        setBookingDateFilter("");
                        setSelectedSlotId("");
                      }}
                    >
                      <option value="">Choose Doctor</option>
                      {doctors
                        .filter(
                          (d) =>
                            d.clinic?._id === bookingClinicId ||
                            d.clinic === bookingClinicId
                        )
                        .map((d) => (
                          <option key={d._id} value={d._id}>
                            {d.fullName}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="b-date-filter" className="text-xs font-bold">
                      Filter Date of Appointment (Optional)
                    </Label>
                    <Input
                      id="b-date-filter"
                      type="date"
                      min={getLocalDateString()}
                      disabled={!bookingDoctorId}
                      value={bookingDateFilter}
                      onChange={(e) => {
                        setBookingDateFilter(e.target.value);
                        setSelectedSlotId("");
                      }}
                      className="rounded-xl border-slate-200 text-xs disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="b-slot" className="text-xs font-bold">
                      Choose Preferred Vacant Slot
                    </Label>
                    {(() => {
                      const filteredVacantSlots = availableSlots.filter((s: any) => {
                        if (!bookingDateFilter) return true;
                        const dStr = new Date(s.date).toISOString().split("T")[0];
                        return dStr === bookingDateFilter;
                      });

                      return (
                        <select
                          id="b-slot"
                          required
                          disabled={filteredVacantSlots.length === 0}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none disabled:opacity-50"
                          value={selectedSlotId}
                          onChange={(e) => setSelectedSlotId(e.target.value)}
                        >
                          <option value="">
                            {filteredVacantSlots.length === 0
                              ? bookingDoctorId
                                ? bookingDateFilter
                                  ? "No vacant slots on selected date"
                                  : "No vacant slots found"
                                : "Select doctor first"
                              : "Select Preferred Slot"}
                          </option>
                          {filteredVacantSlots.map((s) => (
                            <option key={s._id} value={s._id}>
                              {s.date ? new Date(s.date).toLocaleDateString() : ""} @ {s.time} ({s.duration} mins)
                            </option>
                          ))}
                        </select>
                      );
                    })()}
                  </div>
                </div>
                <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex sm:justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setBookingModalPatient(null)}
                    className="rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      !selectedSlotId ||
                      clinics.find((c) => c._id === bookingClinicId)?.doctors
                        ?.length === 0
                    }
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50 text-white"
                  >
                    Confirm Booking
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* EMERGENCY CONTACT MODAL */}
      <Dialog open={Boolean(activeContactPatient)} onOpenChange={(open) => { if (!open) setActiveContactPatient(null); }}>
        <DialogContent className="max-w-sm sm:rounded-3xl p-6">
          <DialogHeader className="text-left sm:text-left mb-2">
            <div className="flex items-center justify-between pr-4">
              <DialogTitle className="font-bold text-slate-800 text-sm">
                Emergency Contact Details
              </DialogTitle>
              <Badge variant="warning" className="text-[10px]">Emergency</Badge>
            </div>
          </DialogHeader>
          {activeContactPatient && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase text-[9px]">
                  Name:
                </span>{" "}
                {activeContactPatient.emergencyContact.name}
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase text-[9px]">
                  Relationship:
                </span>{" "}
                {activeContactPatient.emergencyContact.relation || "N/A"}
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase text-[9px]">
                  Phone:
                </span>{" "}
                {activeContactPatient.emergencyContact.phone || "N/A"}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ADD DOCTOR MODAL */}
      <Dialog open={doctorModalOpen} onOpenChange={(open) => { if (!open) setDoctorModalOpen(false); }}>
        <DialogContent className="max-w-md sm:rounded-3xl p-0 overflow-hidden">
          <DialogHeader className="p-6 bg-slate-50/50 border-b border-slate-100 text-left sm:text-left">
            <div className="flex items-center justify-between pr-6">
              <div>
                <DialogTitle className="text-lg font-black text-[#0F172A]">
                  {editingDoctor ? "Edit Doctor Profile" : "Add Doctor Profile"}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 font-semibold mt-0.5">
                  {editingDoctor
                    ? "Update doctor profile and user account details."
                    : "Create a new doctor profile and system user account."}
                </DialogDescription>
              </div>
              <Badge variant={editingDoctor ? "secondary" : "default"}>
                {editingDoctor ? "Editing" : "Doctor"}
              </Badge>
            </div>
          </DialogHeader>
          <form onSubmit={handleCreateDoctor}>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-1">
                <Label htmlFor="d-name" className="text-xs font-bold">
                  Full Name
                </Label>
                <Input
                  id="d-name"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="rounded-xl border-slate-200 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`space-y-1 ${
                    editingDoctor ? "col-span-2" : "col-span-1"
                  }`}
                >
                  <Label htmlFor="d-email" className="text-xs font-bold">
                    Email Address
                  </Label>
                  <Input
                    id="d-email"
                    type="email"
                    required
                    value={docEmail}
                    onChange={(e) => setDocEmail(e.target.value)}
                    className="rounded-xl border-slate-200 text-xs"
                  />
                </div>
                {!editingDoctor && (
                  <div className="space-y-1 col-span-1">
                    <Label htmlFor="d-password" className="text-xs font-bold">
                      Password (Optional)
                    </Label>
                    <Input
                      id="d-password"
                      type="password"
                      placeholder="Leave blank to auto-generate"
                      value={docPassword}
                      onChange={(e) => setDocPassword(e.target.value)}
                      className="rounded-xl border-slate-200 text-xs"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="d-phone" className="text-xs font-bold">
                  Phone Number
                </Label>
                <Input
                  id="d-phone"
                  placeholder="01012345678"
                  value={docPhone}
                  onChange={(e) => setDocPhone(e.target.value)}
                  className="rounded-xl border-slate-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="d-spec" className="text-xs font-bold">
                  Specialization
                </Label>
                <select
                  id="d-spec"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none"
                  value={docSpec}
                  onChange={(e) => setDocSpec(e.target.value)}
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Obstetrics and Gynecology">
                    Obstetrics and Gynecology
                  </option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Ophthalmology">Ophthalmology</option>
                  <option value="ENT (Otolaryngology)">
                    ENT (Otolaryngology)
                  </option>
                  <option value="Dental">Dental</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="d-clinic" className="text-xs font-bold">
                  Assign to Clinic (Optional)
                </Label>
                <select
                  id="d-clinic"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none"
                  value={docClinic}
                  onChange={(e) => setDocClinic(e.target.value)}
                >
                  <option value="">-- Unassigned --</option>
                  {clinics.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} - {c.specialty}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="d-gender" className="text-xs font-bold">
                    Gender
                  </Label>
                  <select
                    id="d-gender"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none"
                    value={docGender}
                    onChange={(e) => setDocGender(e.target.value)}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="d-dob" className="text-xs font-bold">
                    Date of Birth
                  </Label>
                  <DatePicker
                    id="d-dob"
                    value={docDob}
                    onChange={(e) => setDocDob(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold">Practice Hours (Availability)</Label>
                  <button
                    type="button"
                    onClick={() =>
                      setDocAvailability([
                        ...docAvailability,
                        { dayOfWeek: "Monday", startTime: "09:00", endTime: "17:00" },
                      ])
                    }
                    className="text-[#2563EB] hover:text-[#1D4ED8] text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Add day</span>
                  </button>
                </div>

                {docAvailability.length === 0 && (
                  <p className="text-[11px] text-slate-400 italic">No practice hours set yet.</p>
                )}

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {docAvailability.map((av: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <select
                        value={av.dayOfWeek}
                        onChange={(e) => {
                          const next = [...docAvailability];
                          next[idx] = { ...next[idx], dayOfWeek: e.target.value };
                          setDocAvailability(next);
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none flex-1"
                      >
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <input
                        type="time"
                        value={av.startTime}
                        onChange={(e) => {
                          const next = [...docAvailability];
                          next[idx] = { ...next[idx], startTime: e.target.value };
                          setDocAvailability(next);
                        }}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs focus:outline-none w-20 bg-white"
                      />
                      <span className="text-xs text-slate-400">to</span>
                      <input
                        type="time"
                        value={av.endTime}
                        onChange={(e) => {
                          const next = [...docAvailability];
                          next[idx] = { ...next[idx], endTime: e.target.value };
                          setDocAvailability(next);
                        }}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs focus:outline-none w-20 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setDocAvailability(docAvailability.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex sm:justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDoctorModalOpen(false)}
                className="rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {editingDoctor ? "Save Changes" : "Create Doctor"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ADD PATIENT MODAL */}
      <Dialog open={patientModalOpen} onOpenChange={(open) => { if (!open) setPatientModalOpen(false); }}>
        <DialogContent className="max-w-md sm:rounded-3xl p-0 overflow-hidden">
          <DialogHeader className="p-6 bg-slate-50/50 border-b border-slate-100 text-left sm:text-left">
            <div className="flex items-center justify-between pr-6">
              <div>
                <DialogTitle className="text-lg font-black text-[#0F172A]">
                  {editingPatient
                    ? "Edit Patient Profile"
                    : "Add Patient Profile"}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 font-semibold mt-0.5">
                  {editingPatient
                    ? "Update patient profile and user account details."
                    : "Create a new patient profile and optional system user account."}
                </DialogDescription>
              </div>
              <Badge variant={editingPatient ? "secondary" : "default"}>
                {editingPatient ? "Editing" : "Patient"}
              </Badge>
            </div>
          </DialogHeader>
          <form onSubmit={handleCreatePatient}>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-1">
                <Label htmlFor="p-name" className="text-xs font-bold">
                  Full Name
                </Label>
                <Input
                  id="p-name"
                  required
                  value={patName}
                  onChange={(e) => setPatName(e.target.value)}
                  className="rounded-xl border-slate-200 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`space-y-1 ${
                    editingPatient ? "col-span-2" : "col-span-1"
                  }`}
                >
                  <Label htmlFor="p-email" className="text-xs font-bold">
                    Email Address (Optional)
                  </Label>
                  <Input
                    id="p-email"
                    type="email"
                    value={patEmail}
                    onChange={(e) => setPatEmail(e.target.value)}
                    className="rounded-xl border-slate-200 text-xs"
                  />
                </div>
                {!editingPatient && (
                  <div className="space-y-1 col-span-1">
                    <Label htmlFor="p-password" className="text-xs font-bold">
                      Password (Optional)
                    </Label>
                    <Input
                      id="p-password"
                      type="password"
                      placeholder="Optional password"
                      value={patPassword}
                      onChange={(e) => setPatPassword(e.target.value)}
                      className="rounded-xl border-slate-200 text-xs"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="p-phone" className="text-xs font-bold">
                  Phone Number (Optional)
                </Label>
                <Input
                  id="p-phone"
                  placeholder="01012345678"
                  value={patPhone}
                  onChange={(e) => setPatPhone(e.target.value)}
                  className="rounded-xl border-slate-200 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="p-gender" className="text-xs font-bold">
                    Gender
                  </Label>
                  <select
                    id="p-gender"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none"
                    value={patGender}
                    onChange={(e) => setPatGender(e.target.value)}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="p-dob" className="text-xs font-bold">
                    Date of Birth
                  </Label>
                  <DatePicker
                    id="p-dob"
                    value={patDob}
                    onChange={(e) => setPatDob(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex sm:justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPatientModalOpen(false)}
                className="rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {editingPatient ? "Save Changes" : "Create Patient"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ADMIN CREATE SLOT MODAL */}
      <Dialog
        open={adminSlotModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setAdminSlotModalOpen(false);
            setEditingSlot(null);
          }
        }}
      >
        <DialogContent className="max-w-md sm:rounded-3xl p-0 overflow-hidden">
          <DialogHeader className="p-6 bg-slate-50/50 border-b border-slate-100 text-left sm:text-left">
            <div className="flex items-center justify-between pr-6">
              <DialogTitle className="text-lg font-black text-[#0F172A]">
                {editingSlot ? "Edit Clinic Session" : "Create Clinic Session"}
              </DialogTitle>
              <Badge variant={editingSlot ? "secondary" : "default"}>
                {editingSlot ? "Editing" : "Session"}
              </Badge>
            </div>
          </DialogHeader>
          <form onSubmit={handleCreateAdminSlot}>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="a-slot-date" className="text-xs font-bold">
                    Date
                  </Label>
                  <Input
                    id="a-slot-date"
                    type="date"
                    min={getLocalDateString()}
                    required
                    value={adminSlotDate}
                    onChange={(e) => setAdminSlotDate(e.target.value)}
                    className="rounded-xl border-slate-200 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="a-slot-time" className="text-xs font-bold">
                    Start Time
                  </Label>
                  <TimeSelectPair
                    id="a-slot-time"
                    value={adminSlotTime}
                    onChange={setAdminSlotTime}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label
                    htmlFor="a-slot-duration"
                    className="text-xs font-bold"
                  >
                    Appointment Duration (mins)
                  </Label>
                  <Input
                    id="a-slot-duration"
                    type="number"
                    min="5"
                    required
                    value={adminSlotDuration}
                    onChange={(e) =>
                      setAdminSlotDuration(Number(e.target.value))
                    }
                    className="rounded-xl border-slate-200 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="a-slot-endtime" className="text-xs font-bold">
                    End Time
                  </Label>
                  <TimeSelectPair
                    id="a-slot-endtime"
                    value={adminSlotEndTime}
                    onChange={setAdminSlotEndTime}
                  />
                </div>
              </div>

              {!editingSlot && (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <input
                      id="a-slot-repeat"
                      type="checkbox"
                      checked={adminSlotRepeat}
                      onChange={(e) => setAdminSlotRepeat(e.target.checked)}
                      className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <Label htmlFor="a-slot-repeat" className="text-xs font-bold cursor-pointer">
                      Repeat Session Weekly
                    </Label>
                  </div>

                  {adminSlotRepeat && (
                    <div className="space-y-1.5 animate-fade-in">
                      <Label htmlFor="a-slot-repeat-until" className="text-xs font-bold">
                        Repeat Weekly Until Date
                      </Label>
                      <Input
                        id="a-slot-repeat-until"
                        type="date"
                        min={adminSlotDate || getLocalDateString()}
                        required
                        value={adminSlotRepeatUntil}
                        onChange={(e) => setAdminSlotRepeatUntil(e.target.value)}
                        className="rounded-xl border-slate-200 text-xs"
                      />
                    </div>
                  )}
                </div>
              )}

              {(() => {
                const startParts = adminSlotTime.split(":").map(Number);
                const endParts = adminSlotEndTime.split(":").map(Number);
                let capacity = 0;
                if (
                  startParts.length === 2 &&
                  endParts.length === 2 &&
                  adminSlotDuration > 0
                ) {
                  const startMins = startParts[0] * 60 + startParts[1];
                  const endMins = endParts[0] * 60 + endParts[1];
                  const diff = endMins - startMins;
                  if (diff > 0) {
                    capacity = Math.floor(diff / adminSlotDuration);
                  }
                }
                return (
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500">
                      Estimated capacity:
                    </span>
                    <Badge variant={capacity > 0 ? "success" : "destructive"}>
                      {capacity > 0
                        ? `${capacity} Patient Slot${
                            capacity > 1 ? "s" : ""
                          }`
                        : "0 Slots (Invalid Range)"}
                    </Badge>
                  </div>
                );
              })()}
            </div>
            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex sm:justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAdminSlotModalOpen(false);
                  setEditingSlot(null);
                }}
                className="rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {editingSlot ? "Save Changes" : "Create Session"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
