import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ForbiddenFallback } from "./ForbiddenFallback";

const mockLogout = vi.fn();
vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { role: "patient", name: "John Doe" },
    isAuthenticated: true,
    logout: mockLogout,
  }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

describe("ForbiddenFallback Component", () => {
  it("renders 403 Access Denied heading and details", () => {
    render(<ForbiddenFallback />);
    expect(screen.getByText(/403 — Access Denied/i)).toBeInTheDocument();
    expect(screen.getByText(/Access Restricted/i)).toBeInTheDocument();
    expect(screen.getByText(/You do not have permission to access this area/i)).toBeInTheDocument();
  });

  it("renders action button to return to dashboard", () => {
    render(<ForbiddenFallback />);
    const returnLink = screen.getByRole("link", { name: /Return to My Dashboard/i });
    expect(returnLink).toHaveAttribute("href", "/app");
  });

  it("allows user to sign out", () => {
    render(<ForbiddenFallback />);
    const signoutBtn = screen.getByRole("button", { name: /Sign Out/i });
    fireEvent.click(signoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
