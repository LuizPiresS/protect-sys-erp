import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PersonalDataEntity {
  @ApiProperty({ example: 'Random Name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
