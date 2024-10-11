import React, { useEffect, useState } from "react";
import "./LastTransactionsView.css";
import { AddTransactionForm, Loader, TransactionList } from "@components";
import { Transaction } from "@domain/models";
import { GetLastTransactions, SaveTransaction } from "@application/cases";
import { useTransactions } from "@infrastructure/ui/hooks";

export function LastTransactionsView() {
  const { isReady, repository, transactionConfig } = useTransactions();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isReady && repository) {
      setIsLoading(true);
      new GetLastTransactions(repository)
        .exec()
        .then(setTransactions)
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
    if (repository) {
      await new SaveTransaction(repository).exec(transaction);
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
            settings={transactionConfig}
            onSubmit={onSubmit}
          />
          <TransactionList transactions={transactions} />
        </>
      )}
    </div>
  );
}
