import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Route } from "./not-found";

const mockAuthContext = {
  user: null as any,
  isAuthenticated: false,
};

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => mockAuthContext,
}));

vi.mock("@tanstack/react-router", () => ({
  createRoute: (config: any) => ({ options: config }),
  createRootRoute: (config: any) => ({ options: config }),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

describe("NotFoundComponent", () => {
  beforeEach(() => {
    mockAuthContext.user = null;
    mockAuthContext.isAuthenticated = false;
  });

  it("renders 404 heading and message", () => {
    const Component = Route.options.component!;
    render(<Component />);

    expect(screen.getByText(/404 — Not Found/i)).toBeInTheDocument();
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
  });

  it("links to home page for guest users", () => {
    const Component = Route.options.component!;
    render(<Component />);

    const dashboardLink = screen.getByRole("link", { name: /Go to Home|Go to Dashboard/i });
    expect(dashboardLink).toHaveAttribute("href", "/");
  });

  it("links to /app with Doctor Portal label for logged-in doctor", () => {
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.user = { role: "doctor" };

    const Component = Route.options.component!;
    render(<Component />);

    const dashboardLink = screen.getByRole("link", { name: /Go to Doctor Portal/i });
    expect(dashboardLink).toHaveAttribute("href", "/app");
  });

  it("links to /app/admin for logged-in admin", () => {
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.user = { role: "admin" };

    const Component = Route.options.component!;
    render(<Component />);

    const dashboardLink = screen.getByRole("link", { name: /Go to Dashboard|Go to Admin Panel/i });
    expect(dashboardLink).toHaveAttribute("href", "/app/admin");
  });
});
