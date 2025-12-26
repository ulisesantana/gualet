import "./PaymentMethodCard.css";
import { generatePath, routes } from "@infrastructure/ui/routes";
import { useLocation } from "wouter";
import { PaymentMethod } from "@gualet/shared";
import { useState } from "react";

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
    <div
      className="payment-method-card-container"
      data-testid={`payment-method-item-${paymentMethod.id.toString()}`}
    >
      <div className="payment-method-card">
        <div className="payment-method-card-icon">
          {paymentMethod.icon || "💳"}
        </div>
        <div className="payment-method-card-name">{paymentMethod.name}</div>
        <div className="payment-method-card-actions">
          {onDelete && (
            <button
              onClick={handleDelete}
              aria-label="Delete payment method"
              title="Delete"
              disabled={isDeleting}
            >
              {isDeleting ? "⏳" : "🗑️"}
            </button>
          )}
          <button
            onClick={handleEdit}
            aria-label="Edit payment method"
            title="Edit"
          >
            ✏️
          </button>
        </div>
      </div>
    </div>
  );
}
