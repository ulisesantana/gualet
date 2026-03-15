import { generatePath, routes } from "@common/infrastructure/routes";
import { useLocation } from "wouter";
import { PaymentMethod } from "@gualet/shared";
import { useState } from "react";
import { Button, Card, Flex, Text } from "@common/ui/components";

export interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onDelete?: (paymentMethodId: string) => Promise<void>;
}

export function PaymentMethodCard({
  paymentMethod,
  onDelete,
}: PaymentMethodCardProps) {
  const [, setLocation] = useLocation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    const detailsPath = generatePath(routes.paymentMethods.details, {
      id: paymentMethod.id.toString(),
    });
    setLocation(detailsPath);
  };

  const handleDelete = async () => {
    if (
      window.confirm(`Are you sure you want to delete "${paymentMethod.name}"?`)
    ) {
      setIsDeleting(true);
      try {
        await onDelete?.(paymentMethod.id.toString());
      } catch (error) {
        console.error("Error deleting payment method:", error);
        alert(
          "Failed to delete payment method. It may be in use by transactions.",
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card marginBottom={3}>
      <Flex justify="space-between" align="center" gap={3}>
        <Text fontSize="2xl">{paymentMethod.icon || "💳"}</Text>
        <Text flex="1" fontWeight="semibold">
          {paymentMethod.name}
        </Text>
        <Flex gap={2}>
          {onDelete && (
            <Button
              onClick={handleDelete}
              aria-label="Delete payment method"
              title="Delete"
              disabled={isDeleting}
              variant="danger"
              size="sm"
            >
              {isDeleting ? "⏳" : "🗑️"}
            </Button>
          )}
          <Button
            onClick={handleEdit}
            aria-label="Edit payment method"
            title="Edit"
            variant="ghost"
            size="sm"
          >
            ✏️
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}
