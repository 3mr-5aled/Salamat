import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { Route } from "./forgot-password";
import { forgotPassword, verifyResetCode, resetPassword } from "../services/auth";

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

vi.mock("../services/auth", () => ({
  forgotPassword: vi.fn(),
  verifyResetCode: vi.fn(),
  resetPassword: vi.fn(),
}));

const mockLogin = vi.fn();

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
  }),
}));

describe("ForgotPassword Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should complete the multi-step password reset flow successfully", async () => {
    const Component = Route.options.component!;
    
    // Render Step 1
    render(<Component />);
    
    expect(screen.getByText(/Forgot Password\?/i)).toBeInTheDocument();
    
    // Step 1: Submit email
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "test@example.com" }
    });
    
    vi.mocked(forgotPassword).mockResolvedValue({ status: "Success" });
    
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Send Reset Code/i }));
    });
    
    await waitFor(() => {
      expect(forgotPassword).toHaveBeenCalledWith("test@example.com");
      expect(screen.getByText(/Verify Reset Code/i)).toBeInTheDocument();
    });

    // Step 2: Submit code
    fireEvent.change(screen.getByLabelText(/6-Digit Code/i), {
      target: { value: "123456" }
    });

    vi.mocked(verifyResetCode).mockResolvedValue({ status: "Success" });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Verify Code/i }));
    });

    await waitFor(() => {
      expect(verifyResetCode).toHaveBeenCalledWith("123456");
      expect(screen.getByRole("heading", { name: /New Password/i })).toBeInTheDocument();
    });

    // Step 3: Submit new password
    fireEvent.change(screen.getByLabelText(/^New Password/i), {
      target: { value: "Salamat123" }
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "Salamat123" }
    });

    vi.mocked(resetPassword).mockResolvedValue({ token: "new-jwt-token" });
    mockLogin.mockResolvedValue({});

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Reset & Sign In/i }));
    });

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith("test@example.com", "Salamat123", "Salamat123");
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "Salamat123");
      expect(screen.getByText(/Password Reset Done/i)).toBeInTheDocument();
    });

    // Step 4: Click redirect button
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Go to Dashboard/i }));
    });

    expect(mockNavigate).toHaveBeenCalledWith({ to: "/app" });
  });
});
