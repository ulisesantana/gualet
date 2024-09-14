import React, {useState} from 'react'
import './LoginForm.css'

export interface LoginProps {
  defaultSpreadsheetId?: string
  onSubmit(spreadsheetId: string): void
}

export function LoginForm({defaultSpreadsheetId, onSubmit}: LoginProps) {
  const [clipboardValue, setClipboardValue] = useState<string | null>(defaultSpreadsheetId || null);

  const onSubmitHandler = () => {
    const newSpreadsheetId = clipboardValue
    if (newSpreadsheetId) {
      onSubmit(newSpreadsheetId)
    } else {
      throw new Error('Spreadsheet ID is missing.')
    }
  }

  // Function to handle the clipboard read
  const handleGetClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setClipboardValue(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  return (
    <form className="login-form" onSubmit={onSubmitHandler}>
      <label>Spreadsheet ID: <p>{clipboardValue}</p></label>
      <label>
        <span>Paste your spreadsheet id</span>
        <button type="button" onClick={handleGetClipboard}>📋</button>
      </label>
      <footer>
        <button type="submit">LOGIN</button>
      </footer>
    </form>
  );
}

export function ClipboardLogin() {

}
