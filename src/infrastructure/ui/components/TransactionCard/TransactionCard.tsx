import { Transaction } from "@domain/models";
import "./TransactionCard.css";
import { generatePath, routes } from "@infrastructure/ui/routes";
import { Link } from "wouter";

export function TransactionCard({ transaction }: { transaction: Transaction }) {
  const date = `${transaction.date.getFormatedDate()} / ${transaction.date.getFormatedMonth()}`;
  const detailsPath = generatePath(routes.transactions.details, {
    id: transaction.id.toString(),
  });
  return (
    <div className="transaction-card-container">
      <Link to={detailsPath}>
        <div className="transaction-card">
          <div className="transaction-card-date">{date}</div>
          <div className="transaction-card-body">
            {transaction.category.title}
          </div>
          <div
            className={
              "transaction-card-amount " +
              (transaction.isOutcome() ? "outcome" : "income")
            }
          >
            {transaction.amountFormatted}
          </div>
        </div>
      </Link>
    </div>
  );
}
