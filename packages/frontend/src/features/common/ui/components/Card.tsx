import React from "react";
import type { CardRootProps } from "@chakra-ui/react";
import { Card as ChakraCard } from "@chakra-ui/react";

export interface CardProps extends CardRootProps {
  children: React.ReactNode;
}

export function Card({ children, ...props }: CardProps) {
  return (
    <ChakraCard.Root {...props}>
      <ChakraCard.Body>{children}</ChakraCard.Body>
    </ChakraCard.Root>
  );
}

export interface CardWithHeaderProps extends CardRootProps {
  title?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function CardWithHeader({
  title,
  header,
  footer,
  children,
  ...props
}: CardWithHeaderProps) {
  return (
    <ChakraCard.Root {...props}>
      {(title || header) && (
        <ChakraCard.Header>
          {title ? <ChakraCard.Title>{title}</ChakraCard.Title> : header}
        </ChakraCard.Header>
      )}
      <ChakraCard.Body>{children}</ChakraCard.Body>
      {footer && <ChakraCard.Footer>{footer}</ChakraCard.Footer>}
    </ChakraCard.Root>
  );
}
