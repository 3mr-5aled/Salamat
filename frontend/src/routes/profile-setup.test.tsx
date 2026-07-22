import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { Route } from "./profile-setup";
import { createPatientProfile } from "../services/patient";

const mockNavigate = vi.fn();

vi.mock("@tanstack/react-router", () => {
  return {
    useNavigate: () => mockNavigate,
    createRoute: (config: any) => ({
      options: config,
    }),
    createRootRoute: (config: any) => ({
      options: config,
    }),
  };
});

vi.mock("../services/patient", () => ({
  createPatientProfile: vi.fn(),
}));

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { _id: "user-123" },
    isAuthenticated: true,
  }),
}));

describe("Profile Setup View Form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should validate form validation errors for missing or invalid inputs (DOB)", async () => {
    const Component = Route.options.component!;
    render(<Component />);
    
    // Attempt submit with empty fields
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Submit Profile/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/Date of birth is required/i)).toBeInTheDocument();
      expect(screen.queryByText(/Name must be at least 2 characters/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Relationship is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Emergency phone is required/i)).not.toBeInTheDocument();
    });
  });

  it("should trigger createPatientProfile and redirect on successful submission", async () => {
    const Component = Route.options.component!;
    render(<Component />);

    vi.mocked(createPatientProfile).mockResolvedValue({ _id: "pat-123" });

    // Fill form
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "1990-01-01" } });
    fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: "male" } });
    fireEvent.change(screen.getByLabelText(/Blood Group/i), { target: { value: "O+" } });
    fireEvent.change(screen.getByLabelText(/Chronic Diseases/i), { target: { value: "Diabetes, Asthma" } });

    // Emergency Contact Details
    fireEvent.change(screen.getByLabelText(/^Name/i), {
      target: { value: "Jane Doe" }
    });
    fireEvent.change(screen.getByLabelText(/Relationship/i), {
      target: { value: "Spouse" }
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: "12345678" }
    });

    // Address Details
    fireEvent.change(screen.getByLabelText(/Street/i), { target: { value: "123 Main St" } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: "New York" } });
    fireEvent.change(screen.getByLabelText(/State/i), { target: { value: "NY" } });
    fireEvent.change(screen.getByLabelText(/Zip/i), { target: { value: "10001" } });
    fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: "USA" } });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Submit Profile/i }));
    });

    await waitFor(() => {
      expect(createPatientProfile).toHaveBeenCalledWith({
        user: "user-123",
        dateOfBirth: "1990-01-01",
        gender: "male",
        bloodType: "O+",
        chronicDiseases: ["Diabetes", "Asthma"],
        emergencyContact: {
          name: "Jane Doe",
          relation: "Spouse",
          phone: "12345678"
        },
        address: "123 Main St, New York, NY, 10001, USA",
        addresses: {
          alias: "Home",
          details: "123 Main St",
          city: "New York",
          postalCode: "10001"
        }
      });
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/app" });
    });
  });
});
