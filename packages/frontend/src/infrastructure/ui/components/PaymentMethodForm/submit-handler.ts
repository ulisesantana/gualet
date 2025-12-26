import { PaymentMethod } from "@gualet/shared";
import { FormEvent } from "react";

interface GenerateOnSubmitHandlerParams {
  onSubmit: (paymentMethod: PaymentMethod) => Promise<void>;
  originalPaymentMethod?: PaymentMethod;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function generateOnSubmitHandler({
  onSubmit,
  originalPaymentMethod,
  onSuccess,
  onError,
}: GenerateOnSubmitHandlerParams) {
  return async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const icon = formData.get("icon") as string;
    const color = formData.get("color") as string;

    try {
      const paymentMethod = new PaymentMethod({
        id: originalPaymentMethod?.id,
        name: name.trim(),
        icon: icon?.trim() || "",
        color: color?.trim() || "",
      });

      await onSubmit(paymentMethod);

      if (!originalPaymentMethod) {
        event.currentTarget.reset();
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error submitting payment method:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      onError?.(new Error(errorMessage));
    }
  };
}
