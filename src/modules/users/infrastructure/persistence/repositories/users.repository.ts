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
  softDelete(
    prisma: PrismaClient,
    where: Prisma.UserWhereUniqueInput,
  ): Promise<{
    id: string;
    email: string;
    password: string;
    isDeleted: boolean;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
  }> {
    throw new Error('Method not implemented.');
  }
  protected getModel(prisma: PrismaClient) {
    return prisma.user;
  }

  async findByEmail(
    prisma: PrismaClient,
    email: string,
    tenantId: string,
  ): Promise<User | null> {
    return this.getModel(prisma).findFirst({ where: { email, tenantId } });
  }

  async findById(
    prisma: PrismaClient,
    id: string,
    tenantId: string,
  ): Promise<User | null> {
    return this.getModel(prisma).findFirst({ where: { id, tenantId } });
  }
}
