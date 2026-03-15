import { NewPaymentMethod, PaymentMethod } from "@gualet/shared";
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
    const form = event.currentTarget;

    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const icon = formData.get("icon") as string;
    const color = formData.get("color") as string;

    try {
      const paymentMethod = originalPaymentMethod
        ? new PaymentMethod({
            id: originalPaymentMethod.id,
            name: name.trim(),
            icon: icon?.trim() || "",
            color: color?.trim() || "",
          })
        : new NewPaymentMethod({
            name: name.trim(),
            icon: icon?.trim() || "",
            color: color?.trim() || "",
          });

      await onSubmit(paymentMethod);

      if (!originalPaymentMethod) {
        form?.reset();
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
