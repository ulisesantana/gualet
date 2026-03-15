import React from "react";
import { PaymentMethod } from "@gualet/shared";

import "./PaymentMethodList.css";
import { PaymentMethodCard } from "../PaymentMethodCard";

export interface PaymentMethodListProps {
  paymentMethods: PaymentMethod[];
  onDeletePaymentMethod?: (paymentMethodId: string) => Promise<void>;
}

export function PaymentMethodList({
  paymentMethods,
  onDeletePaymentMethod,
}: PaymentMethodListProps) {
  return paymentMethods.length ? (
    <ul className="payment-method-card-list">
      {React.Children.toArray(
        paymentMethods.map((paymentMethod) => (
          <li
            data-testid={`payment-method-item-${paymentMethod.id}`}
            key={paymentMethod.id.toString()}
          >
            <PaymentMethodCard
              paymentMethod={paymentMethod}
              onDelete={onDeletePaymentMethod}
            />
          </li>
        )),
      )}
    </ul>
  ) : (
    <span>There are no payment methods</span>
  );
}
