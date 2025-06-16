import { Prisma, PrismaClient, User } from '@prisma/client';
import { IBaseRepository } from '../../../../shared/base-repository/interfaces/base-repository.interface';

export interface IUsersRepository
  extends IBaseRepository<
    User,
    Prisma.UserWhereUniqueInput,
    Prisma.UserCreateInput,
    Prisma.UserUpdateInput,
    Prisma.UserFindManyArgs
  > {
  findByEmail(
    prisma: PrismaClient,
    email: string,
    tenantId: string,
  ): Promise<User | null>;
  findById(
    prisma: PrismaClient,
    id: string,
    tenantId: string,
  ): Promise<User | null>;
}
