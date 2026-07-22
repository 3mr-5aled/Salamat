import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import api from "../services/api";

vi.mock("../services/api", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

const TestComponent = () => {
  const { user, isAuthenticated, login, signup, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? "in" : "out"}</span>
      <span data-testid="user-name">{user?.name || "none"}</span>
      <button onClick={() => login("john@test.com", "pass123")}>Login</button>
      <button onClick={() => signup("John", "john@test.com", "pass123", "pass123", "patient")}>Signup</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("AuthContext & useAuth", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should be unauthenticated by default", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId("auth-status").textContent).toBe("out");
  });

  it("should login successfully and save token", async () => {
    const mockUser = { id: "1", name: "John Doe", email: "john@test.com", role: "patient" };
    (api.post as any).mockResolvedValue({
      data: {
        status: "success",
        token: "jwt-token-123",
        data: { user: mockUser }
      }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText("Login").click();
    });

    expect(screen.getByTestId("auth-status").textContent).toBe("in");
    expect(screen.getByTestId("user-name").textContent).toBe("John Doe");
    expect(localStorage.getItem("token")).toBe("jwt-token-123");
    expect(localStorage.getItem("user")).toContain("John Doe");
  });

  it("should logout successfully and clean storage", async () => {
    localStorage.setItem("token", "dummy");
    localStorage.setItem("user", JSON.stringify({ name: "Jane" }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText("Logout").click();
    });

    expect(screen.getByTestId("auth-status").textContent).toBe("out");
    expect(localStorage.getItem("token")).toBeNull();
  });
});
