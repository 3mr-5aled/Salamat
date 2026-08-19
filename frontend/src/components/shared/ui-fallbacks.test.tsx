import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyState } from "./EmptyState";
import { DataErrorFallback } from "./DataErrorFallback";
import { SearchX } from "lucide-react";

describe("EmptyState Component", () => {
  it("renders default title and description", () => {
    render(<EmptyState title="No items found" description="Try adjusting your search criteria." />);
    expect(screen.getByText("No items found")).toBeInTheDocument();
    expect(screen.getByText("Try adjusting your search criteria.")).toBeInTheDocument();
  });

  it("renders custom icon if provided", () => {
    render(
      <EmptyState
        title="Empty List"
        description="Nothing here"
        icon={SearchX}
      />
    );
    expect(screen.getByText("Empty List")).toBeInTheDocument();
  });

  it("renders action button and triggers callback on click", () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="No Clinics"
        description="No clinics available."
        action={{ label: "Add Clinic", onClick: handleAction }}
      />
    );
    const actionBtn = screen.getByRole("button", { name: /Add Clinic/i });
    expect(actionBtn).toBeInTheDocument();
    fireEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});

describe("DataErrorFallback Component", () => {
  it("renders error message and retry button", () => {
    const handleRetry = vi.fn();
    render(
      <DataErrorFallback
        message="Failed to load appointments."
        onRetry={handleRetry}
      />
    );
    expect(screen.getByText("Failed to load appointments.")).toBeInTheDocument();
    const retryBtn = screen.getByRole("button", { name: /Try Again|Retry/i });
    expect(retryBtn).toBeInTheDocument();
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
