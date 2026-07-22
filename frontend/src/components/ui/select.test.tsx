import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Select } from "./select";

describe("Select Component Primitive", () => {
  it("should render select options correctly", () => {
    render(
      <Select data-testid="select" defaultValue="male">
        <option value="male">Male</option>
        <option value="female">Female</option>
      </Select>
    );
    const select = screen.getByTestId("select") as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(select.value).toBe("male");
  });
});
