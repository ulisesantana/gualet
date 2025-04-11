import { CategoryDto } from './category.dto';
import { Category } from '@src/categories';
import { Nullable } from '@src/common/types';
import { BaseResponse, Pagination } from '@src/common/infrastructure';

interface Data {
  categories: CategoryDto[];
}

export class CategoriesResponseDto extends BaseResponse<Data, unknown> {
  constructor(
    categories: Nullable<Category[]>,
    error: Nullable<unknown> = null,
    pagination: Nullable<Pagination> = null,
  ) {
    super(
      categories
        ? {
            categories: categories.map((t) => t.toJSON()),
          }
        : null,
      error,
      pagination,
    );
  }
}
