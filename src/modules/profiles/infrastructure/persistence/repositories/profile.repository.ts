import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma, Profile } from '@prisma/client';
import { BaseRepository } from '../../../../../shared/base-repository/base-repository';
import { IProfileRepository } from '../../../domain/interfaces/profile.repository.interface';

@Injectable()
export class ProfileRepository
  extends BaseRepository<
    Profile,
    Prisma.ProfileWhereUniqueInput,
    Prisma.ProfileCreateInput,
    Prisma.ProfileUpdateInput,
    Prisma.ProfileFindManyArgs
  >
  implements IProfileRepository
{
  protected getModel(prisma: PrismaClient) {
    return prisma.profile;
  }

  async findById(
    prisma: PrismaClient,
    id: string,
    tenantId: string,
  ): Promise<Profile | null> {
    return this.getModel(prisma).findFirst({
      where: {
        id,
        tenantId,
      },
    });
  }

  async findByUserId(
    prisma: PrismaClient,
    userId: string,
    tenantId: string,
  ): Promise<Profile | null> {
    return this.getModel(prisma).findFirst({
      where: {
        userId,
        tenantId,
      },
    });
  }

  async softDelete(
    prisma: PrismaClient,
    where: Prisma.ProfileWhereUniqueInput,
  ): Promise<Profile> {
    return this.getModel(prisma).update({
      where,
      data: {
        updatedAt: new Date(),
      },
    });
  }

  // Sobrescreve o método findAll para incluir ordenação
  async findAll(prisma: PrismaClient, tenantId: string): Promise<Profile[]> {
    return this.getModel(prisma).findMany({
      where: {
        tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Sobrescreve o método findWithFilters para incluir ordenação
  async findWithFilters(
    prisma: PrismaClient,
    options: Prisma.ProfileFindManyArgs & { tenantId: string },
  ): Promise<Profile[]> {
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

  // Método específico para buscar perfis com dados do usuário
  async findWithUser(
    prisma: PrismaClient,
    tenantId: string,
  ): Promise<Profile[]> {
    return this.getModel(prisma).findMany({
      where: {
        tenantId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Método para buscar perfil por documento de identificação
  async findByIdentificationDocument(
    prisma: PrismaClient,
    identificationDocument: string,
    tenantId: string,
  ): Promise<Profile | null> {
    return this.getModel(prisma).findFirst({
      where: {
        identificationDocument,
        tenantId,
      },
    });
  }
}
