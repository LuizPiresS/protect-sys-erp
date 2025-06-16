import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsUUID,
  Matches,
} from 'class-validator';
import { Match } from '../../../../../shared/decorators/match.decorator';

export class UserCreateInputDto {
  @ApiProperty({
    description: 'User email that will be used to login',
    example: 'random@random.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'The password must contain at least one uppercase letter, one special character and one number and be made up of at least 8 characters.',
    example: 'R@nd0mP@ssw0rd',
  })
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: 'Confirmation of the password',
    example: 'R@nd0mP@ssw0rd',
  })
  @IsStrongPassword()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;

  @ApiProperty({
    description: 'Tenant ID to which the user will belong',
    example: 'b1a2c3d4-e5f6-7890-abcd-1234567890ef',
  })
  @IsUUID()
  tenantId: string;

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
}
