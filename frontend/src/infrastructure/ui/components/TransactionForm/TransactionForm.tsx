import { TransactionConfig } from "@domain/models";
import React, { RefObject, useEffect, useRef } from "react";
import {
  Category,
  Day,
  OperationType,
  PaymentMethod,
  Transaction,
} from "@gualet/core";

import { generateOnSubmitHandler } from "./submit-handler";

export interface TransactionFormParams {
  defaultPaymentMethod?: string;
  transaction?: Transaction | undefined;
  settings: TransactionConfig;
  onSubmit: (transaction: Transaction) => Promise<void>;
}

const dateSeparator = "-";

export function TransactionForm({
  transaction,
  settings,
  defaultPaymentMethod,
  onSubmit,
}: TransactionFormParams) {
  const formRef: RefObject<HTMLFormElement> = useRef(null);
  const [date, setDate] = React.useState(
    (transaction?.date ?? new Day()).toString(dateSeparator),
  );
  const [operation, setOperation] = React.useState<OperationType>(
    transaction?.operation ?? OperationType.Outcome,
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
      setOperation(OperationType.Outcome);
    },
    categories,
    paymentMethods: settings.paymentMethods,
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
          onChange={(e) => setOperation(e.target.value as OperationType)}
        >
          <option value={OperationType.Outcome}>{OperationType.Outcome}</option>
          <option value={OperationType.Income}>{OperationType.Income}</option>
        </select>
      </label>

      <label>
        <span>Category:</span>
        <input
          list="category-options"
          id="category-input"
          name="category"
          placeholder={transaction?.category.title || ""}
          defaultValue={transaction?.category.title || ""}
          required={!transaction}
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
        <select
          name="payment-method"
          required
          defaultValue={
            transaction?.paymentMethod.title || defaultPaymentMethod
          }
        >
          {settings.paymentMethods.map((paymentMethod: PaymentMethod) => (
            <option
              key={paymentMethod.id.toString()}
              value={paymentMethod.title}
            >
              {paymentMethod.title}
            </option>
          ))}
        </select>
      </label>
      <footer>
        <button type="submit">{transaction ? "💾" : "➕"}</button>
      </footer>
    </form>
  );
}
