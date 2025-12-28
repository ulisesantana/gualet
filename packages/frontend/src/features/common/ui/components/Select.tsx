import React from "react";
import { Field, NativeSelectField, NativeSelectRoot } from "@chakra-ui/react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}

export function Select({
  label,
  error,
  options,
  placeholder = "Select an option",
  ...props
}: SelectProps) {
  return (
    <Field.Root invalid={!!error}>
      {label && (
        <Field.Label asChild>
          <span>{label}</span>
        </Field.Label>
      )}
      <NativeSelectRoot>
        <NativeSelectField placeholder={placeholder} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelectField>
      </NativeSelectRoot>
      {error && (
        <Field.ErrorText asChild>
          <span>{error}</span>
        </Field.ErrorText>
      )}
    </Field.Root>
  );
}
