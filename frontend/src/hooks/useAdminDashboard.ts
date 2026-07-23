import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { useModal } from "../contexts/ModalContext";
import { getFriendlyErrorMessage } from "../lib/error-parser";
import {
  getClinics,
  createClinic,
  updateClinic,
  deleteClinic,
  assignDoctorToClinic,
  removeDoctorFromClinic,
} from "../services/clinic";
import {
  getAllDoctorsAdmin,
  createDoctorAdmin,
  updateDoctorProfile,
} from "../services/doctor";
import {
  getAllPatientsAdmin,
  createPatientAdmin,
  updatePatientProfile,
} from "../services/patient";
import {
  getAppointments,
  getDoctorSlots,
  getPatientAppointments,
  deleteAppointmentSlot,
  createAppointmentSlot,
  updateAppointmentSlot,
} from "../services/appointment";
import api from "../services/api";

export function useAdminDashboard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { confirm: customConfirm } = useModal();
  const [activeTab, setActiveTab] = useState<
    "overview" | "clinics" | "doctors" | "patients" | "slots" | "messages"
  >("overview");

  // Admin Slot Management States
  const [slotsFilterDoctorId, setSlotsFilterDoctorId] = useState("");
  const [slotsDateFilter, setSlotsDateFilter] = useState("");
  const [adminSlotModalOpen, setAdminSlotModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<any | null>(null);
  const [adminSlotDate, setAdminSlotDate] = useState("");
  const [adminSlotTime, setAdminSlotTime] = useState("08:00");
  const [adminSlotEndTime, setAdminSlotEndTime] = useState("12:00");
  const [adminSlotDuration, setAdminSlotDuration] = useState(30);
  const [adminTodaySlotsOpen, setAdminTodaySlotsOpen] = useState(true);
  const [adminUpcomingSlotsOpen, setAdminUpcomingSlotsOpen] = useState(true);
  const [adminPastSlotsOpen, setAdminPastSlotsOpen] = useState(false);

  // Status banners state
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Clinic Modal / Form state
  const [clinicModalOpen, setClinicModalOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<any | null>(null);
  const [clinicName, setClinicName] = useState("");
  const [clinicNum, setClinicNum] = useState("");
  const [clinicSpec, setClinicSpec] = useState("");
  const [clinicDesc, setClinicDesc] = useState("");
  const [clinicFloor, setClinicFloor] = useState("");
  const [clinicRoom, setClinicRoom] = useState("");

  // Assign Doctor Modal state
  const [assignModalClinic, setAssignModalClinic] = useState<any | null>(null);

  // Book Appointment Modal state
  const [bookingModalPatient, setBookingModalPatient] = useState<any | null>(null);
  const [bookingClinicId, setBookingClinicId] = useState("");
  const [bookingDoctorId, setBookingDoctorId] = useState("");
  const [bookingDateFilter, setBookingDateFilter] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");

  // Emergency Contact Modal state
  const [activeContactPatient, setActiveContactPatient] = useState<any | null>(null);

  // Patient appointments panel state
  const [expandedPatientApptId, setExpandedPatientApptId] = useState<string | null>(null);

  // Add Doctor Modal state
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any | null>(null);
  const [docName, setDocName] = useState("");
  const [docEmail, setDocEmail] = useState("");
  const [docPassword, setDocPassword] = useState("");
  const [docPhone, setDocPhone] = useState("");
  const [docSpec, setDocSpec] = useState("Cardiology");
  const [docGender, setDocGender] = useState("male");
  const [docDob, setDocDob] = useState("");
  const [docClinic, setDocClinic] = useState("");

  // Add Patient Modal state
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any | null>(null);
  const [patName, setPatName] = useState("");
  const [patEmail, setPatEmail] = useState("");
  const [patPassword, setPatPassword] = useState("");
  const [patPhone, setPatPhone] = useState("");
  const [patGender, setPatGender] = useState("male");
  const [patDob, setPatDob] = useState("");

  // Quick Booking modal states
  const [qbSearchQuery, setQbSearchQuery] = useState("");
  const [qbActiveTab, setQbActiveTab] = useState<"search" | "create">("search");
  const [qbNewName, setQbNewName] = useState("");
  const [qbNewGender, setQbNewGender] = useState("male");
  const [qbNewPhone, setQbNewPhone] = useState("");
  const [qbNewDob, setQbNewDob] = useState("");

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      navigate({ to: "/app/login" });
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  // Queries
  const { data: clinics = [], isLoading: loadingClinics } = useQuery<any[]>({
    queryKey: ["adminClinics"],
    queryFn: getClinics,
    enabled: !!(user?.role === "admin"),
  });

  const { data: doctors = [], isLoading: loadingDoctors } = useQuery<any[]>({
    queryKey: ["adminDoctors"],
    queryFn: getAllDoctorsAdmin,
    enabled: !!(user?.role === "admin"),
  });

  const { data: patients = [], isLoading: loadingPatients } = useQuery<any[]>({
    queryKey: ["adminPatients"],
    queryFn: getAllPatientsAdmin,
    enabled: !!(user?.role === "admin"),
  });

  const { data: appointments = [], isLoading: loadingAppointments } = useQuery<any[]>({
    queryKey: ["adminAppointments"],
    queryFn: getAppointments,
    enabled: !!(user?.role === "admin"),
  });

  const { data: messages = [], isLoading: loadingMessages } = useQuery<any[]>({
    queryKey: ["adminMessages"],
    queryFn: async () => {
      const res = await api.get("/auth/admin-messages");
      if (res.data && res.data.status === "success") {
        return res.data.data || [];
      }
      return [];
    },
    enabled: !!(user?.role === "admin"),
  });

  const { data: filteredSlots = [], isLoading: loadingSlots } = useQuery<any[]>({
    queryKey: ["adminFilteredSlots", slotsFilterDoctorId, slotsDateFilter],
    queryFn: async () => {
      const queryParams: any = {};
      if (slotsFilterDoctorId) queryParams.doctor = slotsFilterDoctorId;
      if (slotsDateFilter) queryParams.date = slotsDateFilter;

      const slots = await getAppointments(queryParams);
      return slots.sort((a: any, b: any) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) return dateB - dateA;
        return (b.time || "").localeCompare(a.time || "");
      });
    },
    enabled: !!(user?.role === "admin"),
  });

  const handleResetSlotFilters = () => {
    setSlotsFilterDoctorId("");
    setSlotsDateFilter("");
  };

  const { data: availableSlots = [] } = useQuery<any[]>({
    queryKey: ["adminVacantDoctorSlots", bookingDoctorId],
    queryFn: async () => {
      if (!bookingDoctorId) return [];
      const slots = await getDoctorSlots(bookingDoctorId);
      const filtered = slots.filter((s: any) => {
        const [slotHour, slotMin] = (s.time || "00:00").split(":").map(Number);
        const slotStart = new Date(s.date);
        slotStart.setHours(slotHour, slotMin, 0, 0);
        return (
          s.status === "Scheduled" &&
          (!s.patient || s.patient.length === 0) &&
          slotStart > new Date()
        );
      });
      return filtered.sort((a: any, b: any) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) return dateB - dateA;
        return (b.time || "").localeCompare(a.time || "");
      });
    },
    enabled: !!(user?.role === "admin" && bookingDoctorId),
  });

  useEffect(() => {
    setSelectedSlotId("");
  }, [bookingDoctorId]);

  const { data: expandedPatientApptsData = [], isLoading: isExpandedPatientApptsLoading } = useQuery<any[]>({
    queryKey: ["adminPatientAppts", expandedPatientApptId],
    queryFn: async () => {
      if (!expandedPatientApptId) return [];
      const appts = await getPatientAppointments(expandedPatientApptId);
      return appts.sort(
        (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    },
    enabled: !!(user?.role === "admin" && expandedPatientApptId),
  });

  const patientAppts = useMemo(() => {
    if (!expandedPatientApptId) return {};
    return { [expandedPatientApptId]: expandedPatientApptsData };
  }, [expandedPatientApptId, expandedPatientApptsData]);

  const loadingPatientAppts = useMemo(() => {
    if (!expandedPatientApptId) return {};
    return { [expandedPatientApptId]: isExpandedPatientApptsLoading };
  }, [expandedPatientApptId, isExpandedPatientApptsLoading]);

  const loading = loadingClinics || loadingDoctors || loadingPatients || loadingAppointments;

  // Legacy helper function proxies
  const loadMessages = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["adminMessages"] });
  }, [queryClient]);

  const loadData = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["adminClinics"] }),
      queryClient.invalidateQueries({ queryKey: ["adminDoctors"] }),
      queryClient.invalidateQueries({ queryKey: ["adminPatients"] }),
      queryClient.invalidateQueries({ queryKey: ["adminAppointments"] }),
      queryClient.invalidateQueries({ queryKey: ["adminMessages"] }),
    ]);
  }, [queryClient]);

  const fetchAdminSlots = useCallback(async (_doctorId?: string, _dateFilter?: string) => {
    await queryClient.invalidateQueries({ queryKey: ["adminFilteredSlots"] });
  }, [queryClient]);

  // Mutations
  const saveAdminSlotMutation = useMutation({
    mutationFn: async ({ isEdit, slotId, payload }: { isEdit: boolean; slotId?: string; payload: any }) => {
      if (isEdit && slotId) {
        return await updateAppointmentSlot(slotId, payload);
      } else {
        return await createAppointmentSlot(payload);
      }
    },
    onMutate: () => {
      setActionError(null);
      setActionSuccess(null);
    },
    onSuccess: (_, variables) => {
      setActionSuccess(variables.isEdit ? "Session updated successfully." : "Session created successfully.");
      setAdminSlotModalOpen(false);
      setEditingSlot(null);
      setAdminSlotDate("");
      setAdminSlotTime("08:00");
      setAdminSlotEndTime("12:00");
      setAdminSlotDuration(30);
      queryClient.invalidateQueries({ queryKey: ["adminFilteredSlots"] });
      queryClient.invalidateQueries({ queryKey: ["adminAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });
    },
    onError: (err: any) => {
      setActionError(err?.response?.data?.message || "Failed to save slot.");
    },
  });

  const handleCreateAdminSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDoc = doctors.find((d: any) => d._id === slotsFilterDoctorId);
    if (!selectedDoc) return;

    const clinicId = selectedDoc.clinic?._id || selectedDoc.clinic;
    if (!clinicId) {
      setActionError(
        "Cannot create slots. This doctor must be assigned to a clinic first."
      );
      return;
    }

    if (editingSlot) {
      await saveAdminSlotMutation.mutateAsync({
        isEdit: true,
        slotId: editingSlot._id,
        payload: {
          date: adminSlotDate,
          time: adminSlotTime,
          duration: adminSlotDuration,
        },
      });
    } else {
      await saveAdminSlotMutation.mutateAsync({
        isEdit: false,
        payload: {
          doctorId: slotsFilterDoctorId,
          clinicId: clinicId,
          date: adminSlotDate,
          startTime: adminSlotTime,
          endTime: adminSlotEndTime,
          appointmentDuration: adminSlotDuration,
        },
      });
    }
  };

  const deleteAdminSlotMutation = useMutation({
    mutationFn: (slotId: string) => deleteAppointmentSlot(slotId),
    onMutate: () => {
      setActionError(null);
      setActionSuccess(null);
    },
    onSuccess: () => {
      setActionSuccess("Slot deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["adminFilteredSlots"] });
      queryClient.invalidateQueries({ queryKey: ["adminAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });
    },
    onError: (err: any) => {
      setActionError(getFriendlyErrorMessage(err));
    },
  });

  const handleDeleteAdminSlot = async (slotId: string) => {
    const slot = filteredSlots.find((s: any) => s._id === slotId);
    if (slot && slot.patient && slot.patient.length > 0) {
      setActionError("Cannot delete: slot has registered patients.");
      return;
    }
    if (!await customConfirm({
      title: "Delete Slot",
      message: "Are you sure you want to delete this slot?",
      confirmText: "Delete",
      variant: "danger"
    })) return;

    await deleteAdminSlotMutation.mutateAsync(slotId);
  };



  const saveDoctorMutation = useMutation({
    mutationFn: async ({ isEdit, docId, payload }: { isEdit: boolean; docId?: string; payload: any }) => {
      if (isEdit && docId) {
        return await updateDoctorProfile(docId, payload);
      } else {
        return await createDoctorAdmin(payload);
      }
    },
    onMutate: () => {
      setActionError(null);
      setActionSuccess(null);
    },
    onSuccess: (res: any, variables) => {
      if (variables.isEdit) {
        setActionSuccess("Doctor profile updated successfully.");
      } else {
        setActionSuccess(
          res?.message || "Doctor profile and user account created successfully."
        );
      }
      setDoctorModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["adminDoctors"] });
      queryClient.invalidateQueries({ queryKey: ["adminClinics"] });
    },
    onError: (err: any) => {
      setActionError(err?.response?.data?.message || "Failed to save doctor.");
    },
  });

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      fullName: docName.trim(),
      email: docEmail.trim(),
      specialization: docSpec,
      gender: docGender,
    };

    if (docPassword) {
      payload.password = docPassword;
    }
    if (docPhone.trim()) {
      payload.phone = docPhone.trim();
    }
    if (docDob) {
      payload.dateOfBirth = docDob;
    }
    if (docClinic) {
      payload.clinic = docClinic;
    }

    await saveDoctorMutation.mutateAsync({
      isEdit: !!editingDoctor,
      docId: editingDoctor?._id,
      payload,
    });
  };

  const savePatientMutation = useMutation({
    mutationFn: async ({ isEdit, patId, payload }: { isEdit: boolean; patId?: string; payload: any }) => {
      if (isEdit && patId) {
        return await updatePatientProfile(patId, payload);
      } else {
        return await createPatientAdmin(payload);
      }
    },
    onMutate: () => {
      setActionError(null);
      setActionSuccess(null);
    },
    onSuccess: (_, variables) => {
      setActionSuccess(
        variables.isEdit
          ? "Patient profile updated successfully."
          : "Patient profile created successfully."
      );
      setPatientModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["adminPatients"] });
    },
    onError: (err: any) => {
      setActionError(err?.response?.data?.message || "Failed to save patient.");
    },
  });

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      fullName: patName.trim(),
      gender: patGender,
    };

    if (patEmail.trim()) {
      payload.email = patEmail.trim();
    }
    if (patPassword) {
      payload.password = patPassword;
    }
    if (patPhone.trim()) {
      payload.phone = patPhone.trim();
    }
    if (patDob) {
      payload.dateOfBirth = patDob;
    }

    await savePatientMutation.mutateAsync({
      isEdit: !!editingPatient,
      patId: editingPatient?._id,
      payload,
    });
  };

  const createQuickPatientMutation = useMutation({
    mutationFn: (payload: any) => createPatientAdmin(payload),
    onMutate: () => {
      setActionError(null);
      setActionSuccess(null);
    },
    onSuccess: (newPat) => {
      setActionSuccess("Quick Patient created successfully.");
      setQbNewName("");
      setQbNewPhone("");
      setQbNewDob("");
      setBookingModalPatient(newPat);
      queryClient.invalidateQueries({ queryKey: ["adminPatients"] });
    },
    onError: (err: any) => {
      setActionError(err?.response?.data?.message || "Failed to create patient.");
    },
  });

  const handleCreateQuickPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      fullName: qbNewName.trim(),
      gender: qbNewGender,
    };
    if (qbNewPhone.trim()) {
      payload.phone = qbNewPhone.trim();
    }
    if (qbNewDob) {
      payload.dateOfBirth = qbNewDob;
    }
    await createQuickPatientMutation.mutateAsync(payload);
  };

  const saveClinicMutation = useMutation({
    mutationFn: async ({ isEdit, clinicId, payload }: { isEdit: boolean; clinicId?: string; payload: any }) => {
      if (isEdit && clinicId) {
        return await updateClinic(clinicId, payload);
      } else {
        return await createClinic(payload);
      }
    },
    onMutate: () => {
      setActionError(null);
      setActionSuccess(null);
    },
    onSuccess: (_, variables) => {
      setActionSuccess(
        variables.isEdit ? "Clinic updated successfully." : "Clinic created successfully."
      );
      setClinicModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["adminClinics"] });
    },
    onError: (err: any) => {
      setActionError(err?.response?.data?.message || "Operation failed.");
    },
  });

  const handleSaveClinic = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: clinicName.trim(),
      clinicNumber: clinicNum.trim(),
      specialty: clinicSpec,
      description: clinicDesc.trim(),
      floor: clinicFloor.trim(),
      roomNumber: clinicRoom.trim(),
    };

    await saveClinicMutation.mutateAsync({
      isEdit: !!editingClinic,
      clinicId: editingClinic?._id,
      payload,
    });
  };

  const deleteClinicMutation = useMutation({
    mutationFn: (id: string) => deleteClinic(id),
    onMutate: () => {
      setActionError(null);
    },
    onSuccess: () => {
      setActionSuccess("Clinic deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["adminClinics"] });
    },
    onError: (err: any) => {
      setActionError(getFriendlyErrorMessage(err));
    },
  });

  const handleDeleteClinic = async (id: string) => {
    if (!await customConfirm({
      title: "Delete Clinic",
      message: "Are you sure you want to delete this clinic? All records associated with it will be archived.",
      confirmText: "Delete",
      variant: "danger"
    })) return;
    await deleteClinicMutation.mutateAsync(id);
  };

  const assignDoctorMutation = useMutation({
    mutationFn: ({ clinicId, doctorId }: { clinicId: string; doctorId: string }) =>
      assignDoctorToClinic(clinicId, doctorId),
    onMutate: () => {
      setActionError(null);
    },
    onSuccess: () => {
      setActionSuccess("Doctor assigned to clinic.");
      setAssignModalClinic(null);
      queryClient.invalidateQueries({ queryKey: ["adminClinics"] });
      queryClient.invalidateQueries({ queryKey: ["adminDoctors"] });
    },
    onError: (err: any) => {
      setActionError(err?.response?.data?.message || "Failed to assign doctor.");
    },
  });

  const handleAssignDoctor = async (doctorId: string) => {
    if (!assignModalClinic) return;
    await assignDoctorMutation.mutateAsync({
      clinicId: assignModalClinic._id,
      doctorId,
    });
  };

  const removeDoctorMutation = useMutation({
    mutationFn: ({ clinicId, doctorId }: { clinicId: string; doctorId: string }) =>
      removeDoctorFromClinic(clinicId, doctorId),
    onMutate: () => {
      setActionError(null);
    },
    onSuccess: () => {
      setActionSuccess("Doctor removed from clinic.");
      queryClient.invalidateQueries({ queryKey: ["adminClinics"] });
      queryClient.invalidateQueries({ queryKey: ["adminDoctors"] });
    },
    onError: (err: any) => {
      setActionError(getFriendlyErrorMessage(err));
    },
  });

  const handleRemoveDoctor = async (clinicId: string, doctorId: string) => {
    if (!await customConfirm({
      title: "Remove Doctor",
      message: "Are you sure you want to remove this doctor from the clinic?",
      confirmText: "Remove",
      variant: "warning"
    })) return;
    await removeDoctorMutation.mutateAsync({ clinicId, doctorId });
  };

  const handleTogglePatientAppts = (patientId: string) => {
    if (expandedPatientApptId === patientId) {
      setExpandedPatientApptId(null);
    } else {
      setExpandedPatientApptId(patientId);
    }
  };

  const bookAppointmentMutation = useMutation({
    mutationFn: async ({ slotId, patientId }: { slotId: string; patientId: string }) => {
      await api.post(`/appointments/${slotId}/register`, {
        patientId,
        symptoms: "Booked by Administrator",
      });
      await api.patch(`/appointments/${slotId}/approve-registration`, {
        patientId,
      });
    },
    onMutate: () => {
      setActionError(null);
      setActionSuccess(null);
    },
    onSuccess: () => {
      setActionSuccess("Appointment booked successfully.");
      setBookingModalPatient(null);
      queryClient.invalidateQueries({ queryKey: ["adminAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["adminFilteredSlots"] });
      queryClient.invalidateQueries({ queryKey: ["adminVacantDoctorSlots"] });
      queryClient.invalidateQueries({ queryKey: ["patientAppointments"] });
    },
    onError: (err: any) => {
      setActionError(err?.response?.data?.message || "Booking failed.");
    },
  });

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId || !bookingModalPatient) {
      setActionError("Please select a vacant slot.");
      return;
    }
    await bookAppointmentMutation.mutateAsync({
      slotId: selectedSlotId,
      patientId: bookingModalPatient._id,
    });
  };

  // Helper functions for modal openers
  const handleOpenCreateClinic = () => {
    setEditingClinic(null);
    setClinicName("");
    setClinicNum("");
    setClinicSpec("Cardiology");
    setClinicDesc("");
    setClinicFloor("");
    setClinicRoom("");
    setClinicModalOpen(true);
  };

  const handleOpenEditClinic = (clinic: any) => {
    setEditingClinic(clinic);
    setClinicName(clinic.name);
    setClinicNum(clinic.clinicNumber);
    setClinicSpec(clinic.specialty || "Cardiology");
    setClinicDesc(clinic.description || "");
    setClinicFloor(clinic.floor || "");
    setClinicRoom(clinic.roomNumber || "");
    setClinicModalOpen(true);
  };

  const handleOpenAddDoctor = () => {
    setEditingDoctor(null);
    setDocName("");
    setDocEmail("");
    setDocPassword("");
    setDocPhone("");
    setDocSpec("Cardiology");
    setDocGender("male");
    setDocDob("");
    setDocClinic("");
    setDoctorModalOpen(true);
  };

  const handleOpenEditDoctor = (doc: any) => {
    setEditingDoctor(doc);
    setDocName(doc.fullName || "");
    setDocEmail(doc.email || "");
    setDocPassword("");
    setDocPhone(doc.user?.phone || doc.phone || "");
    setDocSpec(doc.specialization || "Cardiology");
    setDocGender(doc.gender || "male");
    setDocDob(
      doc.dateOfBirth
        ? new Date(doc.dateOfBirth).toISOString().split("T")[0]
        : ""
    );
    setDocClinic(doc.clinic?._id || doc.clinic || "");
    setDoctorModalOpen(true);
  };

  const handleOpenAddPatient = () => {
    setEditingPatient(null);
    setPatName("");
    setPatEmail("");
    setPatPassword("");
    setPatPhone("");
    setPatGender("male");
    setPatDob("");
    setPatientModalOpen(true);
  };

  const handleOpenEditPatient = (pat: any) => {
    setEditingPatient(pat);
    setPatName(pat.fullName || "");
    setPatEmail(pat.email || "");
    setPatPassword("");
    setPatPhone(pat.user?.phone || pat.phone || "");
    setPatGender(pat.gender || "male");
    setPatDob(
      pat.dateOfBirth
        ? new Date(pat.dateOfBirth).toISOString().split("T")[0]
        : ""
    );
    setPatientModalOpen(true);
  };

  return {
    user,
    isAuthenticated,
    authLoading,
    activeTab,
    setActiveTab,

    loading,
    actionError,
    setActionError,
    actionSuccess,
    setActionSuccess,

    clinics,
    doctors,
    patients,
    appointments,
    messages,
    loadingMessages,

    slotsFilterDoctorId,
    setSlotsFilterDoctorId,
    slotsDateFilter,
    setSlotsDateFilter,
    filteredSlots,
    loadingSlots,
    adminTodaySlotsOpen,
    setAdminTodaySlotsOpen,
    adminUpcomingSlotsOpen,
    setAdminUpcomingSlotsOpen,
    adminPastSlotsOpen,
    setAdminPastSlotsOpen,

    expandedPatientApptId,
    setExpandedPatientApptId,
    patientAppts,
    loadingPatientAppts,

    clinicModalOpen,
    setClinicModalOpen,
    editingClinic,
    setEditingClinic,
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
    handleOpenCreateClinic,
    handleOpenEditClinic,
    handleSaveClinic,
    handleDeleteClinic,

    assignModalClinic,
    setAssignModalClinic,
    handleAssignDoctor,
    handleRemoveDoctor,

    bookingModalPatient,
    setBookingModalPatient,
    bookingClinicId,
    setBookingClinicId,
    bookingDoctorId,
    setBookingDoctorId,
    bookingDateFilter,
    setBookingDateFilter,
    availableSlots,
    setAvailableSlots: (_slots?: any) => {},
    selectedSlotId,
    setSelectedSlotId,
    qbSearchQuery,
    setQbSearchQuery,
    qbActiveTab,
    setQbActiveTab,
    qbNewName,
    setQbNewName,
    qbNewGender,
    setQbNewGender,
    qbNewPhone,
    setQbNewPhone,
    qbNewDob,
    setQbNewDob,
    handleCreateQuickPatient,
    handleBookAppointment,

    activeContactPatient,
    setActiveContactPatient,

    doctorModalOpen,
    setDoctorModalOpen,
    editingDoctor,
    setEditingDoctor,
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
    handleOpenAddDoctor,
    handleOpenEditDoctor,
    handleCreateDoctor,

    patientModalOpen,
    setPatientModalOpen,
    editingPatient,
    setEditingPatient,
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
    handleOpenAddPatient,
    handleOpenEditPatient,
    handleCreatePatient,

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
    handleCreateAdminSlot,
    handleDeleteAdminSlot,

    handleTogglePatientAppts,
    handleResetSlotFilters,
    loadData,
    loadMessages,
    fetchAdminSlots,
  };
}

