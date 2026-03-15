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
      {/* @ts-expect-error - Chakra UI Field components accept children despite type definitions */}
      {label && <Field.Label>{label}</Field.Label>}
      <ChakraInput {...props} />
      {/* @ts-expect-error - Chakra UI Field components accept children despite type definitions */}
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
      {helperText && !error && (
        // @ts-expect-error - Chakra UI Field components accept children despite type definitions
        <Field.HelperText>{helperText}</Field.HelperText>
      )}
    </Field.Root>
  );
}
