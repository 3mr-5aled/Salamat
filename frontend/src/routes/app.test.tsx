import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { Route } from "./app";
import type { ReactElement } from "react";
import { getLocalDateString } from "../lib/formatters";

import { ModalProvider } from "../contexts/ModalContext";

const renderWithQueryClient = (ui: ReactElement) => {
  return render(<ModalProvider>{ui}</ModalProvider>);
};

const mockDataStore: Record<string, any> = {
  doctorProfile: { _id: "doc-profile-123", clinic: "clinic-abc" },
  doctorAppointments: [],
  patientProfile: { _id: "pat-abc", user: "user-patient-123", fullName: "Frank Patient" },
  doctors: [],
  doctorSlots: [],
  patientAppointments: [],
  myPatients: [],
};

vi.mock("@tanstack/react-query", () => {
  return {
    useQuery: (options: any) => {
      const key = options.queryKey?.[0];
      const data = mockDataStore[key];
      return { data, isLoading: false, isSuccess: true, refetch: vi.fn() };
    },
    useMutation: (options: any) => {
      const mutateAsync = async (args: any) => {
        if (options.onMutate) {
          options.onMutate(args);
        }
        try {
          const res = await options.mutationFn(args);
          if (options.onSuccess) {
            await options.onSuccess(res, args);
          }
          return res;
        } catch (err) {
          if (options.onError) {
            await options.onError(err, args);
          }
          throw err;
        }
      };
      return {
        mutate: (args: any) => {
          mutateAsync(args);
        },
        mutateAsync,
        isLoading: false,
      };
    },
    useQueryClient: () => ({
      invalidateQueries: vi.fn(),
    }),
  };
});
import { getDoctorProfile } from "../services/doctor";
import {
  getAppointments,
  createAppointmentSlot,
  cancelClinicSession,
  approvePatientRegistration,
  completeConsultation,
  getDoctorSlots,
  registerForAppointment,
} from "../services/appointment";



vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  createRoute: (config: any) => ({
    options: config,
  }),
  createRootRoute: (config: any) => ({
    options: config,
  }),
}));

const mockUser = {
  _id: "doc-user-123",
  role: "doctor",
  name: "Dr. Gregory House",
  isActive: true,
  specialization: "Diagnostic Medicine",
};

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
    loading: false,
  }),
}));

beforeEach(() => {
  mockUser.role = "doctor";
  mockUser._id = "doc-user-123";
  mockUser.name = "Dr. Gregory House";
  mockUser.isActive = true;
  mockUser.specialization = "Diagnostic Medicine";
});

vi.mock("../services/patient", () => ({
  getPatientProfile: vi.fn(),
  getUpcomingAppointments: vi.fn(),
  getPatientById: vi.fn().mockResolvedValue({ _id: "patient-123", fullName: "John Doe" }),
}));

vi.mock("../services/doctor", () => ({
  getDoctors: vi.fn(),
  getDoctorProfile: vi.fn(),
}));

vi.mock("../services/appointment", () => ({
  getDoctorSlots: vi.fn(),
  registerForAppointment: vi.fn(),
  cancelAppointmentRegistration: vi.fn(),
  getAppointments: vi.fn(),
  createAppointmentSlot: vi.fn(),
  cancelClinicSession: vi.fn(),
  approvePatientRegistration: vi.fn(),
  rejectPatientRegistration: vi.fn(),
  completeConsultation: vi.fn(),
}));

const mockConfirm = vi.fn().mockResolvedValue(true);
const mockPrompt = vi.fn().mockResolvedValue("Some reason");

vi.mock("../contexts/ModalContext", () => ({
  useModal: () => ({
    confirm: mockConfirm,
    prompt: mockPrompt,
  }),
  ModalProvider: ({ children }: any) => <>{children}</>,
}));

