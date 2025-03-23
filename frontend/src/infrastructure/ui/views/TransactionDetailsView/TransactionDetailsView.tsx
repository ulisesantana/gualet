import React, { useEffect, useState } from "react";
import "./TransactionDetailsView.css";
import { EditTransactionForm, Loader } from "@components";
import {
  defaultTransactionConfig,
  Id,
  Transaction,
  TransactionConfig,
} from "@domain/models";
import { routes } from "@infrastructure/ui/routes";
import { useRoute } from "wouter";
import { Transition } from "react-transition-group";
import { useRepositories } from "@infrastructure/ui/hooks";
import {
  GetTransactionConfigUseCase,
  GetTransactionUseCase,
  RemoveTransactionUseCase,
  SaveTransactionUseCase,
} from "@application/cases";

export function TransactionDetailsView() {
  const [match, params] = useRoute(routes.transactions.details);
  const { isReady, repositories, isLoading, setIsLoading } = useRepositories();
  const [transaction, setTransaction] = useState<Transaction | undefined>();
  const [transactionConfig, setTransactionConfig] = useState<TransactionConfig>(
    defaultTransactionConfig,
  );

  useEffect(() => {
    if (repositories) {
      new GetTransactionUseCase(repositories.transaction)
        // @ts-ignore
        .exec(new Id(params?.id))
        .then((transaction) => {
          setTransaction(transaction);
          return new GetTransactionConfigUseCase(
            repositories.transaction,
          ).exec();
        })
        .then(setTransactionConfig)
        .catch((error) => {
          console.error("Error getting data");
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
    }
  };

  const onRemove = () => {
    if (repositories && transaction) {
      new RemoveTransactionUseCase(repositories.transaction)
        .exec(transaction.id)
        .then(() => {
          // @ts-ignore
          window.location.href = import.meta.env.BASE_URL;
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
            {transaction ? (
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
