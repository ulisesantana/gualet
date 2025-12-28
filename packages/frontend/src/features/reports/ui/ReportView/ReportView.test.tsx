import React from "react";
import {
  Day,
  generateDefaultIncomeCategories,
  generateDefaultOutcomeCategories,
} from "@gualet/shared";
import { vi } from "vitest";
import { TransactionBuilder } from "@test/builders";
import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen, waitFor } from "@test/test-utils";

import { ReportView } from "./ReportView";
import { GetReportUseCase } from "../../application/get-report/get-report.use-case";
import { Report } from "../../domain/report/report";

vi.mock("@common/infrastructure/hooks", () => ({
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
    const { container } = render(
      <ReportView getReportUseCase={mockGetReportUseCase} />,
    );

    expect(container.querySelector("#fromDate")).toBeInTheDocument();
    expect(container.querySelector("#toDate")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /get report/i }),
    ).toBeInTheDocument();
  });

  it("calls fetchReport with the correct dates on submit", async () => {
    const { container } = render(
      <ReportView getReportUseCase={mockGetReportUseCase} />,
    );

    const fromInput = container.querySelector("#fromDate") as HTMLInputElement;
    const toInput = container.querySelector("#toDate") as HTMLInputElement;

    await userEvent.clear(fromInput);
    await userEvent.type(fromInput, "2023-01-01");
    await userEvent.clear(toInput);
    await userEvent.type(toInput, "2023-01-31");
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
      expect(
        screen.getByRole("button", {
          name: /Outcome.*:.*-400/,
        }),
      ).toBeInTheDocument();
    });
  });

  it("displays 'No data' when report is null", () => {
    render(<ReportView getReportUseCase={mockGetReportUseCase} />);
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });
});
