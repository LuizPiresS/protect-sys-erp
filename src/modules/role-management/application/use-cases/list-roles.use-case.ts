import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RolesRepository } from '../../infrastructure/persistence/repositories/roles.repository';

@Injectable()
export class ListRolesUseCase {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly prisma: PrismaClient,
  ) {}

  async execute(tenantId: string) {
    return this.rolesRepository.findAll(this.prisma, tenantId);
  }
}
