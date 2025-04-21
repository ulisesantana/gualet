import { FC, ReactNode, useEffect, useState } from "react";
import { VerifySessionUseCase } from "@application/cases";
import { Route, RouteProps, useLocation } from "wouter";
import { Loader } from "@components";

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
        .then(({ success }) => {
          setIsAuthenticated(success);
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

  return <Route path={path}>{children}</Route>;
};
