import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddressEntity {
  @ApiProperty({ example: 'Random Street Name' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: 'Random Neighborhood Name' })
  @IsString()
  @IsNotEmpty()
  neighborhood: string;
}
