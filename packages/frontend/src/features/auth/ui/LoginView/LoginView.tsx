import React, { useState } from "react";
import { routes } from "@common/infrastructure/routes";
import { Link, useLocation } from "wouter";
import {
  AlertMessage,
  Box,
  Button,
  Container,
  Heading,
  Input,
  Stack,
  Text,
} from "@common/ui/components";

import { LoginUseCase } from "../../application/cases";

export interface LoginFormProps {
  loginUseCase: LoginUseCase;
}

export function LoginForm({ loginUseCase }: LoginFormProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [_location, setLocation] = useLocation();
  const callback = (error?: string) => {
    if (error) {
      setErrorMessage(error);
    } else {
      setErrorMessage("");
      setLocation(routes.home);
    }
  };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (email && password) {
      loginUseCase
        .exec({ email, password })
        .then((result) => {
          if (result.success) {
            callback();
          } else {
            callback(result.error || "Login failed");
          }
        })
        .catch((error) => {
          // Extract error message from Error object
          const message = error?.message || "An unexpected error occurred";
          callback(message);
        });
    }
  };

  return (
    <Container maxW="md" py={8}>
      <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
        <Heading marginBottom={6} textAlign="center">
          Login
        </Heading>
        <form onSubmit={onSubmitHandler}>
          <Stack gap={4}>
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              required
            />
            <Button
              type="submit"
              name="login"
              data-testid="submit-login"
              width="full"
              mt={4}
            >
              LOGIN
            </Button>
          </Stack>
        </form>
        {errorMessage && (
          <Box mt={4}>
            <AlertMessage status="error">{errorMessage}</AlertMessage>
          </Box>
        )}
        <Text mt={6} textAlign="center">
          Don't have an account?{" "}
          <Link to={routes.register}>
            <Text
              as="span"
              color="brand.500"
              fontWeight="bold"
              cursor="pointer"
            >
              Register!
            </Text>
          </Link>
        </Text>
      </Box>
    </Container>
  );
}

export function LoginView(props: LoginFormProps) {
  return <LoginForm {...props} />;
}
