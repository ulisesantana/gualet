import { Category, TransactionOperation } from "@domain/models";
import React, { RefObject, useRef } from "react";

import { generateOnSubmitHandler } from "./submit-handler";

export interface CategoryFormParams {
  category?: Category | undefined;
  onSubmit: (category: Category) => Promise<void>;
}

export function CategoryForm({ category, onSubmit }: CategoryFormParams) {
  const formRef: RefObject<HTMLFormElement> = useRef(null);

  const onSubmitHandler = generateOnSubmitHandler({
    onSubmit,
    originalCategory: category,
  });

  return (
    <form className="transaction-form" onSubmit={onSubmitHandler} ref={formRef}>
      <label>
        Operation:
        <select required name="type" defaultValue={category?.type}>
          <option value={TransactionOperation.Outcome}>
            {TransactionOperation.Outcome}
          </option>
          <option value={TransactionOperation.Income}>
            {TransactionOperation.Income}
          </option>
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
