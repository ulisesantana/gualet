import { IsString, IsUUID } from 'class-validator';

export class UserPreferencesDto {
  @IsUUID()
  @IsString()
  defaultPaymentMethodId: string;
}
