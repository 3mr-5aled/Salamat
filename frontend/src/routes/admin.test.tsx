import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { Route } from "./admin";
import { getClinics } from "../services/clinic";
import { getAllDoctorsAdmin } from "../services/doctor";
import { getAllPatientsAdmin } from "../services/patient";
import { getAppointments } from "../services/appointment";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalProvider } from "../contexts/ModalContext";

const mockNavigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
  createRoute: (config: any) => ({
    options: config,
  }),
  createRootRoute: (config: any) => ({
    options: config,
  }),
}));

vi.mock("../services/clinic", () => ({
  getClinics: vi.fn(),
  createClinic: vi.fn(),
  updateClinic: vi.fn(),
  deleteClinic: vi.fn(),
  assignDoctorToClinic: vi.fn(),
  removeDoctorFromClinic: vi.fn(),
}));

vi.mock("../services/doctor", () => ({
  getAllDoctorsAdmin: vi.fn(),
}));

vi.mock("../services/patient", () => ({
  getAllPatientsAdmin: vi.fn(),
}));

vi.mock("../services/appointment", () => ({
  getAppointments: vi.fn(),
  createAppointmentSlot: vi.fn(),
}));

const mockUser = { _id: "admin-123", role: "admin", name: "Administrator" };

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
    loading: false,
  }),
}));

describe("AdminDashboardComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render overview statistics and switch to clinics tab for CRUD", async () => {
    vi.mocked(getClinics).mockResolvedValue([
      { _id: "c-1", name: "Cardiology Clinic", clinicNumber: "CL-001", specialty: "Cardiology", doctors: [] }
    ]);
    vi.mocked(getAllDoctorsAdmin).mockResolvedValue([
      { _id: "d-1", fullName: "Dr. Alice", specialization: "Cardiology" }
    ]);
    vi.mocked(getAllPatientsAdmin).mockResolvedValue([
      { _id: "p-1", fullName: "John Doe", gender: "male", bloodType: "A+", chronicDiseases: [] }
    ]);
    vi.mocked(getAppointments).mockResolvedValue([]);

    const Component = Route.options.component!;
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <ModalProvider>
            <Component />
          </ModalProvider>
        </QueryClientProvider>
      );
    });

    // Verify statistics render in overview
    await waitFor(() => {
      expect(screen.getByText("Total Clinics")).toBeInTheDocument();
    });

    // Switch tab to clinics
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "clinics" }));
    });

    await waitFor(() => {
      expect(screen.getByText(/Cardiology Clinic/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Add Clinic/i })).toBeInTheDocument();
    });

    // Trigger clinic creation modal
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Add Clinic/i }));
    });

    expect(screen.getByText(/Create New Clinic/i)).toBeInTheDocument();
  });
});
