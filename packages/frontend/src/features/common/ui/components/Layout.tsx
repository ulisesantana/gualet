import React from "react";
import {
  Alert,
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  Separator,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";

// Re-export common Chakra UI components
export { Box, Container, Stack, Flex, Text, Heading, Spinner, Badge };
export { Separator as Divider };

// Alert wrapper
export interface AlertProps {
  status?: "info" | "warning" | "success" | "error";
  title?: string;
  children: React.ReactNode;
}

export function AlertMessage({ status = "info", title, children }: AlertProps) {
  // Map status to appropriate ARIA role
  const role = status === "error" || status === "warning" ? "alert" : "status";

  return (
    <Alert.Root status={status} role={role}>
      <Alert.Indicator />
      <Alert.Content>
        {title && <Alert.Title>{title}</Alert.Title>}
        <Alert.Description>{children}</Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
}

// Loading Spinner
export function LoadingSpinner() {
  return (
    <Flex justify="center" align="center" minH="200px">
      <Spinner size="xl" color="blue.500" borderWidth="4px" />
    </Flex>
  );
}
