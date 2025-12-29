import React, { useCallback, useEffect, useState } from "react";
import "./LastTransactionsView.css";
import { Loader } from "@common/ui/components";
import { TransactionConfig, UserPreferences } from "@domain/models";
import { Nullable, Transaction } from "@gualet/shared";
import {
  AddTransactionForm,
  GetLastTransactionsUseCase,
  GetTransactionConfigUseCase,
  GetTransactionUseCase,
  RemoveTransactionUseCase,
  SaveTransactionUseCase,
  setUseCases,
  TransactionList,
  useTransactionStore,
} from "@features/transactions";
import { GetUserPreferencesUseCase } from "@settings";

interface LastTransactionsViewProps {
  getLastTransactionsUseCase: GetLastTransactionsUseCase;
  getTransactionUseCase: GetTransactionUseCase;
  getTransactionConfigUseCase: GetTransactionConfigUseCase;
  getUserPreferencesUseCase: GetUserPreferencesUseCase;
  saveTransactionUseCase: SaveTransactionUseCase;
  removeTransactionUseCase: RemoveTransactionUseCase;
}

export function LastTransactionsView({
  getLastTransactionsUseCase,
  getTransactionUseCase,
  getTransactionConfigUseCase,
  getUserPreferencesUseCase,
  saveTransactionUseCase,
  removeTransactionUseCase,
}: LastTransactionsViewProps) {
  // Use transaction store
  const transactions = useTransactionStore((state) => state.transactions);
  const storeIsLoading = useTransactionStore((state) => state.isLoading);
  const fetchLastTransactions = useTransactionStore(
    (state) => state.fetchLastTransactions,
  );
  const saveTransaction = useTransactionStore((state) => state.saveTransaction);

  // Local state for config and preferences (not in store yet)
  const [configIsLoading, setConfigIsLoading] = useState(true);
  const [transactionConfig, setTransactionConfig] =
    useState<Nullable<TransactionConfig>>(null);
  const [preferences, setPreferences] =
    useState<Nullable<UserPreferences>>(null);

  // Inject use cases and load data on mount
  useEffect(() => {
    setUseCases(
      getLastTransactionsUseCase,
      getTransactionUseCase,
      saveTransactionUseCase,
      removeTransactionUseCase,
    );

    // Fetch transactions from store
    fetchLastTransactions(25);

    // Fetch config and preferences
    setConfigIsLoading(true);
    getTransactionConfigUseCase
      .exec()
      .then((config) => {
        console.log("Transaction config", config);
        setTransactionConfig(config);
        return getUserPreferencesUseCase.exec();
      })
      .then((userPreferences: UserPreferences | null) => {
        console.log("User preferences", userPreferences);
        if (userPreferences) {
          setPreferences(userPreferences);
        } else if (transactionConfig) {
          console.warn("No user preferences found, using defaults.");
          setPreferences({
            defaultPaymentMethod: transactionConfig.paymentMethods[0],
            language: "en",
          });
        } else {
          console.error("No user preferences or transaction config found.");
        }
      })
      .catch((error) => {
        console.error("Error getting transaction config or preferences");
        console.error(error);
      })
      .finally(() => {
        setConfigIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = useCallback(
    async (transaction: Transaction) => {
      await saveTransaction(transaction);
      // Store automatically updates transactions list with sorting
    },
    [saveTransaction],
  );

  const isLoading = storeIsLoading || configIsLoading;

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
