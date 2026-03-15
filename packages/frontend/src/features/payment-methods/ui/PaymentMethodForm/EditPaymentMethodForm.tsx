import React from "react";

import {
  PaymentMethodForm,
  PaymentMethodFormParams,
} from "./PaymentMethodForm";

export type EditPaymentMethodFormProps = Required<PaymentMethodFormParams>;

export function EditPaymentMethodForm(props: EditPaymentMethodFormProps) {
  return <PaymentMethodForm {...props} />;
}
