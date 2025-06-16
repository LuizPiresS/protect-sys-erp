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
  softDelete(
    prisma: PrismaClient,
    where: Prisma.ProfileWhereUniqueInput,
  ): Promise<{
    number: string;
    name: string;
    id: string;
    identificationDocument: string;
    cellPhone: string;
    photoUrl: string | null;
    street: string;
    neighborhood: string;
    latitude: number | null;
    longitude: number | null;
    dueDate: string;
    billingEmail: string;
    userId: string;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
  }> {
    throw new Error('Method not implemented.');
  }
  protected getModel(prisma: PrismaClient) {
    return prisma.profile;
  }

  async findById(
    prisma: PrismaClient,
    id: string,
    tenantId: string,
  ): Promise<Profile | null> {
    return this.getModel(prisma).findFirst({ where: { id, tenantId } });
  }

  async findByUserId(
    prisma: PrismaClient,
    userId: string,
    tenantId: string,
  ): Promise<Profile | null> {
    return this.getModel(prisma).findFirst({ where: { userId, tenantId } });
  }
}
