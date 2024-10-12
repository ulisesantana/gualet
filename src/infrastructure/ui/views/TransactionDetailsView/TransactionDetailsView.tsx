import React, { useEffect, useState } from "react";
import "./TransactionDetailsView.css";
import { EditTransactionForm, Loader } from "@components";
import { Id, Transaction } from "@domain/models";
import { GetTransaction, SaveTransaction } from "@application/cases";
import { routes } from "@infrastructure/ui/routes";
import { useRoute } from "wouter";
import { Transition } from "react-transition-group";
import { useTransactions } from "@infrastructure/ui/hooks";
import { RemoveTransactionUseCase } from "@application/cases/remove-transaction.use-case";
import transactionCardStories from "@infrastructure/ui/components/TransactionCard/TransactionCard.stories";

export function TransactionDetailsView() {
  const [match, params] = useRoute(routes.transactions.details);
  const { isReady, repository, transactionConfig } = useTransactions();
  const [isLoading, setIsLoading] = useState(true);
  const [transaction, setTransaction] = useState<Transaction | undefined>();

  useEffect(() => {
    if (repository) {
      new GetTransaction(repository)
        // @ts-ignore
        .exec(new Id(params?.id))
        .then(setTransaction)
        .catch((error) => {
          console.error("Error getting transaction");
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
    }
  };

  const onRemove = () => {
    if (repository && transaction) {
      new RemoveTransactionUseCase(repository).exec(transaction.id).then(() => {
        window.location.href = routes.root;
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
