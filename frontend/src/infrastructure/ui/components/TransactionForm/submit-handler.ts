import {
  Category,
  Day,
  PaymentMethod,
  Transaction,
  TransactionOperation,
} from "@domain/models";
import React from "react";

interface OnSubmitHandlerGeneratorParams {
  originalTransaction?: Transaction;
  categories: Category[];
  paymentMethods: PaymentMethod[];
  onSubmit: (transaction: Transaction) => Promise<void>;
  afterSubmit?: (transaction: Transaction) => void;
}

export function generateOnSubmitHandler({
  afterSubmit,
  categories,
  paymentMethods,
  onSubmit,
  originalTransaction,
}: OnSubmitHandlerGeneratorParams) {
  function findCategory(categoryTitle: string) {
    const category = categories.find((c) => c.title === categoryTitle);
    if (!category) {
      throw new Error(`Category ${categoryTitle} does not exist.`);
    }
    return category;
  }

  function findPaymentMethod(paymentMethodTitle: string) {
    const paymentMethod = paymentMethods.find(
      (p) => p.title === paymentMethodTitle,
    );
    if (!paymentMethod) {
      throw new Error(`Payment method ${paymentMethodTitle} does not exist.`);
    }
    return paymentMethod;
  }

  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const categoryId = formData.get("category") as string;
    const category =
      originalTransaction && !categoryId
        ? originalTransaction.category
        : findCategory(categoryId);
    const paymentMethod = findPaymentMethod(
      formData.get("payment-method") as string,
    );

    const transaction = new Transaction({
      id: originalTransaction?.id,
      amount: Number(formData.get("amount")),
      category,
      date: new Day(formData.get("date") as string),
      description: formData.get("description") as string,
      operation: formData.get("operation") as TransactionOperation,
      paymentMethod,
    });

    onSubmit(transaction).then(() => {
      if (!originalTransaction && afterSubmit) {
        form.reset();
        afterSubmit(transaction);
      }
    });
  };
}
