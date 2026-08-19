import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GlobalErrorFallback } from "./GlobalErrorFallback";

describe("GlobalErrorFallback Component", () => {
  it("renders error heading and message", () => {
    const error = new Error("Test error breakdown");
    render(<GlobalErrorFallback error={error} reset={vi.fn()} />);

    expect(screen.getByText(/Something Went Wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/An unexpected application error has occurred/i)).toBeInTheDocument();
  });

  it("triggers reset callback when Try Again is clicked", () => {
    const handleReset = vi.fn();
    render(<GlobalErrorFallback error={new Error("Failed")} reset={handleReset} />);

    const retryBtn = screen.getByRole("button", { name: /Try Again/i });
    fireEvent.click(retryBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it("toggles error details when show technical details button is clicked", () => {
    const error = new Error("Debug stack trace message");
    render(<GlobalErrorFallback error={error} reset={vi.fn()} />);

    expect(screen.queryByText(/Debug stack trace message/i)).not.toBeInTheDocument();
    const detailsToggle = screen.getByRole("button", { name: /Show Technical Details/i });
    fireEvent.click(detailsToggle);
    expect(screen.getAllByText(/Debug stack trace message/i).length).toBeGreaterThan(0);
  });
});
