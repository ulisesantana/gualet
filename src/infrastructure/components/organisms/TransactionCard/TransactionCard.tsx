import {Transaction, TransactionOperation} from "domain/models";
import './TransactionCard.css'

export function TransactionCard({transaction}:{transaction: Transaction}) {
    return <div className="transaction-card">
        <div className="transaction-card-header">
            <h2 className="title">{transaction.category}</h2>
            <span className="subtitle">
                <h3>{transaction.month}</h3>
                <span className="separator"/>
                <h3> {transaction.day}</h3>
            </span>
        </div>
        <div className="transaction-card-body">{transaction.operation === TransactionOperation.Out ? '-' : ''} {transaction.amount} €</div>
        <div className="transaction-card-footer">{transaction.type}</div>
    </div>
}
