import React, { RefObject, useRef, useState } from "react";
import { PaymentMethod } from "@gualet/shared";
import { AlertMessage, Button, Input, Stack } from "@common/ui/components";

import { generateOnSubmitHandler } from "./submit-handler";

export interface PaymentMethodFormParams {
  paymentMethod?: PaymentMethod | undefined;
  onSubmit: (paymentMethod: PaymentMethod) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function PaymentMethodForm({
  paymentMethod,
  onSubmit,
  onSuccess,
  onError,
}: PaymentMethodFormParams) {
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
    originalPaymentMethod: paymentMethod,
    onSuccess: handleSuccess,
    onError: handleError,
  });
  return (
    <form
      onSubmit={onSubmitHandler}
      ref={formRef}
      data-testid="payment-method-form"
      autoComplete="off"
    >
      <Stack gap={4}>
        {errorMessage && (
          <AlertMessage status="error" data-testid="error-message">
            {errorMessage}
          </AlertMessage>
        )}

        <Input
          label="Name"
          type="text"
          name="name"
          required
          placeholder="Enter payment method name"
          defaultValue={paymentMethod?.name}
          data-testid="payment-method-name-input"
        />

        <Input
          label="Icon"
          type="text"
          name="icon"
          defaultValue={paymentMethod?.icon}
          placeholder="Add an emoji as an icon (optional)"
          data-testid="payment-method-icon-input"
        />

        <Input
          label="Color"
          type="text"
          name="color"
          defaultValue={paymentMethod?.color}
          placeholder="#4287f5 (optional)"
          data-testid="payment-method-color-input"
        />

        <Button
          type="submit"
          variant="primary"
          data-testid="payment-method-submit-button"
        >
          {paymentMethod ? "💾 Save" : "➕ Add"}
        </Button>
      </Stack>
    </form>
  );
}
