import React, { useEffect, useState } from "react";
import "./LastTransactionsView.css";
import { AddTransactionForm, Loader, TransactionList } from "@components";
import { TransactionConfig, UserPreferences } from "@domain/models";
import {
  GetLastTransactionsUseCase,
  GetTransactionConfigUseCase,
  GetUserPreferencesUseCase,
  SaveTransactionUseCase,
} from "@application/cases";
import { Nullable, Transaction } from "@gualet/shared";

function sortByDay(transactions: Transaction[]) {
  return Array.from(transactions).sort((a, b) => {
    if (a.date.toString() < b.date.toString()) {
      return 1;
    }
    if (a.date.toString() > b.date.toString()) {
      return -1;
    }
    return 0;
  });
}

interface LastTransactionsViewProps {
  getLastTransactionsUseCase: GetLastTransactionsUseCase;
  getTransactionConfigUseCase: GetTransactionConfigUseCase;
  getUserPreferencesUseCase: GetUserPreferencesUseCase;
  saveTransactionUseCase: SaveTransactionUseCase;
}

export function LastTransactionsView({
  getLastTransactionsUseCase,
  getTransactionConfigUseCase,
  getUserPreferencesUseCase,
  saveTransactionUseCase,
}: LastTransactionsViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [transactionConfig, setTransactionConfig] =
    useState<Nullable<TransactionConfig>>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [preferences, setPreferences] =
    useState<Nullable<UserPreferences>>(null);

  useEffect(() => {
    setIsLoading(true);
    getLastTransactionsUseCase
      .exec(25)
      .then((transactions) => {
        setTransactions(sortByDay(transactions));
        return getTransactionConfigUseCase.exec();
      })
      .then((config) => {
        console.log("Transaction config", config);
        setTransactionConfig(config);
      })
      .catch((error) => {
        console.error("Error getting last transactions");
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (transactionConfig && !preferences) {
      getUserPreferencesUseCase.exec().then((userPreferences) => {
        console.log("User preferences", userPreferences);
        if (userPreferences) {
          setPreferences(userPreferences);
        } else if (transactionConfig) {
          console.warn("No user preferences found, using defaults.");
          setPreferences(() => ({
            defaultPaymentMethod: transactionConfig.paymentMethods[0],
          }));
        } else {
          console.error("No user preferences or transaction config found.");
        }
      });
    }
  }, [transactionConfig]);

  const onSubmit = async (transaction: Transaction) => {
    await saveTransactionUseCase.exec(transaction);
    setTransactions(sortByDay([transaction, ...transactions]));
  };

  return (
    <div
      className="last-transactions-view"
      data-testid="last-transactions-view"
    >
      {isLoading || !preferences || !transactionConfig ? (
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
