import React, { useEffect, useState } from "react";
import "./LastTransactionsView.css";
import { AddTransactionForm, Loader, TransactionList } from "@components";
import {
  defaultTransactionConfig,
  defaultUserPreferences,
  Transaction,
  TransactionConfig,
  UserPreferences,
} from "@domain/models";
import {
  GetLastTransactionsUseCase,
  GetTransactionConfigUseCase,
  GetUserPreferencesUseCase,
  SaveTransactionUseCase,
} from "@application/cases";
import { useRepositories, useTransactions } from "@infrastructure/ui/hooks";

export function LastTransactionsView() {
  const { isReady, repositories } = useRepositories();
  const [transactionConfig, setTransactionConfig] = useState<TransactionConfig>(
    defaultTransactionConfig,
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(
    defaultUserPreferences,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isReady && repositories) {
      setIsLoading(true);
      new GetLastTransactionsUseCase(repositories.transactions)
        .exec(25)
        .then((transactions) => {
          setTransactions(transactions);
          return new GetTransactionConfigUseCase(
            repositories.transactions,
          ).exec();
        })
        .then((config) => {
          setTransactionConfig(config);
          return new GetUserPreferencesUseCase(
            repositories.userPreferences,
          ).exec();
        })
        .then(setPreferences)
        .catch((error) => {
          console.error("Error getting last transactions");
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isReady]);

  const onSubmit = async (transaction: Transaction) => {
    if (repositories) {
      await new SaveTransactionUseCase(repositories.transactions).exec(
        transaction,
      );
      setTransactions([transaction, ...transactions]);
    }
  };

  return (
    <div className="last-transactions-view">
      {isLoading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <>
          <AddTransactionForm
            defaultPaymentMethod={preferences.defaultPaymentMethod.id.toString()}
            settings={transactionConfig}
            onSubmit={onSubmit}
          />
          <TransactionList transactions={transactions} />
        </>
      )}
    </div>
  );
}
