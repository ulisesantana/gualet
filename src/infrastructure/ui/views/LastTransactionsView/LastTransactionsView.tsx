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
import { useRepositories } from "@infrastructure/ui/hooks";

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
      new GetLastTransactionsUseCase(repositories.transaction)
        .exec(25)
        .then((transactions) => {
          setTransactions(transactions);
          return new GetTransactionConfigUseCase(
            repositories.transaction,
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
      await new SaveTransactionUseCase(repositories.transaction).exec(
        transaction,
      );
      setTransactions(
        [transaction, ...transactions].sort((a, b) => {
          if (a.date.toString() < b.date.toString()) {
            return 1;
          }
          if (a.date.toString() > b.date.toString()) {
            return -1;
          }
          return 0;
        }),
      );
    }
  };

  return (
    <div
      className="last-transactions-view"
      data-testid="last-transactions-view"
    >
      {isLoading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <>
          <AddTransactionForm
            defaultPaymentMethod={preferences.defaultPaymentMethod.title}
            settings={transactionConfig}
            onSubmit={onSubmit}
          />
          <TransactionList transactions={transactions} />
        </>
      )}
    </div>
  );
}
