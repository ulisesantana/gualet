import { FC, ReactNode, useEffect, useState } from "react";
import { Route, RouteProps, useLocation } from "wouter";
import { Loader } from "@common/ui/components";

import { VerifySessionUseCase } from "../../application/cases";

interface ProtectedRouteProps extends RouteProps {
  children: ReactNode;
  verifySessionUseCase: VerifySessionUseCase;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  path,
  verifySessionUseCase,
}) => {
  const [_, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = () => {
      verifySessionUseCase
        .exec()
        .then((result) => {
          setIsAuthenticated(result.success);
        })
        .catch(() => {
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    if (!isAuthenticated) {
      verifyAuth();
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return <Loader data-testid="loader" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Route path={path} children={children} />;
};
