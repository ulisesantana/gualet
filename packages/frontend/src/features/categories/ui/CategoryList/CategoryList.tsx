import React from "react";
import { Category } from "@gualet/shared";
import "./CategoryList.css";

import { CategoryCard } from "../CategoryCard";

export interface CategoryListProps {
  categories: Category[];
  onDeleteCategory?: (categoryId: string) => Promise<void>;
}

export function CategoryList({
  categories,
  onDeleteCategory,
}: CategoryListProps) {
  return categories.length ? (
    <ul className="category-card-list">
      {React.Children.toArray(
        categories.map((category) => (
          <li
            data-testid={`category-item-${category.id}`}
            key={category.id.toString()}
          >
            <CategoryCard category={category} onDelete={onDeleteCategory} />
          </li>
        )),
      )}
    </ul>
  ) : (
    <span>There are no categories</span>
  );
}
