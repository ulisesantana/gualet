import "./CategoryCard.css";
import { generatePath, routes } from "@common/infrastructure/routes";
import { useLocation } from "wouter";
import { Category, Transaction } from "@gualet/shared";
import { useState } from "react";

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
    <div className="category-card-container">
      <div className="category-card">
        <div className="category-card-title">{category.title}</div>
        <div
          className={
            "category-card-type " +
            (Transaction.isOutcome(category.type) ? "outcome" : "income")
          }
        >
          {category.type}
        </div>
        <div className="category-card-actions">
          {onDelete && (
            <button
              onClick={handleDelete}
              aria-label="Delete category"
              title="Delete"
              disabled={isDeleting}
            >
              {isDeleting ? "⏳" : "🗑️"}
            </button>
          )}
          <button onClick={handleEdit} aria-label="Edit category" title="Edit">
            ✏️
          </button>
        </div>
      </div>
    </div>
  );
}
