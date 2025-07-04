import { CategoryRepository } from "@application/repositories";
import { Category, Id } from "@domain/models";
import { HttpRepository } from "@infrastructure/repositories/http.repository";
import { HttpDataSource } from "@infrastructure/data-sources";
import { BaseResponse } from "@infrastructure/types";
import { CategoryDto, Nullable } from "@gualet/core";

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
      id: category.id.toString(),
      name: category.name,
      icon: category.icon,
      type: category.type,
      color: category.color,
    };
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

  async save(category: Category): Promise<Nullable<Category>> {
    const { success, error, data } = await this.handleQueryResponse(
      this.http.post<CategoryDto, SaveCategoryResponse>(
        this.path,
        CategoryRepositoryImplementation.mapToDto(category),
      ),
    );

    if (!success) {
      console.error("Error saving category:", error);
      return null;
    }

    return CategoryRepositoryImplementation.mapToCategory(data.category);
  }
}
