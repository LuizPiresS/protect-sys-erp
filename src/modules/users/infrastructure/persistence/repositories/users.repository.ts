import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma, User } from '@prisma/client';
import { BaseRepository } from '../../../../../shared/base-repository/base-repository';
import { IUsersRepository } from '../../../domain/interfaces/users.repository.interface';

@Injectable()
export class UsersRepository
  extends BaseRepository<
    User,
    Prisma.UserWhereUniqueInput,
    Prisma.UserCreateInput,
    Prisma.UserUpdateInput,
    Prisma.UserFindManyArgs
  >
  implements IUsersRepository
{
  protected getModel(prisma: PrismaClient) {
    return prisma.user;
  }

  async findByEmail(
    prisma: PrismaClient,
    email: string,
    tenantId: string,
  ): Promise<User | null> {
    return this.getModel(prisma).findFirst({
      where: {
        email,
        tenantId,
        isDeleted: false,
      },
    });
  }

  async findById(
    prisma: PrismaClient,
    id: string,
    tenantId: string,
  ): Promise<User | null> {
    return this.getModel(prisma).findFirst({
      where: {
        id,
        tenantId,
        isDeleted: false,
      },
    });
  }

  async softDelete(
    prisma: PrismaClient,
    where: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    return this.getModel(prisma).update({
      where,
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    });
  }

  async findAll(prisma: PrismaClient, tenantId: string): Promise<User[]> {
    return this.getModel(prisma).findMany({
      where: {
        tenantId,
        isDeleted: false,
      },
    });
  }

  async findWithFilters(
    prisma: PrismaClient,
    options: Prisma.UserFindManyArgs & { tenantId: string },
  ): Promise<User[]> {
    const { tenantId, ...restOptions } = options;
    return this.getModel(prisma).findMany({
      ...restOptions,
      where: {
        ...restOptions.where,
        tenantId,
        isDeleted: false,
      },
    });
  }

  async findActiveUsers(
    prisma: PrismaClient,
    tenantId: string,
  ): Promise<User[]> {
    return this.getModel(prisma).findMany({
      where: {
        tenantId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByEmailWithoutTenant(
    prisma: PrismaClient,
    email: string,
  ): Promise<User | null> {
    return this.getModel(prisma).findFirst({
      where: {
        email,
        isDeleted: false,
      },
    });
  }
}
