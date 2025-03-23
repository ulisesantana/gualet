import { describe, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Router } from "wouter";
import { TestRouter } from "@test/TestRouter";
import { AddCategoryView } from "@views";

vi.mock("@application/cases", () => ({
  SaveCategoryUseCase: vi.fn(() => ({
    exec: vi.fn(),
  })),
}));

vi.mock("@infrastructure/ui/hooks", () => ({
  useRepositories: vi.fn(() => ({
    repositories: {
      category: {},
    },
  })),
}));

vi.mock("@components", () => ({
  AddCategoryForm: () => <div>AddCategoryForm</div>,
}));

describe("AddCategoryView", () => {
  it("renders AddCategoryForm", () => {
    render(
      <Router>
        <TestRouter path="/categories/add" />
        <AddCategoryView />
      </Router>,
    );

    expect(screen.getByText("AddCategoryForm")).toBeInTheDocument();
  });
});
