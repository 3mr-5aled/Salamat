import { describe, it, expect } from "vitest";
import queryClient from "./queryClient";

describe("React Query Client", () => {
  it("should initialize client with default options", () => {
    expect(queryClient).toBeDefined();
    const defaultOptions = queryClient.getDefaultOptions();
    expect(defaultOptions.queries?.retry).toBe(1);
    expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false);
  });
});
