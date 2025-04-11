import { CategoryDto } from './category.dto';
import { BaseResponse } from '@src/common/infrastructure';
import { Nullable } from '@src/common/types';
import { Category } from '@src/categories';

interface Data {
  category: CategoryDto;
}

export class CategoryResponseDto extends BaseResponse<Data, unknown> {
  constructor(category: Nullable<Category>, error: Nullable<unknown> = null) {
    super(
      category
        ? {
            category: category.toJSON(),
          }
        : null,
      error,
    );
  }
}
