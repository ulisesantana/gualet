import { Category, Transaction } from "@domain/models";
import "./CategoryCard.css";
import { generatePath, routes } from "@infrastructure/ui/routes";
import { Link } from "wouter";

export function CategoryCard({ category }: { category: Category }) {
  const detailsPath = generatePath(routes.categories.details, {
    id: category.id.toString(),
  });
  return (
    <div className="category-card-container">
      <Link to={detailsPath}>
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
        </div>
      </Link>
    </div>
  );
}
