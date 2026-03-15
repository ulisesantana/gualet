import React, { useState } from "react";
import {
  AlertMessage,
  Box,
  Button,
  Container,
  Heading,
  Input,
  Stack,
} from "@common/ui/components";
import { useLocation } from "wouter";

import { SignUpUseCase } from "../../application/cases";
import { useAuth } from "../AuthContext";

export interface RegisterFormProps {
  signUpUseCase: SignUpUseCase;
}

export function RegisterForm({ signUpUseCase }: RegisterFormProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [, setLocation] = useLocation();
  const { setIsAuthenticated } = useAuth();

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (email && password) {
      signUpUseCase
        .exec({ email, password })
        .then((result) => {
          if (result.success) {
            // Backend auto-logs the user in after registration
            setIsAuthenticated(true);
            setLocation("/");
          } else {
            console.error("Registration error:", result.error);
            setErrorMessage(result.error || "Registration failed");
          }
        })
        .catch((error) => {
          const message = error?.message || "An unexpected error occurred";
          setErrorMessage(message);
        });
    }
  };

  return (
    <Container maxW="md" py={8}>
      <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
        <Heading marginBottom={6} textAlign="center">
          Register
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
              helperText="Password must contain at least 6 characters"
            />
            <Button
              type="submit"
              name="sign-up"
              data-testid="submit-sign-up"
              width="full"
              mt={4}
            >
              REGISTER
            </Button>
          </Stack>
        </form>
        {errorMessage && (
          <Box mt={4}>
            <AlertMessage status="error">{errorMessage}</AlertMessage>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export function RegisterView(props: RegisterFormProps) {
  return <RegisterForm {...props} />;
}
