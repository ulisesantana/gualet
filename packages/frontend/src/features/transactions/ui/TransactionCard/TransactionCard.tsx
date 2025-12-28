import { Transaction } from "@gualet/shared";
import { generatePath, routes } from "@common/infrastructure/routes";
import { Link } from "wouter";
import { Badge, Box, Card, Flex, Text } from "@common/ui/components";

export function TransactionCard({ transaction }: { transaction: Transaction }) {
  const date = `${transaction.date.getFormatedDate()} / ${transaction.date.getFormatedMonth()}`;
  const detailsPath = generatePath(routes.transactions.details, {
    id: transaction.id.toString(),
  });

  return (
    <Link to={detailsPath}>
      <Box
        cursor="pointer"
        _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
        transition="all 0.2s"
      >
        <Card marginBottom={3}>
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="sm" color="gray.500" marginBottom={1}>
                {date}
              </Text>
              <Text fontWeight="semibold">{transaction.category.title}</Text>
            </Box>
            <Badge
              colorScheme={transaction.isOutcome() ? "red" : "green"}
              fontSize="md"
              px={3}
              py={1}
            >
              {transaction.amountFormatted}
            </Badge>
          </Flex>
        </Card>
      </Box>
    </Link>
  );
}
