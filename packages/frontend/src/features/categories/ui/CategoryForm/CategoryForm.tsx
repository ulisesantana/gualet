import React, { RefObject, useRef, useState } from "react";
import { Category, NewCategory, OperationType } from "@gualet/shared";

import { generateOnSubmitHandler } from "./submit-handler";

export interface CategoryFormParams {
  category?: Category | undefined;
  onSubmit: (category: Category | NewCategory) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function CategoryForm({
  category,
  onSubmit,
  onSuccess,
  onError,
}: CategoryFormParams) {
  const formRef: RefObject<HTMLFormElement> = useRef(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleError = (error: Error) => {
    setErrorMessage(error.message);
    onError?.(error);
  };

  const handleSuccess = () => {
    setErrorMessage(null);
    onSuccess?.();
  };

  const onSubmitHandler = generateOnSubmitHandler({
    onSubmit,
    originalCategory: category,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  return (
    <form className="transaction-form" onSubmit={onSubmitHandler} ref={formRef}>
      {errorMessage && (
        <div className="error-message" data-testid="error-message">
          {errorMessage}
        </div>
      )}

      <label>
        Operation:
        <select required name="type" defaultValue={category?.type}>
          <option value={OperationType.Outcome}>{OperationType.Outcome}</option>
          <option value={OperationType.Income}>{OperationType.Income}</option>
        </select>
      </label>

      <label>
        <span>Name:</span>
        <input
          type="text"
          name="name"
          required
          placeholder="Enter category name"
          defaultValue={category?.name}
        />
      </label>

      <label>
        <span>Icon:</span>
        <input
          type="text"
          name="icon"
          defaultValue={category?.icon}
          placeholder="Add an emoji as an icon"
        />
      </label>
      <footer>
        <button type="submit">{category ? "💾" : "➕"}</button>
      </footer>
    </form>
  );
}
