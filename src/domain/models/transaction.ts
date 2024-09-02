import {v4 as uuidv4} from 'uuid';

export enum TransactionOperation {
  Income = 'Ingreso',
  Outcome = 'Gasto'
}

export interface TransactionParams {
  id?: string
  amount: number
  category: string
  day: string
  description: string
  month: string
  operation: TransactionOperation
  timestamp: string
  type: string
}

export class Transaction {
  readonly id: string;
  readonly amount: number
  readonly category: string
  readonly day: string
  readonly description: string
  readonly month: string
  readonly operation: TransactionOperation
  readonly timestamp: string
  readonly type: string

  constructor(input: TransactionParams) {
    this.id = input.id || uuidv4()
    this.amount = input.amount
    this.category = input.category
    this.day = input.day
    this.description = input.description
    this.month = input.month
    this.operation = input.operation
    this.timestamp = input.timestamp
    this.type = input.type
  }

  get amountFormatted(): string {
    return (this.isOutcome() ? '-' : '') + new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(this.amount)
  }

  static isOutcome(operation: TransactionOperation | string): boolean {
    return operation === TransactionOperation.Outcome
  }

  isOutcome() {
    return Transaction.isOutcome(this.operation)
  }

  toString() {
    return `Transaction for ${this.category} ${this.amountFormatted} (${this.id})`
  }
}
