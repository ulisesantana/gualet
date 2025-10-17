import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  Day,
  generateDefaultIncomeCategories,
  generateDefaultOutcomeCategories,
} from "@gualet/shared";
import { vi } from "vitest";
import { ReportView } from "@views";
import { TransactionBuilder } from "@test/builders";
import userEvent from "@testing-library/user-event";
import { GetReportUseCase } from "@application/cases";
import { Report } from "@domain/models";

vi.mock("@infrastructure/ui/hooks", () => ({
  useLoader: vi.fn(() => ({
    isLoading: false,
    setIsLoading: vi.fn(),
    Loader: () => <div>Loader</div>,
  })),
}));

describe("ReportView", () => {
  const to = new Day();
  const from = to.cloneWithPreviousMonth();

  const incomeCategory1 = generateDefaultIncomeCategories()[0];
  const incomeCategory2 = generateDefaultIncomeCategories()[1];
  const outcomeCategory = generateDefaultOutcomeCategories()[1];

  const mockTransactions = [
    new TransactionBuilder()
      .withAmount(300)
      .withCategory(incomeCategory1)
      .build(),
    new TransactionBuilder()
      .withAmount(200)
      .withCategory(incomeCategory2)
      .build(),
    new TransactionBuilder()
      .withAmount(200)
      .withCategory(outcomeCategory)
      .build(),
    new TransactionBuilder()
      .withAmount(200)
      .withCategory(outcomeCategory)
      .build(),
  ];

  const mockReport = new Report({
    from,
    to,
    transactions: mockTransactions,
  });

  const mockGetReportUseCase = {
    exec: vi.fn().mockResolvedValue(mockReport),
  } as unknown as GetReportUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with date fields and submit button", () => {
    render(<ReportView getReportUseCase={mockGetReportUseCase} />);

    expect(screen.getByLabelText(/from:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/to:/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /get report/i }),
    ).toBeInTheDocument();
  });

  it("calls fetchReport with the correct dates on submit", async () => {
    render(<ReportView getReportUseCase={mockGetReportUseCase} />);

    await userEvent.clear(screen.getByLabelText(/from:/i));
    await userEvent.type(screen.getByLabelText(/from:/i), "2023-01-01");
    await userEvent.clear(screen.getByLabelText(/to:/i));
    await userEvent.type(screen.getByLabelText(/to:/i), "2023-01-31");
    await userEvent.click(screen.getByRole("button", { name: /get report/i }));

    await waitFor(() => {
      expect(mockGetReportUseCase.exec).toHaveBeenCalledWith({
        from: new Day("2023-01-01"),
        to: new Day("2023-01-31"),
      });
    });
  });

  it("displays report data correctly when received", async () => {
    const to = new Day();
    const from = to.cloneWithPreviousMonth();

    render(<ReportView getReportUseCase={mockGetReportUseCase} />);

    fireEvent.submit(screen.getByRole("button", { name: /get report/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          new RegExp(`balance for transactions between ${from} and ${to}`, "i"),
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: /Income.*:.*500/,
        }),
      ).toBeInTheDocument();
      expect(screen.getByText(/Salary: 300/)).toBeInTheDocument();
      expect(screen.getByText(/Freelancing: 200/)).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: /Outcome.*:.*-400/,
        }),
      ).toBeInTheDocument();
      expect(screen.getByText(/Groceries: -400/)).toBeInTheDocument();
    });
  });

  it("displays 'No data' when report is null", () => {
    render(<ReportView getReportUseCase={mockGetReportUseCase} />);
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });
});
