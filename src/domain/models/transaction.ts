export enum TransactionOperation {
  In = 'Ingreso',
  Out = 'Gasto'
}

export interface Transaction {
  amount: string
  category: string
  day: string
  description: string
  month: string
  operation: TransactionOperation
  timestamp: string
  type: string
}
