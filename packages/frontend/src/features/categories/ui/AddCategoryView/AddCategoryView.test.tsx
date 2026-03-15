import { beforeEach, describe, expect, it, vi } from "vitest";
import * as wouter from "wouter";
import { useCategoryStore } from "@categories/infrastructure/useCategoryStore";
import { fireEvent, render, screen, waitFor } from "@test/test-utils";

import { SaveCategoryUseCase } from "../../application/cases";
import { AddCategoryView } from "./AddCategoryView";

const mockSetLocation = vi.fn();

vi.mock("wouter", async () => {
  const actual = await vi.importActual<typeof wouter>("wouter");
  return { ...actual, useRoute: vi.fn(() => [true]), useLocation: vi.fn() };
});

vi.mock("react-transition-group", () => ({
  Transition: ({ children }: any) => children,
}));

describe("AddCategoryView", () => {
  const mockSaveCategoryUseCase = {
    exec: vi.fn(),
  } as unknown as SaveCategoryUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCategoryStore.getState().reset();
    (wouter.useLocation as ReturnType<typeof vi.fn>).mockReturnValue([
      "/categories/add",
      mockSetLocation,
    ]);
  });

  it("should render the add category form", () => {
    render(<AddCategoryView saveCategoryUseCase={mockSaveCategoryUseCase} />);
    expect(screen.getByTestId("add-category-view")).toBeInTheDocument();
  });

  it("should call saveCategoryUseCase and redirect on successful submit", async () => {
    vi.mocked(mockSaveCategoryUseCase.exec).mockResolvedValue(undefined);

    const { container } = render(
      <AddCategoryView saveCategoryUseCase={mockSaveCategoryUseCase} />,
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Groceries" },
    });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      expect(mockSaveCategoryUseCase.exec).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockSetLocation).toHaveBeenCalledWith(
        expect.stringContaining("/categories"),
      );
    });
  });

  it("should show error message when saveCategoryUseCase throws", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(mockSaveCategoryUseCase.exec).mockRejectedValue(
      new Error("Name already taken"),
    );

    const { container } = render(
      <AddCategoryView saveCategoryUseCase={mockSaveCategoryUseCase} />,
    );

    // Fill in required fields so the form submits
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: "Duplicate" } });

    const typeSelect = container.querySelector<HTMLSelectElement>(
      'select[name="type"]',
    );
    if (typeSelect) {
      fireEvent.change(typeSelect, { target: { value: "Outcome" } });
    }

    fireEvent.submit(container.querySelector("form")!);

    await waitFor(
      () => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    consoleErrorSpy.mockRestore();
  });

  it("should initialize without errors", () => {
    expect(() => {
      render(<AddCategoryView saveCategoryUseCase={mockSaveCategoryUseCase} />);
    }).not.toThrow();
  });
});
