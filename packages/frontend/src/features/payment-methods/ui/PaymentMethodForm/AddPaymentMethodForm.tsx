import React from "react";

import {
  PaymentMethodForm,
  PaymentMethodFormParams,
} from "./PaymentMethodForm";

export type AddPaymentMethodFormProps = Pick<
  PaymentMethodFormParams,
  "onSubmit" | "onSuccess"
>;

export function AddPaymentMethodForm(props: AddPaymentMethodFormProps) {
  return <PaymentMethodForm {...props} />;
}
