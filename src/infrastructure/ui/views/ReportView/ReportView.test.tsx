import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TransactionRepository } from "@application/repositories";
import { Day, defaultIncomeCategories } from "@domain/models";
import { useRepositories } from "@infrastructure/ui/hooks";
import { Mock, Mocked, vi } from "vitest";
import { ReportView } from "@views";
import { TransactionBuilder } from "@test/builders";
import userEvent from "@testing-library/user-event";

vi.mock("@infrastructure/ui/hooks");

describe("ReportView", () => {
  const mockTransactionRepository = {
    find: vi.fn().mockResolvedValue([]),
  } as unknown as Mocked<TransactionRepository>;

  const mockUseRepositories = {
    isReady: true,
    repositories: { transaction: mockTransactionRepository },
    isLoading: false,
    setIsLoading: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRepositories as Mock).mockReturnValue(mockUseRepositories);
  });

  it("renders the form with date fields and submit button", () => {
    render(<ReportView />);

    expect(screen.getByLabelText(/from:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/to:/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /get report/i }),
    ).toBeInTheDocument();
  });

  it("calls fetchReport with the correct dates on submit", async () => {
    render(<ReportView />);

    await userEvent.clear(screen.getByLabelText(/from:/i));
    await userEvent.type(screen.getByLabelText(/from:/i), "2023-01-01");
    await userEvent.clear(screen.getByLabelText(/to:/i));
    await userEvent.type(screen.getByLabelText(/to:/i), "2023-01-31");
    await userEvent.click(screen.getByRole("button", { name: /get report/i }));

    await waitFor(() => {
      expect(mockTransactionRepository.find).toHaveBeenCalledWith({
        from: new Day("2023-01-01"),
        to: new Day("2023-01-31"),
      });
    });
  });

  it("displays report data correctly when received", async () => {
    const to = new Day();
    const from = to.cloneWithPreviousMonth();
    mockTransactionRepository.find.mockResolvedValue([
      new TransactionBuilder()
        .withAmount(300)
        .withCategory(defaultIncomeCategories[0])
        .build(),
      new TransactionBuilder()
        .withAmount(200)
        .withCategory(defaultIncomeCategories[1])
        .build(),
      new TransactionBuilder().withAmount(200).build(),
      new TransactionBuilder().withAmount(200).build(),
    ]);

    render(<ReportView />);

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
      expect(screen.getByText(/Rent: -400/)).toBeInTheDocument();
    });
  });

  it("displays 'No data' when report is null", () => {
    render(<ReportView />);
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });
});
