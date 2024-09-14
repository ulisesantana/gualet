import React, {useEffect, useState} from 'react'
import {Transaction} from "../../../../domain/models";
import {AddTransaction, GetLastTransactions, GetTransactionConfig} from "../../../../application/cases";
import {TransactionRepositoryImplementation} from "../../../repositories";
import {GoogleSheetsDataSource} from "../../../data-sources";
import {useSettingsContext} from "../../contexts";
import {TransactionConfig, TransactionRepository} from "../../../../application/repositories";
import {AddTransactionForm, Header, HeaderProps, Loader, TransactionList} from "../../components";

import './LastTransactionsView.css'

export function LastTransactionsView({onLogout}: HeaderProps) {
  const {settings} = useSettingsContext();
  const [repository, setRepository] = useState<TransactionRepository>(new TransactionRepositoryImplementation(new GoogleSheetsDataSource(settings.spreadsheetId)))
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionConfig, setTransactionConfig] = useState<TransactionConfig>({
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

    new GetTransactionConfig(repository).exec().then(setTransactionConfig)
  }, [repository])

  useEffect(() => {
    setRepository(new TransactionRepositoryImplementation(new GoogleSheetsDataSource(settings.spreadsheetId)))
  }, [settings])

  const onSubmit = async (transaction: Transaction) => {
    await new AddTransaction(repository).exec(transaction)
    setTransactions([transaction, ...transactions])
  }

  return <div className="last-transactions-view">
    <Header onLogout={onLogout}/>
    <main>
      {isLoading
        ? (<div className="loader-container">
          <Loader/>
        </div>)
        : (<>
          <AddTransactionForm settings={transactionConfig} onSubmit={onSubmit}/>
          <TransactionList transactions={transactions}/>
        </>)
      }
    </main>
  </div>
}
