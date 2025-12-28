import { generatePath, routes } from "@common/infrastructure/routes";
import { useLocation } from "wouter";
import { Category, Transaction } from "@gualet/shared";
import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Stack,
  Text,
} from "@common/ui/components";

export interface CategoryCardProps {
  category: Category;
  onDelete?: (categoryId: string) => Promise<void>;
}

export function CategoryCard({ category, onDelete }: CategoryCardProps) {
  const [, setLocation] = useLocation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    const detailsPath = generatePath(routes.categories.details, {
      id: category.id.toString(),
    });
    setLocation(detailsPath);
  };

  const handleDelete = async () => {
    if (
      window.confirm(`Are you sure you want to delete "${category.title}"?`)
    ) {
      setIsDeleting(true);
      try {
        await onDelete?.(category.id.toString());
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category. It may be in use by transactions.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card marginBottom={3}>
      <Flex justify="space-between" align="center">
        <Box flex="1">
          <Text fontWeight="semibold" fontSize="lg">
            {category.title}
          </Text>
          <Badge
            colorScheme={Transaction.isOutcome(category.type) ? "red" : "green"}
            mt={1}
            data-testid={`category-type-${Transaction.isOutcome(category.type) ? "outcome" : "income"}`}
          >
            {category.type}
          </Badge>
        </Box>
        <Stack direction="row" gap={2}>
          {onDelete && (
            <Button
              variant="danger"
              onClick={handleDelete}
              aria-label="Delete category"
              title="Delete"
              isLoading={isDeleting}
              size="sm"
            >
              🗑️
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={handleEdit}
            aria-label="Edit category"
            title="Edit"
            size="sm"
          >
            ✏️
          </Button>
        </Stack>
      </Flex>
    </Card>
  );
}
