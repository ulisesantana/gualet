import { TransactionForm, TransactionFormParams } from "@components";

export type EditTransactionFormProps = Required<TransactionFormParams>;

export function EditTransactionForm(props: EditTransactionFormProps) {
  return <TransactionForm {...props} />;
}
