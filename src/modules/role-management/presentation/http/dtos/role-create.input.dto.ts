import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
export class RoleCreateInputDto {
  @ApiProperty({
    description: 'Role name',
    example: 'Admin',
  })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Administrator role with full access',
  })
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    description: 'Role permissions',
    example: ['read:users', 'write:users'],
  })
  @IsString({ each: true, message: 'Permissions must be an array of strings' })
  permissions?: string[];

  @ApiProperty({
    description: 'Tenant ID',
    example: 'tenant-123',
  })
  @IsUUID()
  tenantId: string;
}
