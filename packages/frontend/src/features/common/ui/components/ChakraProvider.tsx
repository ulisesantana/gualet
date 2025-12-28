import React from "react";
import {
  ChakraProvider as ChakraUIProvider,
  defaultSystem,
} from "@chakra-ui/react";

interface ChakraProviderProps {
  children: React.ReactNode;
}

export function ChakraProvider({ children }: ChakraProviderProps) {
  return <ChakraUIProvider value={defaultSystem}>{children}</ChakraUIProvider>;
}
