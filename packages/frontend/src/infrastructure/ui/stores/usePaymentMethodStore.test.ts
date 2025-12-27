import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import {
  DeletePaymentMethodUseCase,
  GetAllPaymentMethodsUseCase,
} from "@application/cases";
import { Id, PaymentMethod } from "@gualet/shared";

import { setUseCases, usePaymentMethodStore } from "./usePaymentMethodStore";

describe("usePaymentMethodStore", () => {
  const mockGetAllPaymentMethodsUseCase = {
    exec: vi.fn(),
  } as unknown as GetAllPaymentMethodsUseCase;

  const mockDeletePaymentMethodUseCase = {
    exec: vi.fn(),
  } as unknown as DeletePaymentMethodUseCase;

  const mockPaymentMethods: PaymentMethod[] = [
    new PaymentMethod({
      id: new Id("pm-1"),
      name: "Credit Card",
      icon: "💳",
      color: "#FF5733",
    }),
    new PaymentMethod({
      id: new Id("pm-2"),
      name: "Cash",
      icon: "💵",
      color: "#33FF57",
    }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    usePaymentMethodStore.getState().reset();
    setUseCases(
      mockGetAllPaymentMethodsUseCase,
      mockDeletePaymentMethodUseCase,
    );
  });

  describe("Initial State", () => {
    it("should have empty payment methods initially", () => {
      const { result } = renderHook(() => usePaymentMethodStore());
      expect(result.current.paymentMethods).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe("fetchPaymentMethods", () => {
    it("should fetch payment methods successfully", async () => {
      vi.mocked(mockGetAllPaymentMethodsUseCase.exec).mockResolvedValue(
        mockPaymentMethods,
      );
      const { result } = renderHook(() => usePaymentMethodStore());
      act(() => {
        result.current.fetchPaymentMethods();
      });
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe(null);
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      expect(result.current.paymentMethods).toEqual(mockPaymentMethods);
      expect(result.current.error).toBe(null);
      expect(mockGetAllPaymentMethodsUseCase.exec).toHaveBeenCalledTimes(1);
    });

    it("should handle fetch error", async () => {
      const errorMessage = "Failed to fetch from server";
      vi.mocked(mockGetAllPaymentMethodsUseCase.exec).mockRejectedValue(
        new Error(errorMessage),
      );
      const { result } = renderHook(() => usePaymentMethodStore());
      act(() => {
        result.current.fetchPaymentMethods();
      });
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.paymentMethods).toEqual([]);
    });

    it("should handle non-Error exceptions", async () => {
      vi.mocked(mockGetAllPaymentMethodsUseCase.exec).mockRejectedValue(
        "String error",
      );
      const { result } = renderHook(() => usePaymentMethodStore());
      act(() => {
        result.current.fetchPaymentMethods();
      });
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      expect(result.current.error).toBe("Failed to fetch payment methods");
    });

    it("should not fetch if use case is not set", async () => {
      setUseCases(undefined as any, mockDeletePaymentMethodUseCase);
      const { result } = renderHook(() => usePaymentMethodStore());
      await act(async () => {
        await result.current.fetchPaymentMethods();
      });
      expect(result.current.paymentMethods).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("deletePaymentMethod", () => {
    beforeEach(() => {
      vi.mocked(mockGetAllPaymentMethodsUseCase.exec).mockResolvedValue(
        mockPaymentMethods,
      );
    });

    it("should delete payment method successfully and refresh list", async () => {
      const paymentMethodIdToDelete = "pm-1";
      const remainingPaymentMethods = mockPaymentMethods.filter(
        (pm) => pm.id.value !== paymentMethodIdToDelete,
      );
      vi.mocked(mockGetAllPaymentMethodsUseCase.exec)
        .mockResolvedValueOnce(mockPaymentMethods)
        .mockResolvedValueOnce(remainingPaymentMethods);
      vi.mocked(mockDeletePaymentMethodUseCase.exec).mockResolvedValue(
        undefined,
      );
      const { result } = renderHook(() => usePaymentMethodStore());
      await act(async () => {
        await result.current.fetchPaymentMethods();
      });
      expect(result.current.paymentMethods).toHaveLength(2);
      await act(async () => {
        await result.current.deletePaymentMethod(paymentMethodIdToDelete);
      });
      expect(mockDeletePaymentMethodUseCase.exec).toHaveBeenCalledTimes(1);
      expect(mockDeletePaymentMethodUseCase.exec).toHaveBeenCalledWith(
        new Id(paymentMethodIdToDelete),
      );
      expect(mockGetAllPaymentMethodsUseCase.exec).toHaveBeenCalledTimes(2);
      expect(result.current.paymentMethods).toEqual(remainingPaymentMethods);
    });

    it("should handle delete error", async () => {
      const paymentMethodIdToDelete = "pm-1";
      const errorMessage = "Payment method has transactions";
      vi.mocked(mockDeletePaymentMethodUseCase.exec).mockRejectedValue(
        new Error(errorMessage),
      );
      const { result } = renderHook(() => usePaymentMethodStore());
      await expect(async () => {
        await result.current.deletePaymentMethod(paymentMethodIdToDelete);
      }).rejects.toThrow();
      const storeState = usePaymentMethodStore.getState();
      expect(storeState.error).toBe(errorMessage);
    });

    it("should handle non-Error exceptions during delete", async () => {
      vi.mocked(mockDeletePaymentMethodUseCase.exec).mockRejectedValue(
        "String error",
      );
      const { result } = renderHook(() => usePaymentMethodStore());
      await expect(async () => {
        await result.current.deletePaymentMethod("pm-1");
      }).rejects.toThrow();
      const storeState = usePaymentMethodStore.getState();
      expect(storeState.error).toBe("Failed to delete payment method");
    });

    it("should not delete if use case is not set", async () => {
      setUseCases(mockGetAllPaymentMethodsUseCase, undefined as any);
      const { result } = renderHook(() => usePaymentMethodStore());
      await act(async () => {
        await result.current.deletePaymentMethod("pm-1");
      });
      expect(mockDeletePaymentMethodUseCase.exec).not.toHaveBeenCalled();
    });
  });

  describe("reset", () => {
    it("should reset store to initial state", async () => {
      vi.mocked(mockGetAllPaymentMethodsUseCase.exec).mockResolvedValue(
        mockPaymentMethods,
      );
      const { result } = renderHook(() => usePaymentMethodStore());
      await act(async () => {
        await result.current.fetchPaymentMethods();
      });
      expect(result.current.paymentMethods).toHaveLength(2);
      act(() => {
        result.current.reset();
      });
      expect(result.current.paymentMethods).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe("setUseCases", () => {
    it("should allow injecting use cases", () => {
      const newGetAllUseCase = {
        exec: vi.fn(),
      } as unknown as GetAllPaymentMethodsUseCase;
      const newDeleteUseCase = {
        exec: vi.fn(),
      } as unknown as DeletePaymentMethodUseCase;
      expect(() => {
        setUseCases(newGetAllUseCase, newDeleteUseCase);
      }).not.toThrow();
    });
  });
});
