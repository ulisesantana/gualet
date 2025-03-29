import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';
import { Category } from '../category.model';

export class CategoriesResponseDto {
  @ApiProperty()
  categories: CategoryDto[];

  constructor(categories: Category[]) {
    this.categories = categories.map((category) => category.toJSON());
  }
}
