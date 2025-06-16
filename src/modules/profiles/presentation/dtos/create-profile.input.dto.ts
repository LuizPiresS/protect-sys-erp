import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressEntity } from '../../domain/entities/shared/address.entity';
import { PaymentDetailsEntity } from '../../domain/entities/shared/payment-details.entity';

export class CreateProfileInputDto {
  @ApiProperty({ example: 'a514b0ec-0cd5-4709-a059-e67c30f907e5' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'Random Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '(99)999999999' })
  @IsString()
  @IsNotEmpty()
  cellPhone: string;

  @ApiProperty({
    example:
      'http://localhost/photo/a514b0ec-0cd5-4709-a059-e67c30f907e5/photo.jpg',
  })
  @IsString()
  @IsOptional()
  photoUrl?: string;

  @ApiProperty({ example: '886.108.930-57', description: 'CPF ou CNPJ' })
  @IsString()
  identificationDocument: string;

  @ApiProperty({ type: AddressEntity })
  @ValidateNested()
  @Type(() => AddressEntity)
  address: AddressEntity;

  @ApiProperty({ type: PaymentDetailsEntity })
  @ValidateNested()
  @Type(() => PaymentDetailsEntity)
  paymentDetails: PaymentDetailsEntity;

  @ApiProperty({
    description: 'Slug único do tenant (ex: empresa-xpto)',
    example: 'empresa-xpto',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'O slug deve conter apenas letras minúsculas, números e hífens',
  })
  tenantSlug: string;

  @ApiProperty({ example: 'a514b0ec-0cd5-4709-a059-e67c30f907e5' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  tenantId: string;
}
