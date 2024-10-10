import { Transaction } from "@domain/models";
import "./TransactionCard.css";

export function TransactionCard({ transaction }: { transaction: Transaction }) {
  const date = `${transaction.date.getFormatedDate()} / ${transaction.date.getFormatedMonth()}`;
  return (
    <div className="transaction-card">
      <div className="transaction-card-date">{date}</div>
      <div className="transaction-card-body">{transaction.category.title}</div>
      <div
        className={
          "transaction-card-amount " +
          (transaction.isOutcome() ? "outcome" : "income")
        }
      >
        {transaction.amountFormatted}
      </div>
    </div>
  );
}
