import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Router } from "wouter";

import { AuthContext } from "../AuthContext";
import { VerifySessionUseCase } from "../../application/cases";
import { ProtectedRoute } from "./ProtectedRoute";

const verifySessionUseCase = {
  exec: fn().mockResolvedValue({ success: true }),
} as unknown as VerifySessionUseCase;

const meta = {
  title: "Auth/ProtectedRoute",
  component: ProtectedRoute,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ProtectedRoute>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Route renders children when the user is authenticated. */
export const Authenticated: Story = {
  decorators: [
    (Story) => (
      <Router hook={() => ["/protected", () => {}] as any}>
        <AuthContext.Provider
          value={{
            isAuthenticated: true,
            setIsAuthenticated: fn(),
            logout: fn(),
          }}
        >
          <Story />
        </AuthContext.Provider>
      </Router>
    ),
  ],
  args: {
    path: "/protected",
    verifySessionUseCase,
    children: <div>Protected content</div>,
  },
};

/** Route shows a loader while session verification is in progress (null state). */
export const VerifyingSession: Story = {
  decorators: [
    (Story) => (
      <Router hook={() => ["/protected", () => {}] as any}>
        <AuthContext.Provider
          value={{
            isAuthenticated: null,
            setIsAuthenticated: fn(),
            logout: fn(),
          }}
        >
          <Story />
        </AuthContext.Provider>
      </Router>
    ),
  ],
  args: {
    path: "/protected",
    verifySessionUseCase,
    children: <div>Protected content</div>,
  },
};

/** Route renders nothing when the user is not authenticated. */
export const Unauthenticated: Story = {
  decorators: [
    (Story) => (
      <Router hook={() => ["/protected", () => {}] as any}>
        <AuthContext.Provider
          value={{
            isAuthenticated: false,
            setIsAuthenticated: fn(),
            logout: fn(),
          }}
        >
          <Story />
        </AuthContext.Provider>
      </Router>
    ),
  ],
  args: {
    path: "/protected",
    verifySessionUseCase,
    children: <div>Protected content</div>,
  },
};
