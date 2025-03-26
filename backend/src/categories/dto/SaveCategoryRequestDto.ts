import { CreateCategoryRequestDto } from './CreateCategoryRequestDto';
import { Required } from '../../common/decorators';

export class SaveCategoryRequestDto extends CreateCategoryRequestDto {
  @Required()
  id: string;
}
