import { Flex } from "@chakra-ui/react";
import React from "react";

export interface SegmentedControlProps {
  label?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  "data-testid"?: string;
}

export function SegmentedControl({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  "data-testid": dataTestId,
}: SegmentedControlProps) {
  return (
    <div style={{ width: "100%" }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: 500,
          }}
        >
          {label}
          {required && <span style={{ color: "red" }}> *</span>}
        </label>
      )}
      <Flex
        borderRadius="md"
        overflow="hidden"
        border="1px solid"
        borderColor="gray.200"
        bg="gray.50"
        data-testid={dataTestId}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <div
              key={option.value}
              data-selected={isSelected ? "true" : "false"}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                backgroundColor: isSelected
                  ? "var(--chakra-colors-blue-500, #3182ce)"
                  : "transparent",
                color: isSelected
                  ? "white"
                  : "var(--chakra-colors-gray-700, #2d3748)",
                fontWeight: isSelected ? 600 : 400,
                transition: "all 0.2s",
              }}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </div>
          );
        })}
      </Flex>
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
