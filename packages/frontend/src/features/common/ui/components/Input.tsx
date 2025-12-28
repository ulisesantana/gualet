import React from "react";
import type { InputProps as ChakraInputProps } from "@chakra-ui/react";
import { Field, Input as ChakraInput } from "@chakra-ui/react";

export interface InputProps extends ChakraInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, ...props }: InputProps) {
  return (
    <Field.Root invalid={!!error}>
      {label && (
        <Field.Label asChild>
          <span>{label}</span>
        </Field.Label>
      )}
      <ChakraInput {...props} />
      {error && (
        <Field.ErrorText asChild>
          <span>{error}</span>
        </Field.ErrorText>
      )}
      {helperText && !error && (
        <Field.HelperText asChild>
          <span>{helperText}</span>
        </Field.HelperText>
      )}
    </Field.Root>
  );
}
