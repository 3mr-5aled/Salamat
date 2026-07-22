import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { useModal } from "../contexts/ModalContext";
import { getFriendlyErrorMessage } from "../lib/error-parser";
import { contactAdmin } from "../services/auth";
import { updatePatientNotes, getPatientById } from "../services/patient";
import { getDoctorProfile } from "../services/doctor";
import {
  getAppointments,
  approvePatientRegistration,
  rejectPatientRegistration,
  completeConsultation,
  cancelClinicSession,
} from "../services/appointment";
import type { PrescriptionItem } from "../types";

export type DoctorTab = "overview" | "bookings" | "slots" | "patients" | "profile";

export function useDoctorDashboard() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const { confirm: customConfirm, prompt: customPrompt } = useModal();

  const [activeTab, setActiveTab] = useState<DoctorTab>("overview");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Doctor Patients Directory states
  const [patientNotes, setPatientNotes] = useState<{ [patientId: string]: string }>({});
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);

  // Consultation Panel State
  const [consultingSlot, setConsultingSlot] = useState<any | null>(null);
  const [consultingPatient, setConsultingPatient] = useState<any | null>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    { medication: "", dosage: "", frequency: "", duration: "" },
  ]);
  const [submittingConsultation, setSubmittingConsultation] = useState(false);

  // Contact Admin modal states
  const [contactAdminOpen, setContactAdminOpen] = useState(false);
  const [contactAdminMessage, setContactAdminMessage] = useState("");
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);

  // Archived sections collapsibles
  const [doctorSlotsArchivedOpen, setDoctorSlotsArchivedOpen] = useState(false);
  const [doctorVisitsArchivedOpen, setDoctorVisitsArchivedOpen] = useState(false);

  // 1. Doctor Profile Query
  const { data: doctorProfile } = useQuery({
    queryKey: ["doctorProfile", user?._id],
    queryFn: () => getDoctorProfile(user!._id),
    enabled: !!(user && user.role === "doctor"),
  });

  const doctorProfileId = doctorProfile?._id || null;

  // 2. Doctor Appointments Query
  const { data: doctorAppointments = [], isLoading: loadingAppointments } = useQuery({
    queryKey: ["doctorAppointments", doctorProfileId],
    queryFn: async () => {
      if (!doctorProfileId) return [];
      const list = await getAppointments({ doctor: doctorProfileId });
      return list.sort((a: any, b: any) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) {
          return dateB - dateA;
        }
        return (b.time || "").localeCompare(a.time || "");
      });
    },
    enabled: !!(isAuthenticated && user?.role === "doctor" && doctorProfileId),
  });

  // 3. Patient Profiles Query
  const uniquePatientIds = useMemo(() => {
    if (user?.role !== "doctor" || !doctorAppointments) return [];
    const ids: string[] = [];
    doctorAppointments.forEach((visit: any) => {
      if (visit.patient && Array.isArray(visit.patient)) {
        visit.patient.forEach((pReg: any) => {
          const pat = pReg.patientId;
          if (pat && pat._id && !ids.includes(pat._id)) {
            ids.push(pat._id);
          }
        });
      }
    });
    return ids;
  }, [doctorAppointments, user]);

  const { data: myPatients = [] } = useQuery({
    queryKey: ["myPatients", uniquePatientIds],
    queryFn: async () => {
      if (uniquePatientIds.length === 0) return [];
      try {
        const profiles = await Promise.all(uniquePatientIds.map((id) => getPatientById(id)));
        return profiles.filter(Boolean);
      } catch (err) {
        console.error("Failed to load full patient profiles:", err);
        const fallback: any[] = [];
        doctorAppointments.forEach((visit: any) => {
          if (visit.patient && Array.isArray(visit.patient)) {
            visit.patient.forEach((pReg: any) => {
              const pat = pReg.patientId;
              if (pat && pat._id && !fallback.find((p) => p._id === pat._id)) {
                fallback.push(pat);
              }
            });
          }
        });
        return fallback;
      }
    },
    enabled: !!(isAuthenticated && user?.role === "doctor" && uniquePatientIds.length > 0),
  });

  // 4. Patient History Query
  const { data: expandedPatientHistory = [], isLoading: isHistoryLoading } = useQuery({
    queryKey: ["patientHistory", expandedPatientId],
    queryFn: async () => {
      if (!expandedPatientId) return [];
      const list = await getAppointments({ "patient.patientId": expandedPatientId, status: "Completed" });
      const formatted = list.map((app: any) => ({
        date: app.date,
        time: app.time,
        doctor: app.doctor,
        notes: app.notes,
      }));
      return formatted.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    enabled: !!expandedPatientId,
  });

  const patientHistory = useMemo(() => {
    if (!expandedPatientId) return {};
    return { [expandedPatientId]: expandedPatientHistory };
  }, [expandedPatientId, expandedPatientHistory]);

  const loadingHistory = useMemo(() => {
    if (!expandedPatientId) return {};
    return { [expandedPatientId]: isHistoryLoading };
  }, [expandedPatientId, isHistoryLoading]);

  const loadDoctorAppointments = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });
  }, [queryClient]);

  // Mutations
  const saveNoteMutation = useMutation({
    mutationFn: ({ pId, notes }: { pId: string; notes: string }) => updatePatientNotes(pId, notes),
    onMutate: ({ pId }) => {
      setSavingNoteId(pId);
      setActionError(null);
      setActionSuccess(null);
    },
    onSuccess: () => {
      setActionSuccess("Clinical notes updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["myPatients"] });
    },
    onError: (err: any) => {
      console.error("Failed to update notes:", err);
      setActionError(err?.response?.data?.message || "Failed to update notes");
    },
    onSettled: () => {
      setSavingNoteId(null);
    },
  });

  const handleSaveNote = async (pId: string, notes: string) => {
    await saveNoteMutation.mutateAsync({ pId, notes });
  };

  const contactAdminMutation = useMutation({
    mutationFn: (message: string) => contactAdmin(message),
    onMutate: () => {
      setContactSubmitting(true);
      setContactError(null);
      setContactSuccess(null);
    },
    onSuccess: () => {
      setContactSuccess("Your message has been forwarded to the hospital administrators. They will review it shortly.");
      setContactAdminMessage("");
      queryClient.invalidateQueries({ queryKey: ["adminMessages"] });
    },
    onError: (err: any) => {
      console.error("Failed to contact admin:", err);
      setContactError(err?.response?.data?.message || "Failed to send message to administrative office.");
    },
    onSettled: () => {
      setContactSubmitting(false);
    },
  });

  const handleContactAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactAdminMessage.trim()) return;
    await contactAdminMutation.mutateAsync(contactAdminMessage.trim());
  };

  const cancelSlotMutation = useMutation({
    mutationFn: (slotId: string) => cancelClinicSession(slotId),
    onMutate: () => {
      setActionError(null);
      setActionSuccess(null);
    },
    onSuccess: () => {
      setActionSuccess("Clinic session cancelled successfully.");
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });
    },
    onError: (err: any) => {
      console.error("Failed to cancel clinic session:", err);
      setActionError(getFriendlyErrorMessage(err));
    },
  });

  const handleCancelSlot = async (slotId: string) => {
    const confirmed = await customConfirm({
      title: "Cancel Session",
      message: "Are you sure you want to cancel this clinic session? All pending or approved bookings inside this session will be cancelled automatically.",
      confirmText: "Cancel Session",
      variant: "danger"
    });
    if (confirmed) {
      await cancelSlotMutation.mutateAsync(slotId);
    }
  };

  const approveRegistrationMutation = useMutation({
    mutationFn: ({ slotId, patientId }: { slotId: string; patientId: string }) =>
      approvePatientRegistration(slotId, patientId),
    onMutate: () => {
      setActionError(null);
      setActionSuccess(null);
    },
    onSuccess: () => {
      setActionSuccess("Patient registration approved successfully.");
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });
    },
    onError: (err: any) => {
      console.error("Failed to approve registration:", err);
      setActionError(getFriendlyErrorMessage(err));
    },
  });

  const handleApproveRegistration = async (slotId: string, patientId: string) => {
    await approveRegistrationMutation.mutateAsync({ slotId, patientId });
  };

  const rejectRegistrationMutation = useMutation({
    mutationFn: ({ slotId, patientId, reason }: { slotId: string; patientId: string; reason?: string }) =>
      rejectPatientRegistration(slotId, patientId, reason),
    onMutate: () => {
      setActionError(null);
      setActionSuccess(null);
    },
    onSuccess: () => {
      setActionSuccess("Patient registration rejected.");
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });
    },
    onError: (err: any) => {
      console.error("Failed to reject registration:", err);
      setActionError(getFriendlyErrorMessage(err));
    },
  });

  const handleRejectRegistration = async (slotId: string, patientId: string) => {
    const reason = await customPrompt({
      title: "Reject Registration",
      message: "Please enter the reason for rejecting this registration (optional):",
      placeholder: "Reason for rejection...",
      required: false
    });
    if (reason === null) return;
    await rejectRegistrationMutation.mutateAsync({ slotId, patientId, reason: reason.trim() || undefined });
  };

  const handleStartConsultation = (slot: any, patientReg: any) => {
    setConsultingSlot(slot);
    setConsultingPatient(patientReg);
    setDiagnosis("");
    setPrescriptions([{ medication: "", dosage: "", frequency: "", duration: "" }]);
    setActionError(null);
    setActionSuccess(null);
  };

  const handleAddPrescriptionLine = () => {
    setPrescriptions((prev) => [...prev, { medication: "", dosage: "", frequency: "", duration: "" }]);
  };

  const handleRemovePrescriptionLine = (index: number) => {
    setPrescriptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePrescriptionChange = (index: number, field: string, value: string) => {
    setPrescriptions((prev) => {
      const list = [...prev];
      list[index] = { ...list[index], [field]: value };
      return list;
    });
  };

  const submitConsultationMutation = useMutation({
    mutationFn: ({ slotId, diagnosis, cleanRx }: { slotId: string; diagnosis: string; cleanRx: any[] }) =>
      completeConsultation(slotId, diagnosis, cleanRx),
    onMutate: () => {
      setSubmittingConsultation(true);
      setActionError(null);
      setActionSuccess(null);
    },
    onSuccess: () => {
      setActionSuccess("Consultation completed and prescription saved successfully.");
      setConsultingSlot(null);
      setConsultingPatient(null);
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });
    },
    onError: (err: any) => {
      console.error("Failed to complete consultation:", err);
      const errMsg = err?.response?.data?.errors?.[0]?.msg || err?.response?.data?.message || "Failed to complete consultation";
      setActionError(errMsg);
    },
    onSettled: () => {
      setSubmittingConsultation(false);
    },
  });

  const handleSubmitConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultingSlot || !consultingPatient) return;
    if (!diagnosis.trim()) {
      setActionError("Diagnosis is required.");
      return;
    }

    const cleanRx = prescriptions
      .map((p) => ({
        m: p.medication.trim(),
        d: p.dosage.trim(),
        f: p.frequency.trim(),
        t: p.duration.trim(),
      }))
      .filter((p) => p.m !== "");

    await submitConsultationMutation.mutateAsync({
      slotId: consultingSlot._id,
      diagnosis: diagnosis.trim(),
      cleanRx,
    });
  };

  return {
    activeTab,
    setActiveTab,
    doctorProfileId,
    doctorAppointments,
    loadingAppointments,
    actionError,
    setActionError,
    actionSuccess,
    setActionSuccess,
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
    consultingSlot,
    setConsultingSlot,
    consultingPatient,
    setConsultingPatient,
    diagnosis,
    setDiagnosis,
    prescriptions,
    setPrescriptions,
    submittingConsultation,
    contactAdminOpen,
    setContactAdminOpen,
    contactAdminMessage,
    setContactAdminMessage,
    contactSubmitting,
    setContactSubmitting,
    contactError,
    setContactError,
    contactSuccess,
    setContactSuccess,
    doctorSlotsArchivedOpen,
    setDoctorSlotsArchivedOpen,
    doctorVisitsArchivedOpen,
    setDoctorVisitsArchivedOpen,
    loadDoctorAppointments,
    handleSaveNote,
    handleContactAdminSubmit,
    handleCancelSlot,
    handleApproveRegistration,
    handleRejectRegistration,
    handleStartConsultation,
    handleAddPrescriptionLine,
    handleRemovePrescriptionLine,
    handlePrescriptionChange,
    handleSubmitConsultation,
  };
}
