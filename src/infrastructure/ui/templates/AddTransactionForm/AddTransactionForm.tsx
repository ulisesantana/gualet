import React, {RefObject, useEffect, useRef} from 'react'
import {Transaction, TransactionOperation} from "domain/models";
import './AddTransactionForm.css'
import {TransactionSettings} from "../../../../application/repositories";

export interface AddTransactionFormProps {
  settings: TransactionSettings
  onSubmit: (transaction: Transaction) => Promise<void>
}

export function AddTransactionForm({settings, onSubmit}: AddTransactionFormProps) {
  const [operation, setOperation] = React.useState<TransactionOperation>(TransactionOperation.Outcome);
  const [categories, setCategories] = React.useState<string[]>(settings.outcomeCategories);
  const formRef: RefObject<HTMLFormElement> = useRef(null)

  useEffect(() => {
     setCategories(Transaction.isOutcome(operation) ? settings.outcomeCategories : settings.incomeCategories)
    formRef.current!.category.value = ''
  }, [operation, settings])

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(new Transaction({
      amount: Number(formRef.current?.amount?.value),
      category: formRef.current?.category?.value,
      day: formRef.current?.day?.value,
      description: formRef.current?.description?.value,
      month: formRef.current?.month?.value,
      operation: operation,
      timestamp: new Date().toISOString(),
      type: formRef.current?.type?.value
    })).then(() => {
      formRef.current!.category.value = ''
      formRef.current!.amount.value = ''
      formRef.current!.description.value = ''
      setOperation(TransactionOperation.Outcome)
    })
  }
  const today = new Date();
  const defaultDay = String(today.getDate()).padStart(2, '0'); // Default to today's day
  const defaultMonth = String(today.getMonth() + 1).padStart(2, '0'); // Default to current month

  return (
    <form className="add-transaction-form" onSubmit={onSubmitHandler} ref={formRef}>

        <label className="field">
          Operation:
          <select name="operation" value={operation}
                  onChange={(e) => setOperation(e.target.value as TransactionOperation)}>
            <option value={TransactionOperation.Outcome}>{TransactionOperation.Outcome}</option>
            <option value={TransactionOperation.Income}>{TransactionOperation.Income}</option>
          </select>
        </label>

        <label className="field">
          <span>Category:</span>
          <input list="category-options" name="category" required/>
          <datalist id="category-options">
            {categories.map((category, index) => (
              <option key={index} value={category}/>
            ))}
          </datalist>
        </label>

        <label className="field">
          <span>Amount:</span>
          <input
            type="number"
            name="amount"
            step="0.01"
            required
            inputMode="decimal"
            placeholder="Enter amount"
          />
        </label>

        <label className="field">
          <span>Day:</span>
          <select name="day" defaultValue={defaultDay} required>
            {[...Array(31)].map((_, i) => (
              <option key={i} value={String(i + 1).padStart(2, '0')}>
                {String(i + 1).padStart(2, '0')}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Month:</span>
          <select name="month" defaultValue={defaultMonth} required>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={String(i + 1).padStart(2, '0')}>
                {String(i + 1).padStart(2, '0')}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Description:</span>
          <input type="text" name="description" placeholder="Enter description"/>
        </label>

        <label className="field">
          <span>Type:</span>
          <select name="type" required>
            {settings.types.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </label>
      <div className="form-footer">
        <button type="submit">ADD</button>
      </div>
    </form>
  );
}
