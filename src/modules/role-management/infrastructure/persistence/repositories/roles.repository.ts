import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma, Role } from '@prisma/client';
import { BaseRepository } from '../../../../../shared/base-repository/base-repository';
import { RoleCreateInputDto } from '../../../presentation/http/dtos/role-create.input.dto';

@Injectable()
export class RolesRepository extends BaseRepository<
  Role,
  Prisma.RoleWhereUniqueInput,
  Prisma.RoleCreateInput,
  Prisma.RoleUpdateInput,
  Prisma.RoleFindManyArgs
> {
  protected getModel(prisma: PrismaClient) {
    return prisma.role;
  }

  // Método específico para criar role com DTO customizado
  async createRole(input: RoleCreateInputDto, prisma: PrismaClient) {
    const { tenantId, name, description, permissions } = input;
    return this.getModel(prisma).create({
      data: {
        name,
        description: description ?? '', // Garante valor padrão
        permissions,
        tenant: { connect: { id: tenantId } },
      },
    });
  }

  async findAll(prisma: PrismaClient, tenantId: string): Promise<Role[]> {
    return this.getModel(prisma).findMany({
      where: { tenantId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Método específico para buscar roles por nome
  async findByName(
    prisma: PrismaClient,
    name: string,
    tenantId: string,
  ): Promise<Role | null> {
    return this.getModel(prisma).findFirst({
      where: {
        name,
        tenantId,
      },
    });
  }

  // Método para buscar roles padrão
  async findDefaultRoles(
    prisma: PrismaClient,
    tenantId: string,
  ): Promise<Role[]> {
    return this.getModel(prisma).findMany({
      where: {
        tenantId,
        isDefault: true,
      },
    });
  }

  // Método para buscar roles com usuários
  async findWithUsers(prisma: PrismaClient, tenantId: string): Promise<Role[]> {
    return this.getModel(prisma).findMany({
      where: {
        tenantId,
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Sobrescreve o método findWithFilters para incluir ordenação
  async findWithFilters(
    prisma: PrismaClient,
    options: Prisma.RoleFindManyArgs & { tenantId: string },
  ): Promise<Role[]> {
    const { tenantId, ...restOptions } = options;
    return this.getModel(prisma).findMany({
      ...restOptions,
      where: {
        ...restOptions.where,
        tenantId,
      },
      orderBy: {
        ...restOptions.orderBy,
        createdAt: 'desc',
      },
    });
  }
}
