import React, { useCallback, useEffect } from "react";
import "./PaymentMethodsView.css";
import { PaymentMethodList, Loader } from "@components";
import {
  setUseCases,
  usePaymentMethodStore,
} from "@infrastructure/ui/stores/usePaymentMethodStore";
import {
  DeletePaymentMethodUseCase,
  GetAllPaymentMethodsUseCase,
} from "@application/cases";
interface PaymentMethodsViewProps {
  getAllPaymentMethodsUseCase: GetAllPaymentMethodsUseCase;
  deletePaymentMethodUseCase: DeletePaymentMethodUseCase;
}
export function PaymentMethodsView({
  getAllPaymentMethodsUseCase,
  deletePaymentMethodUseCase,
}: PaymentMethodsViewProps) {
  const paymentMethods = usePaymentMethodStore((state) => state.paymentMethods);
  const isLoading = usePaymentMethodStore((state) => state.isLoading);
  const fetchPaymentMethods = usePaymentMethodStore(
    (state) => state.fetchPaymentMethods,
  );
  const deletePaymentMethod = usePaymentMethodStore(
    (state) => state.deletePaymentMethod,
  );
  useEffect(() => {
    setUseCases(getAllPaymentMethodsUseCase, deletePaymentMethodUseCase);
    fetchPaymentMethods();
  }, []);
  const handleDeletePaymentMethod = useCallback(
    async (paymentMethodId: string) => {
      try {
        await deletePaymentMethod(paymentMethodId);
      } catch (error) {
        console.error("Error deleting payment method:", error);
      }
    },
    [deletePaymentMethod],
  );
  return (
    <div className="payment-methods-view">
      {isLoading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <PaymentMethodList
          paymentMethods={paymentMethods}
          onDeletePaymentMethod={handleDeletePaymentMethod}
        />
      )}
    </div>
  );
}
