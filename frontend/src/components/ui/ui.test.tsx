import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardTitle, CardContent } from "./card";
import { Input } from "./input";
import { Label } from "./label";

describe("UI Components Primitives", () => {
  it("should render Card with classes", () => {
    render(
      <Card data-testid="card">
        <CardTitle>Title</CardTitle>
        <CardContent>Content</CardContent>
      </Card>
    );
    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  it("should render Input correctly", () => {
    render(<Input placeholder="Enter username" data-testid="input" />);
    expect(screen.getByTestId("input")).toBeInTheDocument();
  });

  it("should render Label correctly", () => {
    render(<Label data-testid="label">Name</Label>);
    expect(screen.getByTestId("label")).toHaveTextContent("Name");
  });
});
