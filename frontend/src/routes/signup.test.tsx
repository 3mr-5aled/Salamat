import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { Route } from "./signup";

const mockSignup = vi.fn();

vi.mock("../contexts/AuthContext", () => {
  return {
    AuthProvider: ({ children }: any) => <div>{children}</div>,
    useAuth: () => ({
      signup: mockSignup,
      isAuthenticated: false,
      loading: false,
    }),
  };
});

vi.mock("@tanstack/react-router", () => {
  return {
    Link: ({ children, to, className, ...props }: any) => (
      <a href={to} className={className} {...props}>
        {children}
      </a>
    ),
    useNavigate: () => vi.fn(),
    createRoute: (config: any) => ({
      options: config,
    }),
    createRootRoute: (config: any) => ({
      options: config,
    }),
  };
});

describe("Signup route view", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show error if passwords do not match", async () => {
    const Component = Route.options.component!;
    render(<Component />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "Password123!" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "different-pass" } });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/Passwords don't match/i)).toBeInTheDocument();
    });
  });

  it("should submit sign up parameters successfully", async () => {
    const Component = Route.options.component!;
    render(<Component />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "Password123!" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "Password123!" } });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
    });

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        "John Doe",
        "john@example.com",
        "Password123!",
        "Password123!",
        "patient"
      );
    });
  });
});
