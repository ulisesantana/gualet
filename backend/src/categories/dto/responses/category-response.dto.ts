import { CategoryDto } from './category.dto';
import { BaseResponse, Pagination } from '@src/common/infrastructure';
import { Nullable } from '@src/common/types';
import { Category } from '@src/categories';

interface Data {
  category: CategoryDto;
}

export class CategoryResponseDto extends BaseResponse<Data, unknown> {
  constructor(
    category: Nullable<Category>,
    error: Nullable<unknown> = null,
    pagination: Nullable<Pagination> = null,
  ) {
    super(
      category
        ? {
            category: category.toJSON(),
          }
        : null,
      error,
      pagination,
    );
  }
}
