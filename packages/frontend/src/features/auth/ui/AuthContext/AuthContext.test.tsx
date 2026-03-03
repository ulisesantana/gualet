import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import React from "react";

import { AuthProvider, useAuth } from "./AuthContext";

describe("AuthContext", () => {
  describe("useAuth", () => {
    it("should return auth context when used within AuthProvider", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBeNull();
      expect(typeof result.current.setIsAuthenticated).toBe("function");
      expect(typeof result.current.logout).toBe("function");
    });

    it("should throw error when used outside AuthProvider", () => {
      const consoleError = console.error;
      console.error = () => {};

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow("useAuth must be used within AuthProvider");

      console.error = consoleError;
    });

    it("should update isAuthenticated when setIsAuthenticated is called", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.setIsAuthenticated(true);
      });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it("should set isAuthenticated to false when logout is called", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.setIsAuthenticated(true);
      });
      expect(result.current.isAuthenticated).toBe(true);

      act(() => {
        result.current.logout();
      });
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
