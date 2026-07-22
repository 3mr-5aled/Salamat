import { describe, it, expect, beforeEach } from "vitest";
import api from "./api";

describe("Axios API Client", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should have correct base URL configuration", () => {
    expect(api.defaults.baseURL).toContain("/api/v1");
  });

  it("should attach Authorization header if token exists in localStorage", async () => {
    localStorage.setItem("token", "test-jwt-token");
    
    // Trigger interceptor check
    const config = { headers: {} as any };
    const requestInterceptor = (api.interceptors.request as any).handlers[0].fulfilled;
    const result = requestInterceptor(config);

    expect(result.headers.Authorization).toBe("Bearer test-jwt-token");
  });
});
