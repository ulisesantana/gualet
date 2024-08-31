import React, {useEffect, useState} from 'react'
import {Header, HeaderProps} from "infrastructure/components/templates";
import {TransactionList} from "../../templates/";
import {Transaction} from "../../../../domain/models";
import {GetLastTransactions} from "../../../../application/cases";
import {TransactionRepositoryImplementation} from "../../../repositories";
import {GoogleSheetsDataSource} from "../../../data-sources";
import {useSettingsContext} from "../../contexts";


export function LastTransactionsView({onLogout}: HeaderProps) {
  const {settings} = useSettingsContext();
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    new GetLastTransactions(new TransactionRepositoryImplementation(new GoogleSheetsDataSource(settings.spreadsheetId))).exec()
      .then(setTransactions)
      .catch((error) => {
        console.error('Error getting last transactions')
        console.error(error)
      }).finally(() => {
      setIsLoading(false)
    })
  }, [])

  return isLoading
    ? <span>Cargando</span>
    : <>
      <Header onLogout={onLogout}/>
      <main>
        <TransactionList transactions={transactions}/>
      </main>
    </>
}
