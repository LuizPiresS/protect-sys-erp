import { ApiProperty } from '@nestjs/swagger';
import { PaymentDetailsEntity } from '../../domain/entities/shared/payment-details.entity';
import { AddressEntity } from '../../domain/entities/shared/address.entity';
import { IsString } from 'class-validator';

export class CreateProfileOutputDto {
  @ApiProperty({ example: 'randomId' })
  id: string;

  @ApiProperty({ example: 'randomId' })
  photoUrl?: string;

  @ApiProperty({ description: 'CPF ou CNPJ', example: '33.127.184/0001-04' })
  @IsString()
  identificationDocument: string;

  @ApiProperty({ example: 'Random Name' })
  name: string;

  @ApiProperty({ example: '(99)999999999' })
  cellPhone: string;

  @ApiProperty({ type: AddressEntity })
  address: AddressEntity;

  @ApiProperty({ type: PaymentDetailsEntity })
  paymentDetails: PaymentDetailsEntity;
}
