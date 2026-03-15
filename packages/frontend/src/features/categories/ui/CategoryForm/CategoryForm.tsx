import React, { RefObject, useRef, useState } from "react";
import { Category, NewCategory, OperationType } from "@gualet/shared";
import {
  AlertMessage,
  Button,
  Input,
  Select,
  Stack,
} from "@common/ui/components";

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
    <form onSubmit={onSubmitHandler} ref={formRef}>
      <Stack gap={4}>
        {errorMessage && (
          <AlertMessage status="error" data-testid="error-message">
            {errorMessage}
          </AlertMessage>
        )}

        <Select
          label="Operation"
          name="type"
          required
          defaultValue={category?.type}
          options={[
            { value: OperationType.Outcome, label: OperationType.Outcome },
            { value: OperationType.Income, label: OperationType.Income },
          ]}
        />

        <Input
          label="Name"
          type="text"
          name="name"
          required
          placeholder="Enter category name"
          defaultValue={category?.name}
        />

        <Input
          label="Icon"
          type="text"
          name="icon"
          defaultValue={category?.icon}
          placeholder="Add an emoji as an icon"
        />

        <Button type="submit" variant="primary">
          {category ? "💾 Save" : "➕ Add"}
        </Button>
      </Stack>
    </form>
  );
}
