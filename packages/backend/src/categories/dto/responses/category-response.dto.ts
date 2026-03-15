import { CategoryDto } from './category.dto';
import { SuccessResponse } from '@src/common/infrastructure';
import { Category } from '@src/categories';

interface Data {
  category: CategoryDto;
}

export class CategoryResponseDto extends SuccessResponse<Data> {
  constructor(category: Category) {
    super({
      category: category.toJSON(),
    });
  }
}
