import React from "react";
import { PaymentMethodForm, PaymentMethodFormParams } from "@components";

export type AddPaymentMethodFormProps = Pick<
  PaymentMethodFormParams,
  "onSubmit" | "onSuccess"
>;

export function AddPaymentMethodForm(props: AddPaymentMethodFormProps) {
  return <PaymentMethodForm {...props} />;
}
