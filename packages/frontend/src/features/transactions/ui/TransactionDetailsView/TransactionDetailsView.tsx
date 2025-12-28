import React, { useCallback, useEffect, useState } from "react";
import { Transition } from "react-transition-group";
import { useLocation, useRoute } from "wouter";
import "./TransactionDetailsView.css";
import { TransactionConfig } from "@domain/models";
import { routes } from "@common/infrastructure/routes";
import { useLoader } from "@common/infrastructure/hooks";
import { Id, Nullable } from "@gualet/shared";

import {
  GetLastTransactionsUseCase,
  GetTransactionConfigUseCase,
  GetTransactionUseCase,
  RemoveTransactionUseCase,
  SaveTransactionUseCase,
  setUseCases,
  useTransactionStore,
} from "../..";
import { EditTransactionForm } from "../TransactionForm";

interface TransactionDetailsViewProps {
  getLastTransactionsUseCase: GetLastTransactionsUseCase;
  getTransactionUseCase: GetTransactionUseCase;
  getTransactionConfigUseCase: GetTransactionConfigUseCase;
  saveTransactionUseCase: SaveTransactionUseCase;
  removeTransactionUseCase: RemoveTransactionUseCase;
}

export function TransactionDetailsView({
  getLastTransactionsUseCase,
  getTransactionUseCase,
  getTransactionConfigUseCase,
  saveTransactionUseCase,
  removeTransactionUseCase,
}: TransactionDetailsViewProps) {
  const [match, params] = useRoute<{ id: string }>(routes.transactions.details);
  const [, setLocation] = useLocation();
  const { isLoading, setIsLoading, Loader } = useLoader();

  // Use transaction store
  const currentTransaction = useTransactionStore(
    (state) => state.currentTransaction,
  );
  const fetchTransaction = useTransactionStore(
    (state) => state.fetchTransaction,
  );
  const saveTransaction = useTransactionStore((state) => state.saveTransaction);
  const removeTransaction = useTransactionStore(
    (state) => state.removeTransaction,
  );

  // Local state for config (not in store yet)
  const [transactionConfig, setTransactionConfig] =
    useState<Nullable<TransactionConfig>>(null);

  useEffect(() => {
    // Inject use cases
    setUseCases(
      getLastTransactionsUseCase,
      getTransactionUseCase,
      saveTransactionUseCase,
      removeTransactionUseCase,
    );

    if (params?.id) {
      // Fetch transaction from store
      fetchTransaction(new Id(params.id));

      // Fetch config
      getTransactionConfigUseCase
        .exec()
        .then(setTransactionConfig)
        .catch((error: Error) => {
          console.error("Error getting transaction config");
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const onSubmit = useCallback(
    async (transaction: typeof currentTransaction) => {
      if (!transaction) return;

      await saveTransaction(transaction);
      // Navigate using wouter to preserve store state (SPA navigation)
      setLocation("/");
    },
    [saveTransaction, setLocation],
  );

  const onRemove = useCallback(async () => {
    if (currentTransaction) {
      await removeTransaction(currentTransaction.id);
      setLocation("/");
    }
  }, [currentTransaction, removeTransaction, setLocation]);

  return (
    <Transition in={match} timeout={500}>
      <div className="transaction-details-view">
        {isLoading ? (
          <div className="loader-container">
            <Loader />
          </div>
        ) : (
          <div className="content">
            {currentTransaction && transactionConfig ? (
              <>
                <p className="description">{currentTransaction.toString()}</p>
                <EditTransactionForm
                  transaction={currentTransaction}
                  settings={transactionConfig}
                  onSubmit={onSubmit}
                />
                <button
                  className="remove"
                  onClick={onRemove}
                  data-testid="delete-transaction-button"
                >
                  🚮
                </button>
              </>
            ) : (
              <h2>Transaction not found.</h2>
            )}
          </div>
        )}
      </div>
    </Transition>
  );
}
