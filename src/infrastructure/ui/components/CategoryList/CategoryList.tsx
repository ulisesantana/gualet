import React from "react";
import { Category } from "@domain/models";
import "./CategoryList.css";

import { CategoryCard } from "../CategoryCard";

export interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  return categories.length ? (
    <ul className="category-card-list">
      {React.Children.toArray(
        categories.map((category) => (
          <li data-id={category.id.toString()} key={category.id.toString()}>
            <CategoryCard category={category} />
          </li>
        )),
      )}
    </ul>
  ) : (
    <span>There are no categories</span>
  );
}
