import {ReactElement} from "react";
import {render, RenderOptions} from "@testing-library/react";
import {ChakraProvider} from "@features/common";
import {AuthProvider} from "@auth/ui";

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ChakraProvider>
  );
}

/**
 * Custom render function that wraps all components with ChakraProvider and AuthProvider
 * Use this instead of RTL's render in all tests
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything from React Testing Library
export * from "@testing-library/react";

// Override the render method
export { customRender as render };

