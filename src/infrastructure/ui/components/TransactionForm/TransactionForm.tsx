import {
  Category,
  Day,
  Transaction,
  TransactionConfig,
  TransactionOperation,
} from "@domain/models";
import React, { RefObject, useEffect, useRef } from "react";

export interface TransactionFormParams {
  transaction?: Transaction;
  settings: TransactionConfig;
  onSubmit: (transaction: Transaction) => Promise<void>;
}

interface OnSubmitHandlerGeneratorParams {
  originalTransaction?: Transaction;
  categories: Category[];
  onSubmit: (transaction: Transaction) => Promise<void>;
  afterSubmit?: (transaction: Transaction) => void;
}

const dateSeparator = "-";

export function TransactionForm({
  transaction,
  settings,
  onSubmit,
}: TransactionFormParams) {
  const formRef: RefObject<HTMLFormElement> = useRef(null);
  const [date, setDate] = React.useState(
    (transaction?.date ?? new Day()).toString(dateSeparator),
  );
  const [operation, setOperation] = React.useState<TransactionOperation>(
    transaction?.operation ?? TransactionOperation.Outcome,
  );
  const [categories, setCategories] = React.useState<Category[]>(
    transaction?.isIncome()
      ? settings.incomeCategories
      : settings.outcomeCategories,
  );

  useEffect(() => {
    setCategories(
      Transaction.isOutcome(operation)
        ? settings.outcomeCategories
        : settings.incomeCategories,
    );
    if (formRef?.current?.category) {
      formRef.current.category.value = "";
    }
  }, [operation, settings]);

  const onSubmitHandler = generateOnSubmitHandler({
    afterSubmit: (transaction: Transaction) => {
      setDate(transaction.date.toString(dateSeparator));
      setOperation(TransactionOperation.Outcome);
    },
    categories,
    onSubmit,
    originalTransaction: transaction,
  });

  return (
    <form className="transaction-form" onSubmit={onSubmitHandler} ref={formRef}>
      <label>
        Operation:
        <select
          required
          name="operation"
          value={operation}
          onChange={(e) => setOperation(e.target.value as TransactionOperation)}
        >
          <option value={TransactionOperation.Outcome}>
            {TransactionOperation.Outcome}
          </option>
          <option value={TransactionOperation.Income}>
            {TransactionOperation.Income}
          </option>
        </select>
      </label>

      <label>
        <span>Category:</span>
        <input
          list="category-options"
          name="category"
          placeholder={transaction?.category.title || ""}
          defaultValue={transaction?.category.title || ""}
          required
        />
        <datalist id="category-options">
          {categories.map((category) => (
            <option key={category.id.toString()} value={category.title} />
          ))}
        </datalist>
      </label>

      <label>
        <span>Amount:</span>
        <input
          type="number"
          name="amount"
          step="0.01"
          required
          inputMode="decimal"
          placeholder="Enter amount"
          defaultValue={transaction?.amount}
        />
      </label>

      <label>
        <span>Date:</span>
        <input
          type="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value as string)}
        />
      </label>

      <label>
        <span>Description:</span>
        <input
          type="text"
          name="description"
          defaultValue={transaction?.description}
          placeholder="Enter description"
        />
      </label>

      <label>
        <span>Payment method:</span>
        <select name="payment-method" required>
          {settings.types.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <footer>
        <button type="submit">+</button>
      </footer>
    </form>
  );
}

function generateOnSubmitHandler({
  afterSubmit,
  categories,
  onSubmit,
  originalTransaction,
}: OnSubmitHandlerGeneratorParams) {
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const categoryTitle = formData.get("category") as string;
    const category = categories.find((c) => c.title === categoryTitle);
    if (!category) {
      throw new Error(`Category ${categoryTitle} does not exist.`);
    }

    const transaction = new Transaction({
      id: originalTransaction?.id,
      amount: Number(formData.get("amount")),
      category: category,
      date: new Day(formData.get("date") as string),
      description: formData.get("description") as string,
      operation: formData.get("operation") as TransactionOperation,
      paymentMethod: formData.get("payment-method") as string,
    });

    onSubmit(transaction).then(() => {
      if (!originalTransaction && afterSubmit) {
        form.reset();
        afterSubmit(transaction);
      }
    });
  };
}
