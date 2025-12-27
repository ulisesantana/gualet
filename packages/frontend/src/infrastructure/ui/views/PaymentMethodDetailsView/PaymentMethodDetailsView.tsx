import React, { useEffect, useState } from "react";
import "./PaymentMethodDetailsView.css";
import { EditPaymentMethodForm, Loader } from "@components";
import {
  GetPaymentMethodUseCase,
  SavePaymentMethodUseCase,
} from "@application/cases";
import { routes } from "@infrastructure/ui/routes";
import { useLocation, useRoute } from "wouter";
import { Transition } from "react-transition-group";
import { useLoader } from "@infrastructure/ui/hooks";
import { Id, PaymentMethod } from "@gualet/shared";
import { usePaymentMethodStore } from "@infrastructure/ui/stores/usePaymentMethodStore";

interface PaymentMethodDetailsViewProps {
  getPaymentMethodUseCase: GetPaymentMethodUseCase;
  savePaymentMethodUseCase: SavePaymentMethodUseCase;
}

export function PaymentMethodDetailsView({
  getPaymentMethodUseCase,
  savePaymentMethodUseCase,
}: PaymentMethodDetailsViewProps) {
  const [match, params] = useRoute<{ id: string }>(
    routes.paymentMethods.details,
  );
  const [, setLocation] = useLocation();
  const { isLoading, setIsLoading } = useLoader();
  const [paymentMethod, setPaymentMethod] = useState<
    PaymentMethod | undefined
  >();
  const fetchPaymentMethods = usePaymentMethodStore(
    (state) => state.fetchPaymentMethods,
  );

  useEffect(() => {
    if (params) {
      getPaymentMethodUseCase
        .exec(new Id(params.id))
        .then(setPaymentMethod)
        .catch((error) => {
          console.error("Error getting payment method", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  const onSubmit = async (paymentMethod: PaymentMethod) => {
    await savePaymentMethodUseCase.exec(paymentMethod);
  };

  const onSuccess = () => {
    fetchPaymentMethods();
    setLocation(routes.paymentMethods.list);
  };

  return (
    <Transition in={match} timeout={500}>
      <div className="payment-method-details-view">
        {isLoading ? (
          <div className="loader-container">
            <Loader />
          </div>
        ) : (
          <div className="content">
            {paymentMethod ? (
              <EditPaymentMethodForm
                paymentMethod={paymentMethod}
                onSubmit={onSubmit}
                onSuccess={onSuccess}
                onError={(error: Error) =>
                  console.error("Error updating payment method:", error)
                }
              />
            ) : (
              <p>Payment method not found</p>
            )}
          </div>
        )}
      </div>
    </Transition>
  );
}
