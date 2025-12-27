import React, { useCallback, useEffect } from "react";
import "./PaymentMethodsView.css";
import { Loader } from "@common/ui/components";
import {
  setUseCases,
  usePaymentMethodStore,
} from "@payment-methods/infrastructure/usePaymentMethodStore";
import { useLocation } from "wouter";
import { routes } from "@common/infrastructure/routes";

import {
  DeletePaymentMethodUseCase,
  GetAllPaymentMethodsUseCase,
} from "../../application/cases";
import { PaymentMethodList } from "../PaymentMethodList";

interface PaymentMethodsViewProps {
  getAllPaymentMethodsUseCase: GetAllPaymentMethodsUseCase;
  deletePaymentMethodUseCase: DeletePaymentMethodUseCase;
}
export function PaymentMethodsView({
  getAllPaymentMethodsUseCase,
  deletePaymentMethodUseCase,
}: PaymentMethodsViewProps) {
  const [, setLocation] = useLocation();
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

  const handleAddPaymentMethod = () => {
    setLocation(routes.paymentMethods.add);
  };

  return (
    <div className="payment-methods-view">
      {isLoading ? (
        <div className="loader-container" data-testid="loader-container">
          <Loader />
        </div>
      ) : (
        <>
          <div className="payment-methods-header">
            <button
              onClick={handleAddPaymentMethod}
              className="btn-primary"
              aria-label="Add new payment method"
            >
              Add Payment Method
            </button>
          </div>
          <PaymentMethodList
            paymentMethods={paymentMethods}
            onDeletePaymentMethod={handleDeletePaymentMethod}
          />
        </>
      )}
    </div>
  );
}
