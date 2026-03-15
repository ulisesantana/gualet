import React from "react";
import { Link, useLocation } from "wouter";
import { routes } from "@common/infrastructure/routes";
import { Image } from "@chakra-ui/react";

import { Box, Container, Flex, Text } from "../Layout";

function checkIsProtectedRoute(location: string) {
  return (
    !location.startsWith(routes.login) && !location.startsWith(routes.register)
  );
}

export function Header() {
  const [location] = useLocation();
  const isProtectedRoute = checkIsProtectedRoute(location);
  return (
    <Box
      as="header"
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
      py={3}
      position="sticky"
      top={0}
      zIndex={10}
      boxShadow="sm"
    >
      <Container maxW="1200px">
        <Flex justify="space-between" align="center">
          <Link to={routes.home}>
            <Flex align="center" gap={2} cursor="pointer">
              <Image src="/icons/gualet.png" alt="Gualet logo" boxSize="32px" />
              <Text fontSize="xl" fontWeight="bold" color="blue.600">
                Gualet
              </Text>
            </Flex>
          </Link>
          {isProtectedRoute && (
            <Box data-testid="header-settings-cta">
              <Link to={routes.settings} aria-label="Settings">
                <Text fontSize="2xl" cursor="pointer">
                  ⚙️
                </Text>
              </Link>
            </Box>
          )}
        </Flex>
      </Container>
    </Box>
  );
}
