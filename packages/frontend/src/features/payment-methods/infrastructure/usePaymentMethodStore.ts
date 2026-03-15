import { create } from "zustand";
import { Id, PaymentMethod } from "@gualet/shared";

import {
  DeletePaymentMethodUseCase,
  GetAllPaymentMethodsUseCase,
} from "../application/cases";

interface PaymentMethodStore {
  // State
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPaymentMethods: () => Promise<void>;
  deletePaymentMethod: (paymentMethodId: string) => Promise<void>;
  reset: () => void;
}

// Use cases will be injected via setters
let getAllPaymentMethodsUseCase: GetAllPaymentMethodsUseCase;
let deletePaymentMethodUseCase: DeletePaymentMethodUseCase;

export const setUseCases = (
  getAllUseCase: GetAllPaymentMethodsUseCase,
  deleteUseCase: DeletePaymentMethodUseCase,
) => {
  getAllPaymentMethodsUseCase = getAllUseCase;
  deletePaymentMethodUseCase = deleteUseCase;
};

export const usePaymentMethodStore = create<PaymentMethodStore>((set, get) => ({
  // Initial state
  paymentMethods: [],
  isLoading: false,
  error: null,

  // Fetch all payment methods
  fetchPaymentMethods: async () => {
    if (!getAllPaymentMethodsUseCase) {
      console.error("getAllPaymentMethodsUseCase not set");
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const paymentMethods = await getAllPaymentMethodsUseCase.exec();
      set({ paymentMethods, isLoading: false });
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch payment methods",
        isLoading: false,
      });
    }
  },

  // Delete payment method and refresh list
  deletePaymentMethod: async (paymentMethodId: string) => {
    if (!deletePaymentMethodUseCase) {
      console.warn("deletePaymentMethodUseCase not set");
      return;
    }

    try {
      await deletePaymentMethodUseCase.exec(new Id(paymentMethodId));
      // Auto-refresh after delete
      await get().fetchPaymentMethods();
    } catch (error) {
      console.error("Error deleting payment method:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete payment method",
      });
      throw error; // Re-throw so UI can handle it
    }
  },

  // Reset store (useful for testing)
  reset: () => set({ paymentMethods: [], isLoading: false, error: null }),
}));
