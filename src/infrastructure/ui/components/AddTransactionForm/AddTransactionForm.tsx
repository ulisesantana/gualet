import React, {RefObject, useEffect, useRef} from 'react'
import {Transaction, TransactionOperation} from "domain/models";
import {TransactionConfig} from "../../../../application/repositories";

export interface AddTransactionFormProps {
  settings: TransactionConfig
  onSubmit: (transaction: Transaction) => Promise<void>
}

function prependZero(x: any) {
  return String(x).padStart(2,'0')
}

export function AddTransactionForm({settings, onSubmit}: AddTransactionFormProps) {
  const today = new Date();
  const [day, setDay] = React.useState(prependZero(today.getDate()));
  const [month, setMonth] = React.useState(prependZero(today.getMonth() + 1));
  const [operation, setOperation] = React.useState<TransactionOperation>(TransactionOperation.Outcome);
  const [categories, setCategories] = React.useState<string[]>(settings.outcomeCategories);
  const formRef: RefObject<HTMLFormElement> = useRef(null)

  useEffect(() => {
    setCategories(Transaction.isOutcome(operation) ? settings.outcomeCategories : settings.incomeCategories)
    if (formRef?.current?.category) {
      formRef.current.category.value = ''
    }
  }, [operation, settings])


  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form);

    const transaction = new Transaction({
      amount: Number(formData.get('amount')),
      category: formData.get('category') as string,
      day: formData.get('day') as string,
      description: formData.get('description') as string,
      month: formData.get('month') as string,
      operation: formData.get('operation') as TransactionOperation,
      timestamp: new Date().toISOString(),
      type: formData.get('type') as string,
    });

    onSubmit(transaction).then(() => {
      form.reset()

      setDay(transaction.day)
      setMonth(transaction.month)
      setOperation(TransactionOperation.Outcome)
    })
  }

  return (
    <form className="add-transaction-form" onSubmit={onSubmitHandler} ref={formRef}>
      <label>
        Operation:
        <select
          required
          name="operation"
          value={operation}
          onChange={(e) => setOperation(e.target.value as TransactionOperation)}
        >
          <option value={TransactionOperation.Outcome}>{TransactionOperation.Outcome}</option>
          <option value={TransactionOperation.Income}>{TransactionOperation.Income}</option>
        </select>
      </label>

      <label>
        <span>Category:</span>
        <input list="category-options" name="category" required/>
        <datalist id="category-options">
          {categories.map((category, index) => (
            <option key={index} value={category}/>
          ))}
        </datalist>
      </label>

      <label>
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

      <label>
        <span>Day:</span>
        <select
          name="day"
          value={day}
          onChange={(e) => setDay(e.target.value as string)}
          required>
          {[...Array(31)].map((_, i) => {
            const value = prependZero(i + 1);
            return (
              <option key={i} value={value}>
                {value}
              </option>
            );
          })}
        </select>
      </label>

      <label>
        <span>Month:</span>
        <select
          name="month"
          value={month}
          onChange={(e) => setMonth(e.target.value as string)}
          required>
          {[...Array(12)].map((_, i) => {
            const value = String(i + 1).padStart(2, '0');
            return (
              <option key={i} value={value}>
                {value}
              </option>
            );
          })}
        </select>
      </label>

      <label>
        <span>Description:</span>
        <input type="text" name="description" placeholder="Enter description"/>
      </label>

      <label>
        <span>Type:</span>
        <select name="type" required>
          {settings.types.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
      </label>
      <footer>
        <button type="submit">+</button>
      </footer>
    </form>
  );
}
