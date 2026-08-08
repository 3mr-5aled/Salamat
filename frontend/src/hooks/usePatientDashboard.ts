import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { useModal } from "../contexts/ModalContext";
import { getFriendlyErrorMessage } from "../lib/error-parser";
import { getPatientProfile } from "../services/patient";
import { getDoctors } from "../services/doctor";
import {
  getDoctorSlots,
  registerForAppointment,
  cancelAppointmentRegistration,
  getAppointments,
} from "../services/appointment";
import { getTodayTipIndex } from "../lib/wellnessTips";
import { getLocalDateString } from "../lib/formatters";
import type { MappedPatientBooking } from "../types";

export type PatientTab = "overview" | "check-symptoms" | "find-doctor" | "bookings" | "profile";

export function usePatientDashboard() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, loading } = useAuth();
  const { confirm: customConfirm } = useModal();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<PatientTab>("overview");
  const [searchDoc, setSearchDoc] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [slotDateFilter, setSlotDateFilter] = useState(getLocalDateString());
  const [bookingMsg, setBookingMsg] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState("");

  const [bookingSlot, setBookingSlot] = useState<any | null>(null);
  const [viewingPrescription, setViewingPrescription] = useState<any | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);

  const [patientArchivedOpen, setPatientArchivedOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(getTodayTipIndex);

  // 1. Patient Profile Query
  const { data: patientProfile, isLoading: isCheckingProfile } = useQuery({
    queryKey: ["patientProfile", user?._id],
    queryFn: () => getPatientProfile(user!._id),
    enabled: !!(user && user.role === "patient"),
  });

  const patientId = patientProfile?._id || null;
  const checkingProfile = user?.role === "patient" ? isCheckingProfile : false;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate({ to: "/app/login" });
      return;
    }

    if (user && user.role === "patient" && !isCheckingProfile && !patientProfile) {
      navigate({ to: "/app/profile-setup" });
    }
  }, [user, isAuthenticated, loading, isCheckingProfile, patientProfile, navigate]);

  // 2. Doctors Query
  const { data: allDoctors = [] } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => getDoctors(),
    enabled: !!(isAuthenticated && user?.role === "patient"),
  });

  // Perform client-side live search filtering on doctor name, specialization, and clinic
  const doctors = allDoctors.filter((doc: any) => {
    if (!searchDoc.trim()) return true;
    const q = searchDoc.toLowerCase().trim();
    const name = (doc.fullName || doc.user?.name || "").toLowerCase();
    const spec = (doc.specialization || doc.specialty || "").toLowerCase();
    const clinicName = (doc.clinic?.name || "").toLowerCase();
    return name.includes(q) || spec.includes(q) || clinicName.includes(q);
  });

  // 3. Doctor Slots Query
  const { data: docSlots = [] } = useQuery({
    queryKey: ["doctorSlots", selectedDoc?._id],
    queryFn: async () => {
      const slots = await getDoctorSlots(selectedDoc._id);
      return [...slots].sort((a: any, b: any) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) return dateB - dateA;
        return (b.time || "").localeCompare(a.time || "");
      });
    },
    enabled: !!selectedDoc?._id,
  });

  // 4. Bookings Query
  const { data: bookings = [] } = useQuery({
    queryKey: ["patientAppointments", patientId],
    queryFn: async () => {
      if (!patientId) return [];
      const list = await getAppointments({ "patient.patientId": patientId });
      const mapped: MappedPatientBooking[] = list.map((app: any) => {
        const reg = app.patient?.find((p: any) => {
          const pId = p.patientId?._id || p.patientId;
          return pId === patientId;
        });
        return {
          appointmentId: app._id,
          doctor: app.doctor,
          clinic: app.clinic,
          date: app.date,
          time: app.time,
          duration: app.duration,
          notes: app.notes,
          status: app.status,
          registrationStatus: reg?.registrationStatus || "pending",
          registeredAt: reg?.registeredAt,
          approvedAt: reg?.approvedAt,
          rejectionReason: reg?.rejectionReason,
          symptoms: reg?.symptoms,
        };
      });

      mapped.sort((a, b) => {
        const getPriority = (x: MappedPatientBooking) => {
          if (x.status === "Cancelled") return 3;
          if (x.status === "Completed") return 2;
          if (x.registrationStatus === "approved") return 1;
          if (x.registrationStatus === "rejected") return 4;
          return 0; // pending approval
        };

        const pA = getPriority(a);
        const pB = getPriority(b);
        if (pA !== pB) return pA - pB;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      return mapped;
    },
    enabled: !!(isAuthenticated && user?.role === "patient" && patientId),
  });

  const loadDoctors = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["doctors"] });
  }, [queryClient]);

  const loadBookings = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["patientAppointments"] });
  }, [queryClient]);

  const handleSelectDoctor = (doc: any) => {
    setSelectedDoc(doc);
    setSlotDateFilter(getLocalDateString());
  };

  // Mutations
  const bookMutation = useMutation({
    mutationFn: ({ slotId, patientId, symptoms }: { slotId: string; patientId: string; symptoms: string }) =>
      registerForAppointment(slotId, patientId, symptoms),
    onSuccess: () => {
      setBookingMsg("Booking request pending approval.");
      setSelectedDoc(null);
      setBookingSlot(null);
      setSymptoms("");
      queryClient.invalidateQueries({ queryKey: ["patientAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctorSlots"] });
      setActiveTab("bookings");
    },
    onError: (err: any) => {
      setBookingMsg(err?.response?.data?.message || "Failed to submit booking");
    },
  });

  const handleBook = async (slotId: string) => {
    if (!patientId) return;
    await bookMutation.mutateAsync({ slotId, patientId, symptoms });
  };

  const cancelMutation = useMutation({
    mutationFn: (appId: string) => cancelAppointmentRegistration(appId),
    onMutate: () => {
      setCancelError(null);
      setCancelSuccess(null);
    },
    onSuccess: () => {
      setCancelSuccess("Booking request cancelled successfully.");
      queryClient.invalidateQueries({ queryKey: ["patientAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctorSlots"] });
    },
    onError: (err: any) => {
      console.error("Failed to cancel booking:", err);
      setCancelError(getFriendlyErrorMessage(err));
    },
  });

  const handleCancel = async (appId: string) => {
    if (await customConfirm({
      title: "Cancel Booking",
      message: "Are you sure you want to cancel this booking?",
      confirmText: "Cancel Booking",
      variant: "danger"
    })) {
      await cancelMutation.mutateAsync(appId);
    }
  };

  return {
    activeTab,
    setActiveTab,
    patientId,
    checkingProfile,
    doctors,
    searchDoc,
    setSearchDoc,
    selectedDoc,
    setSelectedDoc,
    docSlots,
    slotDateFilter,
    setSlotDateFilter,
    bookingMsg,
    setBookingMsg,
    symptoms,
    setSymptoms,
    bookings,
    bookingSlot,
    setBookingSlot,
    viewingPrescription,
    setViewingPrescription,
    cancelError,
    cancelSuccess,
    patientArchivedOpen,
    setPatientArchivedOpen,
    tipIndex,
    setTipIndex,
    loadDoctors,
    loadBookings,
    handleSelectDoctor,
    handleBook,
    handleCancel,
  };
}

