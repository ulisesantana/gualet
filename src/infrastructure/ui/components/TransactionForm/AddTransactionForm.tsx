import React from "react";
import { TransactionForm, TransactionFormParams } from "@components";

export type AddTransactionFormProps = Pick<
  TransactionFormParams,
  "settings" | "onSubmit"
>;

export function AddTransactionForm(props: AddTransactionFormProps) {
  return <TransactionForm {...props} />;
}
