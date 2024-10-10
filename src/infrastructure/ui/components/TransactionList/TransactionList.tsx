import React from "react";
import { Transaction } from "@domain/models";

import "./TransactionList.css";
import { TransactionCard } from "../TransactionCard";

export interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <ul className="transaction-card-list">
      {React.Children.toArray(
        transactions.map((transaction) => (
          <li>
            <TransactionCard transaction={transaction} />
          </li>
        )),
      )}
    </ul>
  );
}
