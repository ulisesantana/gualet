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
        width="100%"
      >
        <Card marginBottom={3}>
          <Flex
            justify="space-between"
            align="center"
            inline={true}
            width="100%"
          >
            <Text fontSize="sm" color="gray.500" marginBottom={1}>
              {date}
            </Text>
            <Badge
              backgroundColor={
                transaction.isOutcome()
                  ? "var(--danger-color)"
                  : "var(--success-color)"
              }
              fontSize="md"
            >
              {transaction.amountFormatted}
            </Badge>
          </Flex>
          <Text width="100%" fontWeight="semibold">
            {transaction.category.title}
          </Text>
        </Card>
      </Box>
    </Link>
  );
}
