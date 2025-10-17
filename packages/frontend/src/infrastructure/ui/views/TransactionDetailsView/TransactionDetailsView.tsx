import React, { useEffect, useState } from "react";
import "./TransactionDetailsView.css";
import { EditTransactionForm } from "@components";
import { TransactionConfig } from "@domain/models";
import { routes } from "@infrastructure/ui/routes";
import { useRoute } from "wouter";
import { Transition } from "react-transition-group";
import { useLoader } from "@infrastructure/ui/hooks";
import {
  GetTransactionConfigUseCase,
  GetTransactionUseCase,
  RemoveTransactionUseCase,
  SaveTransactionUseCase,
} from "@application/cases";
import { Id, Nullable, Transaction } from "@gualet/core";

interface TransactionDetailsViewProps {
  getTransactionUseCase: GetTransactionUseCase;
  getTransactionConfigUseCase: GetTransactionConfigUseCase;
  saveTransactionUseCase: SaveTransactionUseCase;
  removeTransactionUseCase: RemoveTransactionUseCase;
}

export function TransactionDetailsView({
  getTransactionUseCase,
  getTransactionConfigUseCase,
  saveTransactionUseCase,
  removeTransactionUseCase,
}: TransactionDetailsViewProps) {
  const [match, params] = useRoute(routes.transactions.details);
  const { isLoading, setIsLoading, Loader } = useLoader();
  const [transaction, setTransaction] = useState<Transaction | undefined>();
  const [transactionConfig, setTransactionConfig] =
    useState<Nullable<TransactionConfig>>(null);

  useEffect(() => {
    getTransactionUseCase
      // @ts-ignore
      .exec(new Id(params?.id))
      .then((transaction) => {
        setTransaction(transaction);
        return getTransactionConfigUseCase.exec();
      })
      .then(setTransactionConfig)
      .catch((error) => {
        console.error("Error getting data");
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const onSubmit = async (transaction: Transaction) => {
    await saveTransactionUseCase.exec(transaction);
  };

  const onRemove = () => {
    if (transaction) {
      removeTransactionUseCase.exec(transaction.id).then(() => {
        window.location.href = "/";
      });
    }
  };

  return (
    <Transition in={match} timeout={500}>
      <div className="transaction-details-view">
        {isLoading ? (
          <div className="loader-container">
            <Loader />
          </div>
        ) : (
          <div className="content">
            {transaction && transactionConfig ? (
              <>
                <p className="description">{transaction.toString()}</p>
                <EditTransactionForm
                  transaction={transaction}
                  settings={transactionConfig}
                  onSubmit={onSubmit}
                />
                <button className="remove" onClick={onRemove}>
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
