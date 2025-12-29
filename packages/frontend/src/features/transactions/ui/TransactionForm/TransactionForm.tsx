import { TransactionConfig } from "@domain/models";
import React, { RefObject, useEffect, useRef } from "react";
import {
  Category,
  Day,
  OperationType,
  PaymentMethod,
  Transaction,
} from "@gualet/shared";
import { Button, Input, Select, Stack } from "@common/ui/components";
import { Field } from "@chakra-ui/react";

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
  const [paymentMethod, setPaymentMethod] = React.useState<string>(
    transaction?.paymentMethod.title ||
      defaultPaymentMethod ||
      settings.paymentMethods[0]?.title ||
      "",
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
      setPaymentMethod(
        defaultPaymentMethod || settings.paymentMethods[0]?.title || "",
      );
    },
    categories,
    paymentMethods: settings.paymentMethods,
    onSubmit,
    originalTransaction: transaction,
  });

  return (
    <form onSubmit={onSubmitHandler} ref={formRef}>
      <Stack gap={4}>
        <Select
          label="Operation"
          name="operation"
          required
          value={operation}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setOperation(e.target.value as OperationType)
          }
          options={[
            { value: OperationType.Outcome, label: OperationType.Outcome },
            { value: OperationType.Income, label: OperationType.Income },
          ]}
        />

        <Field.Root required={!transaction}>
          <input
            list="category-options"
            id="category-input"
            name="category"
            required={!transaction}
            placeholder={transaction?.category.title || ""}
            defaultValue={transaction?.category.title || ""}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #e2e8f0",
              borderRadius: "0.375rem",
            }}
          />
          <datalist id="category-options">
            {categories.map((category) => (
              <option key={category.id.toString()} value={category.title} />
            ))}
          </datalist>
        </Field.Root>

        <Input
          label="Amount"
          type="number"
          name="amount"
          step="0.01"
          min="0.01"
          required
          inputMode="decimal"
          placeholder="Enter amount"
          defaultValue={transaction?.amount}
        />

        <Input
          label="Date"
          type="date"
          name="date"
          value={date}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDate(e.target.value as string)
          }
        />

        <Input
          label="Description"
          type="text"
          name="description"
          required
          defaultValue={transaction?.description}
          placeholder="Enter description"
        />

        <Select
          label="Payment method"
          name="payment-method"
          required
          value={paymentMethod}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setPaymentMethod(e.target.value)
          }
          options={settings.paymentMethods.map(
            (paymentMethod: PaymentMethod) => ({
              value: paymentMethod.title,
              label: paymentMethod.title,
            }),
          )}
        />

        <Button
          type="submit"
          data-testid="submit-transaction-button"
          variant="primary"
        >
          {transaction ? "💾 Save" : "➕ Add"}
        </Button>
      </Stack>
    </form>
  );
}
