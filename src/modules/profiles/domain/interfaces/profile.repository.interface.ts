import { Prisma, PrismaClient, Profile } from '@prisma/client';
import { IBaseRepository } from '../../../../shared/base-repository/interfaces/base-repository.interface';

export interface IProfileRepository
  extends IBaseRepository<
    Profile,
    Prisma.ProfileWhereUniqueInput,
    Prisma.ProfileCreateInput,
    Prisma.ProfileUpdateInput,
    Prisma.ProfileFindManyArgs
  > {
  findById(
    prisma: PrismaClient,
    id: string,
    tenantId: string,
  ): Promise<Profile | null>;
  findByUserId(
    prisma: PrismaClient,
    userId: string,
    tenantId: string,
  ): Promise<Profile | null>;
}
