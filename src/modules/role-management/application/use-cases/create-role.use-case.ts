import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RolesRepository } from '../../infrastructure/persistence/repositories/roles.repository';
import { RoleCreateInputDto } from '../../presentation/http/dtos/role-create.input.dto';

@Injectable()
export class CreateRoleUseCase {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly prisma: PrismaClient,
  ) {}

  async execute(input: RoleCreateInputDto) {
    return this.rolesRepository.createRole(input, this.prisma);
  }
}
