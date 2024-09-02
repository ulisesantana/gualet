import React, {useEffect, useState} from 'react'
import {Header, HeaderProps} from "infrastructure/ui/templates";
import {TransactionList} from "../../templates";
import {Transaction} from "../../../../domain/models";
import {AddTransaction, GetLastTransactions, GetTransactionSettings} from "../../../../application/cases";
import {TransactionRepositoryImplementation} from "../../../repositories";
import {GoogleSheetsDataSource} from "../../../data-sources";
import {useSettingsContext} from "../../contexts";
import {AddTransactionForm} from "../../templates/AddTransactionForm";
import {TransactionRepository, TransactionSettings} from "../../../../application/repositories";


export function LastTransactionsView({onLogout}: HeaderProps) {
  const {settings} = useSettingsContext();
  const [repository, setRepository] = useState<TransactionRepository>(new TransactionRepositoryImplementation(new GoogleSheetsDataSource(settings.spreadsheetId)))
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionSettings, setTransactionSettings] = useState<TransactionSettings>({
    incomeCategories: [],
    outcomeCategories: [],
    types: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    new GetLastTransactions(repository).exec()
      .then(setTransactions)
      .catch((error) => {
        console.error('Error getting last transactions')
        console.error(error)
      }).finally(() => {
      setIsLoading(false)
    })

    new GetTransactionSettings(repository).exec().then(setTransactionSettings)
  }, [repository])

  useEffect(() => {
    setRepository(new TransactionRepositoryImplementation(new GoogleSheetsDataSource(settings.spreadsheetId)))
  }, [settings])

  const onSubmit = async (transaction: Transaction) => {
    await new AddTransaction(repository).exec(transaction)
    setTransactions([transaction, ...transactions])
  }

  return isLoading
    ? <span>Cargando</span>
    : <>
      <Header onLogout={onLogout}/>
      <main>
        <AddTransactionForm settings={transactionSettings} onSubmit={onSubmit} />
        <TransactionList transactions={transactions}/>
      </main>
    </>
}
