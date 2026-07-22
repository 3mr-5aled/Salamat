import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "./api";
import { getPatientProfile, createPatientProfile, getUpcomingAppointments } from "./patient";
import { getDoctors } from "./doctor";
import { 
  getDoctorSlots, 
  registerForAppointment, 
  cancelAppointmentRegistration,
  getAppointments,
  createAppointmentSlot,
  deleteAppointmentSlot,
  approvePatientRegistration,
  rejectPatientRegistration,
  completeConsultation
} from "./appointment";

vi.mock("./api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("API Service wrappers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Patient Services
  describe("Patient Services", () => {
    it("should query patient profile matching user ID", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { status: "success", data: [{ _id: "pat-123" }] } });
      const profile = await getPatientProfile("user-123");
      expect(api.get).toHaveBeenCalledWith("/patients?user=user-123");
      expect(profile).toEqual({ _id: "pat-123" });
    });

    it("should return null if patient profile matching user ID is not found", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { status: "success", data: [] } });
      const profile = await getPatientProfile("user-123");
      expect(api.get).toHaveBeenCalledWith("/patients?user=user-123");
      expect(profile).toBeNull();
    });

    it("should send post request to create profile", async () => {
      vi.mocked(api.post).mockResolvedValue({ data: { status: "success", data: { _id: "pat-123" } } });
      const result = await createPatientProfile({ gender: "male", dateOfBirth: "1990-01-01" });
      expect(api.post).toHaveBeenCalledWith("/patients", { gender: "male", dateOfBirth: "1990-01-01" });
      expect(result).toEqual({ _id: "pat-123" });
    });

    it("should query upcoming appointments", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { status: "success", data: [{ appointmentId: "app-123" }] } });
      const result = await getUpcomingAppointments();
      expect(api.get).toHaveBeenCalledWith("/patients/appointments/upcoming");
      expect(result).toEqual([{ appointmentId: "app-123" }]);
    });
  });

  // Doctor Services
  describe("Doctor Services", () => {
    it("should query doctors list with optional parameters", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { status: "success", data: [{ _id: "doc-123", fullName: "Dr. Smith" }] } });
      const params = { keyword: "Smith", specialty: "Cardiology" };
      const result = await getDoctors(params);
      expect(api.get).toHaveBeenCalledWith("/doctors", { params });
      expect(result).toEqual([{ _id: "doc-123", fullName: "Dr. Smith" }]);
    });
  });

  // Appointment Services
  describe("Appointment Services", () => {
    it("should query doctor slots status Scheduled", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { status: "success", data: [{ _id: "slot-123" }] } });
      const result = await getDoctorSlots("doc-123");
      expect(api.get).toHaveBeenCalledWith("/appointments?doctor=doc-123&status=Scheduled");
      expect(result).toEqual([{ _id: "slot-123" }]);
    });

    it("should register for an appointment slot with symptoms", async () => {
      vi.mocked(api.post).mockResolvedValue({ data: { status: "success" } });
      const result = await registerForAppointment("slot-123", "pat-123", "cough");
      expect(api.post).toHaveBeenCalledWith("/appointments/slot-123/register", {
        patientId: "pat-123",
        symptoms: "cough",
      });
      expect(result).toEqual({ status: "success" });
    });

    it("should cancel appointment registration", async () => {
      vi.mocked(api.delete).mockResolvedValue({ data: { status: "success" } });
      const result = await cancelAppointmentRegistration("slot-123");
      expect(api.delete).toHaveBeenCalledWith("/appointments/slot-123/cancel-my-registration");
      expect(result).toEqual({ status: "success" });
    });

    it("should query all appointments with params", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { status: "success", data: [{ _id: "app-123" }] } });
      const result = await getAppointments({ doctor: "doc-123" });
      expect(api.get).toHaveBeenCalledWith("/appointments", { params: { doctor: "doc-123" } });
      expect(result).toEqual([{ _id: "app-123" }]);
    });

    it("should create appointment slot", async () => {
      vi.mocked(api.post).mockResolvedValue({ data: { status: "success", data: { _id: "slot-123" } } });
      const result = await createAppointmentSlot({ date: "2026-06-27" });
      expect(api.post).toHaveBeenCalledWith("/appointments", { date: "2026-06-27" });
      expect(result).toEqual({ _id: "slot-123" });
    });

    it("should delete appointment slot", async () => {
      vi.mocked(api.delete).mockResolvedValue({ data: { status: "success" } });
      const result = await deleteAppointmentSlot("slot-123");
      expect(api.delete).toHaveBeenCalledWith("/appointments/slot-123");
      expect(result).toEqual({ status: "success" });
    });

    it("should approve patient registration", async () => {
      vi.mocked(api.patch).mockResolvedValue({ data: { status: "success", data: { _id: "slot-123" } } });
      const result = await approvePatientRegistration("slot-123", "pat-123");
      expect(api.patch).toHaveBeenCalledWith("/appointments/slot-123/approve-registration", { patientId: "pat-123" });
      expect(result).toEqual({ _id: "slot-123" });
    });

    it("should reject patient registration", async () => {
      vi.mocked(api.patch).mockResolvedValue({ data: { status: "success", data: { _id: "slot-123" } } });
      const result = await rejectPatientRegistration("slot-123", "pat-123", "no capacity");
      expect(api.patch).toHaveBeenCalledWith("/appointments/slot-123/reject-registration", { patientId: "pat-123", rejectionReason: "no capacity" });
      expect(result).toEqual({ _id: "slot-123" });
    });

    it("should complete consultation and serialize clinical records", async () => {
      vi.mocked(api.patch).mockResolvedValue({ data: { status: "success", data: { _id: "slot-123" } } });
      const result = await completeConsultation("slot-123", "Flu", [{ m: "Aspirin" }]);
      expect(api.patch).toHaveBeenCalledWith("/appointments/slot-123/status", {
        status: "Completed",
        notes: JSON.stringify({ dx: "Flu", rx: [{ m: "Aspirin" }] })
      });
      expect(result).toEqual({ _id: "slot-123" });
    });
  });
});
