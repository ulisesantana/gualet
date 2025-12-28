import {ReactElement} from "react";
import {render, RenderOptions} from "@testing-library/react";
import {ChakraProvider} from "../src/features/common/ui/components";

/**
 * Custom render function that wraps all components with ChakraProvider
 * Use this instead of RTL's render in all tests
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: ChakraProvider, ...options });
}

// Re-export everything from React Testing Library
export * from "@testing-library/react";

// Override the render method
export { customRender as render };

