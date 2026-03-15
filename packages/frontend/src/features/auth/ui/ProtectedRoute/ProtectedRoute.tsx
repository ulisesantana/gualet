import { FC, ReactNode } from "react";
import { Route, RouteProps, useRoute } from "wouter";
import { Loader } from "@common/ui/components";

import { VerifySessionUseCase } from "../../application/cases";
import { useAuth } from "../AuthContext";

interface ProtectedRouteProps extends RouteProps {
  children: ReactNode;
  verifySessionUseCase: VerifySessionUseCase;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  path,
  // verifySessionUseCase is kept as prop for API compatibility but session is verified by SessionVerifier in App
  verifySessionUseCase: _verifySessionUseCase,
}) => {
  const [match] = useRoute(path as string);
  const { isAuthenticated } = useAuth();

  // If this route doesn't match, don't render anything
  if (!match) {
    return null;
  }

  // Still verifying (null = not yet determined) - show loader
  if (isAuthenticated === null) {
    return <Loader data-testid="loader" />;
  }

  // Not authenticated - return null (SessionVerifier handles the redirect)
  if (!isAuthenticated) {
    return null;
  }

  return <Route path={path} children={children} />;
};
