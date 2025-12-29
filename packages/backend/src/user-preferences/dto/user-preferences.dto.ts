import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserPreferencesDto {
  @ApiProperty({
    description: 'Default payment method ID',
    example: 'a3e23c3c-6dae-4783-84e6-753f44038cd4',
  })
  @IsUUID()
  @IsString()
  defaultPaymentMethodId: string;

  @ApiProperty({
    description: 'User preferred language',
    example: 'en',
    enum: ['en', 'es'],
    default: 'en',
  })
  @IsOptional()
  @IsString()
  @IsIn(['en', 'es'])
  language?: string;
}