describe("Doctor Slots Tab and Functionality", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser.role = "doctor";
    mockUser._id = "doc-user-123";
    mockUser.name = "Dr. Gregory House";

    // Synchronous mock data store defaults
    mockDataStore.doctorProfile = { _id: "doc-profile-123", clinic: "clinic-abc" };
    mockDataStore.doctorAppointments = [
      {
        _id: "slot-1",
        date: getLocalDateString(),
        time: "09:00",
        duration: 60,
        NumberOfPatients: 0,
        MaxNumberOfPatients: 2,
        type: "consultation",
        status: "Scheduled",
        notes: "Morning consultation",
        patient: [],
      },
    ];
    mockDataStore.patientProfile = { _id: "pat-abc", user: "user-patient-123", fullName: "Frank Patient" };
    mockDataStore.doctors = [];
    mockDataStore.doctorSlots = [];
    mockDataStore.patientAppointments = [];
    mockDataStore.myPatients = [];
    
    // Default mocks
    vi.mocked(getDoctorProfile).mockResolvedValue({
      _id: "doc-profile-123",
      clinic: "clinic-abc",
    });

    vi.mocked(getAppointments).mockResolvedValue(mockDataStore.doctorAppointments);
  });

  it("renders the doctor dashboard overview by default, allows switching to Consultation Hours, and displays active slots", async () => {
    const Component = Route.options.component!;
    
    await act(async () => {
      renderWithQueryClient(<Component />);
    });

    // Check we see overview welcome message
    expect(screen.getByText(/Welcome, Dr. Gregory House/i)).toBeInTheDocument();

    // Click "Consultation Hours" tab
    const slotsTabButton = await screen.findByRole("button", { name: /Consultation Hours/i });
    await act(async () => {
      fireEvent.click(slotsTabButton);
    });

    // Verify slots are rendered (creation form is restricted/removed)
    expect(screen.getByText("Morning consultation")).toBeInTheDocument();
  });

  it.skip("submits the create slot form with correct values and updates duration in minutes", async () => {
    const Component = Route.options.component!;
    
    await act(async () => {
      renderWithQueryClient(<Component />);
    });

    // Click "Consultation Hours" tab
    const slotsTabButton = screen.getByRole("button", { name: /Consultation Hours/i });
    await act(async () => {
      fireEvent.click(slotsTabButton);
    });

    // Set values
    const dateInput = screen.getByLabelText(/^Date$/i);
    const startTimeInput = screen.getByLabelText(/Start Time/i);
    const endTimeInput = screen.getByLabelText(/End Time/i);
    const maxPatientsInput = screen.getByLabelText(/Max Patients Capacity/i);
    const notesInput = screen.getByLabelText(/Slot Notes \(Optional\)/i);
    const typeSelect = screen.getByLabelText(/Appointment Type/i);

    fireEvent.change(dateInput, { target: { value: "2026-07-10" } });
    fireEvent.change(startTimeInput, { target: { value: "10:00" } });
    fireEvent.change(endTimeInput, { target: { value: "11:30" } });
    fireEvent.change(maxPatientsInput, { target: { value: "4" } });
    fireEvent.change(notesInput, { target: { value: "New slot description" } });
    fireEvent.change(typeSelect, { target: { value: "surgery" } });

    vi.mocked(createAppointmentSlot).mockResolvedValue({ _id: "new-slot-id" });

    // Submit form
    const submitButton = screen.getByRole("button", { name: /Create Slot/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(createAppointmentSlot).toHaveBeenCalledWith({
        doctor: "doc-profile-123",
        clinic: "clinic-abc",
        date: "2026-07-10",
        time: "10:00",
        duration: 90, // 11:30 (690m) - 10:00 (600m) = 90m
        MaxNumberOfPatients: 4,
        type: "surgery",
        notes: "New slot description",
      });
      expect(screen.getByText(/Consultation slot created successfully./i)).toBeInTheDocument();
    });
  });

  it("allows a doctor to delete a vacant scheduled slot", async () => {
    const Component = Route.options.component!;
    
    await act(async () => {
      renderWithQueryClient(<Component />);
    });

    // Click "Consultation Hours" tab
    const slotsTabButton = await screen.findByRole("button", { name: /Consultation Hours/i });
    await act(async () => {
      fireEvent.click(slotsTabButton);
    });

    // Wait for slot to render
    await waitFor(() => {
      expect(screen.getByText("Morning consultation")).toBeInTheDocument();
    });

    // Click delete button
    const deleteButton = screen.getByRole("button", { name: /Cancel Session/i });
    
    vi.mocked(cancelClinicSession).mockResolvedValue({ status: "success" });

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(mockConfirm).toHaveBeenCalled();
    expect(cancelClinicSession).toHaveBeenCalledWith("slot-1");

    await waitFor(() => {
      expect(screen.getByText(/Clinic session cancelled successfully./i)).toBeInTheDocument();
    });
  });

  describe("Doctor Dashboard - Visits and Consultations", () => {
    it("allows a doctor to approve a pending registration", async () => {
      const mockAppointments = [{
        _id: "slot-999",
        date: getLocalDateString(),
        time: "11:00",
        duration: 30,
        status: "Scheduled",
        type: "consultation",
        NumberOfPatients: 1,
        MaxNumberOfPatients: 5,
        patient: [{
          patientId: { _id: "pat-999", fullName: "Jane Patient", email: "jane@test.com" },
          registrationStatus: "pending",
          symptoms: "Headache",
        }],
      }];
      mockDataStore.doctorAppointments = mockAppointments;
      vi.mocked(getAppointments).mockResolvedValue(mockAppointments);

      const Component = Route.options.component!;
      await act(async () => {
        renderWithQueryClient(<Component />);
      });

      // Go to Visits tab
      const visitsBtn = await screen.findByRole("button", { name: /Patient Visits/i });
      fireEvent.click(visitsBtn);

      const approveBtn = await screen.findByRole("button", { name: /Approve/i });
      
      await act(async () => {
        fireEvent.click(approveBtn);
      });

      await waitFor(() => {
        expect(approvePatientRegistration).toHaveBeenCalledWith("slot-999", "pat-999");
      });
    });

    it("allows a doctor to complete consultation with diagnosis and prescriptions", async () => {
      const mockAppointments = [{
        _id: "slot-888",
        date: getLocalDateString(),
        time: "11:00",
        duration: 30,
        status: "Scheduled",
        type: "consultation",
        NumberOfPatients: 1,
        MaxNumberOfPatients: 5,
        patient: [{
          patientId: { _id: "pat-888", fullName: "Jane Patient", email: "jane@test.com" },
          registrationStatus: "approved",
          symptoms: "Fever",
        }],
      }];
      mockDataStore.doctorAppointments = mockAppointments;
      vi.mocked(getAppointments).mockResolvedValue(mockAppointments);

      const Component = Route.options.component!;
      await act(async () => {
        renderWithQueryClient(<Component />);
      });

      const visitsBtn = await screen.findByRole("button", { name: /Patient Visits/i });
      fireEvent.click(visitsBtn);

      const startBtn = await screen.findByRole("button", { name: /Start Consultation/i });
      fireEvent.click(startBtn);

      // Form fields in consultation panel
      const dxInput = screen.getByLabelText(/Diagnosis/i);
      const medInput = screen.getByPlaceholderText(/Medication Name/i);
      const dosageInput = screen.getByPlaceholderText(/e.g. 500mg/i);
      const freqInput = screen.getByPlaceholderText(/e.g. Twice daily/i);
      const durInput = screen.getByPlaceholderText(/e.g. 7 days/i);
      const submitBtn = screen.getByRole("button", { name: /Complete & Save Consultation/i });

      fireEvent.change(dxInput, { target: { value: "Influenza A" } });
      fireEvent.change(medInput, { target: { value: "Tamiflu" } });
      fireEvent.change(dosageInput, { target: { value: "75mg" } });
      fireEvent.change(freqInput, { target: { value: "Once daily" } });
      fireEvent.change(durInput, { target: { value: "5 days" } });

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      await waitFor(() => {
        expect(completeConsultation).toHaveBeenCalledWith(
          "slot-888",
          "Influenza A",
          [{ m: "Tamiflu", d: "75mg", f: "Once daily", t: "5 days" }]
        );
      });
    });
  });
});

