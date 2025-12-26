import React from "react";
import { PaymentMethodForm, PaymentMethodFormParams } from "@components";

export type EditPaymentMethodFormProps = Required<PaymentMethodFormParams>;

export function EditPaymentMethodForm(props: EditPaymentMethodFormProps) {
  return <PaymentMethodForm {...props} />;
}
