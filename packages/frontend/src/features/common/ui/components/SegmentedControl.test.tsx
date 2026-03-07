import React from "react";
import { fireEvent, render, screen } from "@test/test-utils";
import { vi } from "vitest";

import { SegmentedControl } from "./SegmentedControl";

describe("SegmentedControl", () => {
  const mockOnChange = vi.fn();
  const defaultProps = {
    name: "operation",
    value: "OUTCOME",
    onChange: mockOnChange,
    options: [
      { value: "OUTCOME", label: "Outcome" },
      { value: "INCOME", label: "Income" },
    ],
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders all options", () => {
    render(<SegmentedControl {...defaultProps} />);

    expect(screen.getByText("Outcome")).toBeInTheDocument();
    expect(screen.getByText("Income")).toBeInTheDocument();
  });

  it("renders with label when provided", () => {
    render(<SegmentedControl {...defaultProps} label="Operation" />);

    expect(screen.getByText("Operation")).toBeInTheDocument();
  });

  it("shows required indicator when required is true", () => {
    const { container } = render(
      <SegmentedControl {...defaultProps} label="Operation" required />,
    );

    const requiredIndicator = container.querySelector('span[style*="color"]');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveTextContent("*");
  });

  it("calls onChange when an option is clicked", () => {
    render(<SegmentedControl {...defaultProps} />);

    const incomeOption = screen.getByText("Income");
    fireEvent.click(incomeOption);

    expect(mockOnChange).toHaveBeenCalledWith("INCOME");
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("renders hidden input with current value", () => {
    const { container } = render(<SegmentedControl {...defaultProps} />);

    const hiddenInput = container.querySelector(
      'input[type="hidden"][name="operation"]',
    ) as HTMLInputElement;
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveValue("OUTCOME");
  });

  it("updates hidden input value when selection changes", () => {
    const { container, rerender } = render(
      <SegmentedControl {...defaultProps} />,
    );

    let hiddenInput = container.querySelector(
      'input[type="hidden"][name="operation"]',
    ) as HTMLInputElement;
    expect(hiddenInput).toHaveValue("OUTCOME");

    // Simulate value change
    rerender(<SegmentedControl {...defaultProps} value="INCOME" />);

    hiddenInput = container.querySelector(
      'input[type="hidden"][name="operation"]',
    ) as HTMLInputElement;
    expect(hiddenInput).toHaveValue("INCOME");
  });

  it("applies data-testid when provided", () => {
    render(<SegmentedControl {...defaultProps} data-testid="test-control" />);

    const control = screen.getByTestId("test-control");
    expect(control).toBeInTheDocument();
  });

  it("highlights the selected option", () => {
    render(<SegmentedControl {...defaultProps} value="OUTCOME" />);

    const outcomeBox = screen.getByText("Outcome").closest("[data-selected]");
    const incomeBox = screen.getByText("Income").closest("[data-selected]");

    // The selected option (OUTCOME) should be marked as selected
    expect(outcomeBox).toHaveAttribute("data-selected", "true");

    // The unselected option should not be marked as selected
    expect(incomeBox).toHaveAttribute("data-selected", "false");
  });
});
