import React from "react";
import "./AddPaymentMethodView.css";
import { AddPaymentMethodForm } from "@components";
import { PaymentMethod } from "@gualet/shared";
import { SavePaymentMethodUseCase } from "@application/cases";
import { routes } from "@infrastructure/ui/routes";
import { useLocation, useRoute } from "wouter";
import { Transition } from "react-transition-group";
import { usePaymentMethodStore } from "@infrastructure/ui/stores/usePaymentMethodStore";

interface AddPaymentMethodViewProps {
  savePaymentMethodUseCase: SavePaymentMethodUseCase;
}

export function AddPaymentMethodView({
  savePaymentMethodUseCase,
}: AddPaymentMethodViewProps) {
  const [match] = useRoute(routes.paymentMethods.add);
  const [, setLocation] = useLocation();
  const fetchPaymentMethods = usePaymentMethodStore(
    (state) => state.fetchPaymentMethods,
  );

  const onSubmit = async (paymentMethod: PaymentMethod) => {
    await savePaymentMethodUseCase.exec(paymentMethod);
  };

  const onSuccess = () => {
    // Refresh payment methods list after successful creation
    fetchPaymentMethods();
    // Redirect to payment methods list
    setLocation(routes.paymentMethods.list);
  };

  return (
    <Transition in={match} timeout={500}>
      <div className="payment-method-details-view">
        <AddPaymentMethodForm onSubmit={onSubmit} onSuccess={onSuccess} />
      </div>
    </Transition>
  );
}
