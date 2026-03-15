import React from "react";

import {
  PaymentMethodForm,
  PaymentMethodFormParams,
} from "./PaymentMethodForm";

export type AddPaymentMethodFormProps = Pick<
  PaymentMethodFormParams,
  "onSubmit" | "onSuccess" | "onError"
>;

export function AddPaymentMethodForm(props: AddPaymentMethodFormProps) {
  return <PaymentMethodForm {...props} />;
}
