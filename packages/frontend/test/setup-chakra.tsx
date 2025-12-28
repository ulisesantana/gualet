import {afterEach} from "vitest";
import {cleanup, configure} from "@testing-library/react";
import React from "react";
import {ChakraProvider} from "../src/features/common/ui/components";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Create a custom wrapper component
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <ChakraProvider>{children}</ChakraProvider>;
};

// Configure testing library to use our wrapper by default
configure({ defaultHidden: true });

// Export the wrapper for tests that need it explicitly
export { AllTheProviders as wrapper };
