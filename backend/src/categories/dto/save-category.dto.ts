import { CreateCategoryDto } from './create-category.dto';
import { Required } from '@src/common/decorators';

export class SaveCategoryDto extends CreateCategoryDto {
  @Required()
  id: string;
}
