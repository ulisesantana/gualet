import { CategoryDto } from './category.dto';
import { Category } from '@src/categories';
import { SuccessResponse } from '@src/common/infrastructure';

interface Data {
  categories: CategoryDto[];
}

export class CategoriesResponseDto extends SuccessResponse<Data> {
  constructor(categories: Category[]) {
    super({
      categories: categories.map((t) => t.toJSON()),
    });
  }
}
