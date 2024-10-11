import React from "react";
import { Transaction } from "@domain/models";
import "./TransactionList.css";
import { Link } from "wouter";
import { generatePath, routes } from "@infrastructure/ui/routes";

import { TransactionCard } from "../TransactionCard";

export interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <ul className="transaction-card-list">
      {React.Children.toArray(
        transactions.map((transaction) => (
          <Link
            to={generatePath(routes.transactions.details, {
              id: transaction.id.toString(),
            })}
          >
            <li
              data-id={transaction.id.toString()}
              key={transaction.id.toString()}
            >
              <TransactionCard transaction={transaction} />
            </li>
          </Link>
        )),
      )}
    </ul>
  );
}
