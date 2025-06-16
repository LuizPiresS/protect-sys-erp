import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PaymentDetailsEntity {
  @ApiProperty({ example: '05/08/2022' })
  @IsNotEmpty()
  @IsString()
  dueDate: string;

  @ApiProperty({ example: 'cobranca@cobranca.com' })
  @IsEmail()
  @IsNotEmpty()
  billingEmail: string;
}