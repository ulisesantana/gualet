import {Transaction} from "domain/models";
import './TransactionCard.css'

export function TransactionCard({transaction}: { transaction: Transaction }) {
  return <div className="transaction-card">
    <div className="transaction-card-date">
     {transaction.day} / {transaction.month}
    </div>
    <div className="transaction-card-body">
      {transaction.category}
    </div>
    <div className={'transaction-card-amount ' + (transaction.isOutcome() ? 'outcome' : 'income')}>
      {transaction.amountFormatted}
    </div>
  </div>
}
