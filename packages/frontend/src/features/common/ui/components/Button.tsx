import React from "react";
import type { ButtonProps as ChakraButtonProps } from "@chakra-ui/react";
import { Button as ChakraButton } from "@chakra-ui/react";

export interface ButtonProps
  extends Omit<ChakraButtonProps, "variant" | "colorPalette"> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  const colorPalette = {
    primary: "blue",
    secondary: "gray",
    danger: "red",
    ghost: "gray",
  }[variant];

  const chakraVariant = variant === "ghost" ? "ghost" : "solid";

  return (
    <ChakraButton
      colorPalette={colorPalette}
      variant={chakraVariant}
      {...props}
    >
      {children}
    </ChakraButton>
  );
}