describe("Patient Dashboard - Booking flow", () => {
  it("allows a patient to search doctors, select a slot, and submit booking details", async () => {
    // Switch auth role mock to patient
    mockUser.role = "patient";
    mockUser._id = "user-patient-123";
    mockUser.name = "Frank Patient";

    const { getPatientProfile } = await import("../services/patient");
    const { getDoctors } = await import("../services/doctor");
    
    mockDataStore.patientProfile = { _id: "pat-abc", user: "user-patient-123", fullName: "Frank Patient" };
    mockDataStore.doctors = [{ _id: "doc-xyz", fullName: "Dr. Gregory House", specialization: "Diagnostic Medicine" }];
    const todayStr = getLocalDateString();
    mockDataStore.doctorSlots = [{ _id: "slot-xyz", date: todayStr, time: "23:59", status: "Scheduled", NumberOfPatients: 0, MaxNumberOfPatients: 5 }];

    vi.mocked(getPatientProfile).mockResolvedValue(mockDataStore.patientProfile);
    vi.mocked(getDoctors).mockResolvedValue(mockDataStore.doctors);
    vi.mocked(getDoctorSlots).mockResolvedValue(mockDataStore.doctorSlots);

    const Component = Route.options.component!;
    await act(async () => {
      renderWithQueryClient(<Component />);
    });

    // Go to Find a Doctor tab
    const findDocBtn = await screen.findByRole("button", { name: /Find a Doctor/i });
    fireEvent.click(findDocBtn);

    await waitFor(() => {
      expect(screen.getByText("Dr. Gregory House")).toBeInTheDocument();
    });

    // Select doctor
    fireEvent.click(screen.getByRole("button", { name: /View Slots/i }));

    await waitFor(() => {
      expect(screen.getByText("23:59")).toBeInTheDocument();
    });

    // Select slot to book
    fireEvent.click(screen.getByRole("button", { name: /Book Slot/i }));

    // Input symptoms in modal
    const symptomsInput = screen.getByLabelText(/Describe Symptoms/i);
    fireEvent.change(symptomsInput, { target: { value: "Chronic leg pain" } });

    // Submit booking request
    fireEvent.click(screen.getByRole("button", { name: /Confirm Appointment Booking/i }));

    await waitFor(() => {
      expect(registerForAppointment).toHaveBeenCalledWith("slot-xyz", "pat-abc", "Chronic leg pain");
    });
  });
});

