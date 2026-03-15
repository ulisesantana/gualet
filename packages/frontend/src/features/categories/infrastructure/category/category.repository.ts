import { HttpRepository } from "@common/infrastructure/http.repository";
import { HttpDataSource } from "@common/infrastructure";
import { BaseResponse } from "@infrastructure/types";
import {
  Category,
  CategoryDto,
  Id,
  NewCategory,
  Nullable,
} from "@gualet/shared";

import { CategoryRepository } from "../../application/category.repository";

type FindAllCategoriesResponse = BaseResponse<
  { categories: CategoryDto[] },
  Error
>;
type FindCategoryResponse = BaseResponse<{ category: CategoryDto }, Error>;
type SaveCategoryResponse = BaseResponse<{ category: CategoryDto }, Error>;

export class CategoryRepositoryImplementation
  extends HttpRepository
  implements CategoryRepository
{
  private readonly path = "/api/me/categories";

  constructor(http: HttpDataSource) {
    super(http);
  }

  static mapToCategory(dto: CategoryDto) {
    return new Category({
      id: new Id(dto.id),
      name: dto.name,
      icon: dto.icon ?? "",
      type: dto.type,
      color: dto.color ?? "",
    });
  }

  static mapToDto(category: Category): CategoryDto {
    return {
      id: category.id?.toString() || "",
      name: category.name,
      icon: category.icon,
      type: category.type,
      color: category.color,
    };
  }

  static mapToDtoForUpdate(category: Category): Omit<CategoryDto, "id"> {
    return {
      name: category.name,
      icon: category.icon,
      type: category.type,
      color: category.color,
    };
  }

  async create(category: NewCategory): Promise<Nullable<Category>> {
    const categoryData = category.toJSON();
    const { success, error, data } = await this.handleQueryResponse(
      this.http.post<CategoryDto, SaveCategoryResponse>(
        this.path,
        categoryData as CategoryDto,
      ),
    );

    if (!success) {
      console.error("Error creating category:", error);
      throw new Error(error || "Failed to create category");
    }

    return CategoryRepositoryImplementation.mapToCategory(data.category);
  }

  async delete(id: Id): Promise<void> {
    const { success, error } = await this.handleCommandResponse(
      this.http.delete<any>(`${this.path}/${id}`),
    );

    if (!success) {
      console.error(`Error deleting category ${id}:`, error);
      throw new Error(error || "Failed to delete category");
    }
  }

  async findAll(): Promise<Category[]> {
    const { success, error, data } = await this.handleQueryResponse(
      this.http.get<FindAllCategoriesResponse>(this.path),
    );

    if (!success) {
      console.error("Error fetching categories:", error);
      return [];
    }

    return data.categories.map(CategoryRepositoryImplementation.mapToCategory);
  }

  async findById(id: Id): Promise<Nullable<Category>> {
    const { success, error, data } = await this.handleQueryResponse(
      this.http.get<FindCategoryResponse>(`${this.path}/${id}`),
    );

    if (!success) {
      console.error(`Error fetching category ${id}.`);
      console.error(error);
      return null;
    }

    return CategoryRepositoryImplementation.mapToCategory(data.category);
  }

  async update(category: Category): Promise<Nullable<Category>> {
    const { success, error, data } = await this.handleQueryResponse(
      this.http.patch<Omit<CategoryDto, "id">, SaveCategoryResponse>(
        `${this.path}/${category.id}`,
        CategoryRepositoryImplementation.mapToDtoForUpdate(category),
      ),
    );

    if (!success) {
      console.error("Error updating category:", error);
      throw new Error(error || "Failed to update category");
    }

    return CategoryRepositoryImplementation.mapToCategory(data.category);
  }
}
