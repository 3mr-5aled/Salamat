import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { Route } from "./profile";
import { getPatientProfile, updatePatientProfile } from "../services/patient";
import { getDoctorProfile, updateDoctorProfile } from "../services/doctor";

const mockNavigate = vi.fn();

vi.mock("@tanstack/react-router", () => {
  return {
    useNavigate: () => mockNavigate,
    Link: ({ children, to }: any) => <a href={to}>{children}</a>,
    createRoute: (config: any) => ({
      options: config,
    }),
    createRootRoute: (config: any) => ({
      options: config,
    }),
  };
});

vi.mock("../services/patient", () => ({
  getPatientProfile: vi.fn(),
  updatePatientProfile: vi.fn(),
}));

vi.mock("../services/doctor", () => ({
  getDoctorProfile: vi.fn(),
  updateDoctorProfile: vi.fn(),
}));

let mockUser: any = {
  _id: "user-123",
  name: "John Doe",
  email: "john@example.com",
  role: "patient",
};

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
    loading: false,
  }),
}));

describe("Profile Page Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser.role = "patient";
    mockUser.name = "John Doe";
  });

  it("should load and display patient profile form and submit updates", async () => {
    // Mock patient profile get response
    vi.mocked(getPatientProfile).mockResolvedValue({
      _id: "pat-123",
      fullName: "John Doe",
      dateOfBirth: "1990-05-15T00:00:00.000Z",
      gender: "male",
      bloodType: "O+",
      chronicDiseases: ["Diabetes", "Hypertension"],
      emergencyContact: {
        name: "Jane Doe",
        relation: "Spouse",
        phone: "12345678"
      },
      addresses: {
        alias: "Home",
        details: "123 Main St",
        postalCode: "10001"
      }
    });

    const Component = Route.options.component!;
    
    await act(async () => {
      render(<Component />);
    });

    // Verify patient form is loaded and fields are populated
    await waitFor(() => {
      expect(screen.getByLabelText(/Full Name/i)).toHaveValue("John Doe");
      expect(screen.getByLabelText(/Date of Birth/i)).toHaveValue("1990-05-15");
      expect(screen.getByLabelText(/Blood Group/i)).toHaveValue("O+");
      expect(screen.getByLabelText(/Chronic Diseases/i)).toHaveValue("Diabetes, Hypertension");
      expect(screen.getByLabelText(/Contact Name/i)).toHaveValue("Jane Doe");
      expect(screen.getByLabelText(/Relationship/i)).toHaveValue("Spouse");
      expect(screen.getByLabelText(/Street Address/i)).toHaveValue("123 Main St");
    });

    // Make edits
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "John E. Doe" } });
    fireEvent.change(screen.getByLabelText(/Blood Group/i), { target: { value: "A+" } });
    fireEvent.change(screen.getByLabelText(/Street Address/i), { target: { value: "456 Health St" } });

    vi.mocked(updatePatientProfile).mockResolvedValue({ _id: "pat-123" });

    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Save Profile Details/i }));
    });

    await waitFor(() => {
      expect(updatePatientProfile).toHaveBeenCalledWith("pat-123", {
        fullName: "John E. Doe",
        dateOfBirth: "1990-05-15",
        gender: "male",
        bloodType: "A+",
        chronicDiseases: ["Diabetes", "Hypertension"],
        emergencyContact: {
          name: "Jane Doe",
          relation: "Spouse",
          phone: "12345678"
        },
        address: "456 Health St, 10001",
        addresses: {
          alias: "Home",
          details: "456 Health St",
          city: "",
          postalCode: "10001"
        }
      });
      expect(screen.getByText(/Profile details updated successfully/i)).toBeInTheDocument();
    });
  });

  it("should load and display doctor profile form and submit updates", async () => {
    mockUser.role = "doctor";
    mockUser.name = "Dr. Alice";

    // Mock doctor profile get response — no availability field
    vi.mocked(getDoctorProfile).mockResolvedValue({
      _id: "doc-123",
      fullName: "Dr. Alice",
      gender: "female",
      dateOfBirth: "1985-08-20T00:00:00.000Z",
      specialization: "Cardiology",
      yearsOfExperience: 12,
      qualifications: ["MD", "FACC"],
    });

    const Component = Route.options.component!;

    await act(async () => {
      render(<Component />);
    });

    // Verify doctor form is loaded and fields are populated
    await waitFor(() => {
      expect(screen.getByLabelText(/Full Name/i)).toHaveValue("Dr. Alice");
      expect(screen.getByLabelText(/Specialization/i)).toHaveValue("Cardiology");
      expect(screen.getByLabelText(/Years of Experience/i)).toHaveValue(12);
      expect(screen.getByLabelText(/Qualifications/i)).toHaveValue("MD, FACC");
    });

    // Make edits
    fireEvent.change(screen.getByLabelText(/Years of Experience/i), { target: { value: "13" } });
    fireEvent.change(screen.getByLabelText(/Qualifications/i), { target: { value: "MD, FACC, PhD" } });

    vi.mocked(updateDoctorProfile).mockResolvedValue({ _id: "doc-123" });

    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Save Professional Profile/i }));
    });

    await waitFor(() => {
      expect(updateDoctorProfile).toHaveBeenCalledWith("doc-123", {
        fullName: "Dr. Alice",
        specialization: "Cardiology",
        gender: "female",
        dateOfBirth: "1985-08-20",
        yearsOfExperience: 13,
        qualifications: ["MD", "FACC", "PhD"],
      });
      expect(screen.getByText(/Professional profile updated successfully/i)).toBeInTheDocument();
    });
  });
});