describe("Patient Dashboard - Bookings & Prescription Tracking", () => {
  it("displays patient appointments and shows completed prescription card", async () => {
    mockUser.role = "patient";
    mockUser._id = "user-patient-123";
    mockUser.name = "Frank Patient";

    const { getPatientProfile } = await import("../services/patient");
    vi.mocked(getPatientProfile).mockResolvedValue({ _id: "pat-abc", user: "user-patient-123", fullName: "Frank Patient" });

    // Mock an appointment that is Completed with serialized JSON notes
    const rxJSON = JSON.stringify({
      dx: "Common Cold",
      rx: [{ m: "Vitamin C", d: "1000mg", f: "Once daily", t: "10 days" }]
    });

    mockDataStore.patientProfile = { _id: "pat-abc", user: "user-patient-123", fullName: "Frank Patient" };
    mockDataStore.patientAppointments = [{
      _id: "slot-completed",
      doctor: { fullName: "Dr. House", specialization: "Diagnostics" },
      date: "2026-06-25",
      time: "09:00",
      status: "Completed",
      notes: rxJSON,
      patient: [{
        patientId: "pat-abc",
        registrationStatus: "approved"
      }]
    }];

    vi.mocked(getPatientProfile).mockResolvedValue(mockDataStore.patientProfile);
    vi.mocked(getAppointments).mockResolvedValue(mockDataStore.patientAppointments);

    const Component = Route.options.component!;
    await act(async () => {
      renderWithQueryClient(<Component />);
    });

    // Go to My Bookings tab
    const myBookingsBtn = await screen.findByRole("button", { name: /My Bookings/i });
    fireEvent.click(myBookingsBtn);

    // Expand history
    const historyBtn = await screen.findByRole("button", { name: /View Consultation History/i });
    fireEvent.click(historyBtn);

    await waitFor(() => {
      expect(screen.getByText("Completed")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /View Prescription/i })).toBeInTheDocument();
    });

    // Open prescription view modal
    fireEvent.click(screen.getByRole("button", { name: /View Prescription/i }));

    await waitFor(() => {
      expect(screen.getByText("Clinical Diagnosis")).toBeInTheDocument();
      expect(screen.getByText("Common Cold")).toBeInTheDocument();
      expect(screen.getByText("Vitamin C")).toBeInTheDocument();
      expect(screen.getByText("1000mg")).toBeInTheDocument();
    });
  });
});
