import React, {RefObject, useMemo, useRef} from 'react'
import {LocalStorageRepository} from "../../../repositories";
import {useSettingsContext} from "../../contexts";

export interface LoginViewProps {
  onLogin(): void
}

export function LoginView({onLogin}: LoginViewProps) {
  const ls = useMemo(() => new LocalStorageRepository('settings'), [])
  const {settings, setSettings} = useSettingsContext();
  const formRef: RefObject<HTMLFormElement> = useRef(null)
  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newSpreadsheetId = formRef.current?.spreadsheetId?.value
    console.debug('onSubmit handler',newSpreadsheetId)
    if (newSpreadsheetId) {
      ls.set('spreadsheetId', newSpreadsheetId)
      setSettings({...settings, spreadsheetId: newSpreadsheetId})
      onLogin()
    } else {
      throw new Error('Spreadsheet ID is missing.')
    }
  }
  return <form onSubmit={onSubmitHandler} ref={formRef}>
    <label htmlFor="spreadsheetId">
      Spreadsheet ID:
    </label>
    <input required id="spreadsheetId" name="spreadsheetId" type="text" defaultValue={settings.spreadsheetId}/>
    <button type="submit">LOGIN</button>
  </form>
}
