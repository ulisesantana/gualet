import React, { RefObject, useEffect, useRef } from "react";
import {
  Category,
  Day,
  Transaction,
  TransactionConfig,
  TransactionOperation,
} from "domain/models";

export interface AddTransactionFormProps {
  settings: TransactionConfig;
  onSubmit: (transaction: Transaction) => Promise<void>;
}

function getOnSubmitHandler(
  categories: Category[],
  onSubmit: (transaction: Transaction) => Promise<void>,
  onSubmitSuccess: (transaction: Transaction) => void,
) {
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const categoryId = formData.get("category") as string;
    const category = categories.find((c) => c.id.equals(categoryId));
    if (!category) {
      throw new Error(`Category with id ${categoryId} does not exist.`);
    }

    const transaction = new Transaction({
      amount: Number(formData.get("amount")),
      category: category,
      date: new Day(formData.get("date") as string),
      description: formData.get("description") as string,
      operation: formData.get("operation") as TransactionOperation,
      paymentMethod: formData.get("payment-method") as string,
    });
    console.debug("BEFORE");
    onSubmit(transaction).then(() => {
      console.debug("AFTER");
      form.reset();
      onSubmitSuccess(transaction);
    });
  };
}

export function AddTransactionForm({
  settings,
  onSubmit,
}: AddTransactionFormProps) {
  const today = new Day();
  const [date, setDate] = React.useState(today.toString());
  const [operation, setOperation] = React.useState<TransactionOperation>(
    TransactionOperation.Outcome,
  );
  const [categories, setCategories] = React.useState<Category[]>(
    settings.outcomeCategories,
  );
  const formRef: RefObject<HTMLFormElement> = useRef(null);

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

  const onSubmitHandler = getOnSubmitHandler(
    categories,
    onSubmit,
    (transaction: Transaction) => {
      setDate(transaction.date.toString());
      setOperation(TransactionOperation.Outcome);
    },
  );

  return (
    <form
      className="add-transaction-form"
      onSubmit={onSubmitHandler}
      ref={formRef}
    >
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
        <input list="category-options" name="category" required />
        <datalist id="category-options">
          {categories.map((category) => (
            <option
              key={category.id.toString()}
              value={category.id.toString()}
              label={category.title}
            />
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
        <input type="text" name="description" placeholder="Enter description" />
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
