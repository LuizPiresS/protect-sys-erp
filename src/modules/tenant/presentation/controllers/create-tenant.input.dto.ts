import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateTenantInputDto {
  @ApiProperty({
    description: 'Nome do tenant',
    example: 'Empresa XPTO',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Slug único do tenant (ex: empresa-xpto)',
    example: 'empresa-xpto',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'O slug deve conter apenas letras minúsculas, números e hífens',
  })
  slug: string;

  @ApiProperty({
    description: 'Ativo?',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
