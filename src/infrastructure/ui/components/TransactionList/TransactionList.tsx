import React from "react";
import { Transaction } from "@domain/models";
import "./TransactionList.css";

import { TransactionCard } from "../TransactionCard";

export interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return transactions.length ? (
    <ul className="transaction-card-list">
      {React.Children.toArray(
        transactions.map((transaction) => (
          <li
            data-id={transaction.id.toString()}
            key={transaction.id.toString()}
          >
            <TransactionCard transaction={transaction} />
          </li>
        )),
      )}
    </ul>
  ) : (
    <span>There are no transactions</span>
  );
}
