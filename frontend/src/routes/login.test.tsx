import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { Route } from "./login";

const mockLogin = vi.fn();

vi.mock("../contexts/AuthContext", () => {
  return {
    AuthProvider: ({ children }: any) => <div>{children}</div>,
    useAuth: () => ({
      login: mockLogin,
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

describe("Login route view", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show validation error for invalid email", async () => {
    const Component = Route.options.component!;
    render(<Component />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "invalid-email" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "short" } });
    
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/Must be a valid email or Egyptian phone number/i)).toBeInTheDocument();
    });
  });

  it("should trigger AuthContext login on successful validation", async () => {
    const Component = Route.options.component!;
    render(<Component />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "Password123!" } });
    
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("john@example.com", "Password123!");
    });
  });
});
