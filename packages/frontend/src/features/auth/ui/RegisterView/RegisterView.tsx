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

import { SignUpUseCase } from "../../application/cases";

export interface RegisterFormProps {
  signUpUseCase: SignUpUseCase;
}

export function RegisterForm({ signUpUseCase }: RegisterFormProps) {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const callback = (error?: string) => {
    if (error) {
      setSuccessMessage("");
      setErrorMessage(error);
    } else {
      setSuccessMessage(
        "Your email needs to be confirmed. Please, check your email and click on confirm link.",
      );
    }
  };
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
            callback();
          } else {
            console.error("Registration error:", result.error);
            callback(result.error || "Registration failed");
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
        {successMessage && (
          <Box mt={4}>
            <AlertMessage status="success">{successMessage}</AlertMessage>
          </Box>
        )}
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
