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
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}

export function Select({
  label,
  error,
  options,
  placeholder = "Select an option",
  value,
  defaultValue,
  onChange,
  ...props
}: SelectProps) {
  // Decide if this is a controlled or uncontrolled component
  // Controlled: has value + onChange
  // Uncontrolled: has defaultValue (or neither)
  const isControlled = value !== undefined && onChange !== undefined;

  return (
    <Field.Root invalid={!!error}>
      {/* @ts-expect-error - Chakra UI Field components accept children despite type definitions */}
      {label && <Field.Label>{label}</Field.Label>}
      <NativeSelectRoot>
        <NativeSelectField
          {...props}
          {...(isControlled
            ? { value, onChange }
            : { defaultValue: defaultValue || value })}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelectField>
      </NativeSelectRoot>
      {/* @ts-expect-error - Chakra UI Field components accept children despite type definitions */}
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  );
}
