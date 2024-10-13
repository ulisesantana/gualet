import { TransactionForm, TransactionFormParams } from "@components";

export type EditTransactionFormProps = Required<
  Pick<TransactionFormParams, "settings" | "onSubmit" | "transaction">
>;

export function EditTransactionForm(props: EditTransactionFormProps) {
  return <TransactionForm {...props} />;
}
