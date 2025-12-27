import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import { SettingsProvider, useSettingsContext } from "./SettingsContext";

vi.mock("@infrastructure/data-sources", () => ({
  StorageDataSource: vi.fn().mockImplementation(() => ({
    get: vi.fn((key: string) => {
      if (key === "spreadsheetId") return "test-spreadsheet-id";
      return null;
    }),
    set: vi.fn(),
  })),
}));

describe("SettingsContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should provide settings context to children", () => {
    const TestComponent = () => {
      const { settings } = useSettingsContext();
      return <div data-testid="settings">{settings.spreadsheetId}</div>;
    };

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>,
    );

    expect(screen.getByTestId("settings")).toHaveTextContent(
      "test-spreadsheet-id",
    );
  });

  it("should allow updating settings", () => {
    const TestComponent = () => {
      const { settings, setSettings } = useSettingsContext();
      return (
        <div>
          <div data-testid="settings">{settings.spreadsheetId}</div>
          <button
            onClick={() => setSettings({ spreadsheetId: "new-id" })}
            data-testid="update-button"
          >
            Update
          </button>
        </div>
      );
    };

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>,
    );

    const button = screen.getByTestId("update-button");
    act(() => {
      button.click();
    });

    expect(screen.getByTestId("settings")).toHaveTextContent("new-id");
  });

  it("should throw error when useSettingsContext is used outside provider", () => {
    const TestComponent = () => {
      useSettingsContext();
      return <div>Test</div>;
    };

    // Suppress console.error for this test
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useSettingsContext must be used within a MyProvider");

    consoleErrorSpy.mockRestore();
  });
});
