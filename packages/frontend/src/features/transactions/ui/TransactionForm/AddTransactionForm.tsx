import React from "react";

import { TransactionForm, TransactionFormParams } from "./TransactionForm";

export type AddTransactionFormProps = Required<
  Pick<TransactionFormParams, "settings" | "onSubmit" | "defaultPaymentMethod">
>;

export function AddTransactionForm(props: AddTransactionFormProps) {
  return <TransactionForm {...props} />;
}
