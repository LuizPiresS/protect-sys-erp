import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository } from '../../domain/interfaces/users.repository.interface';
import { UserDeletedException } from '@exceptions/user-deleted.exception';
import { UsersRepositoryToken } from '@inject-tokens/users.tokens';
import { PrismaClient } from '@prisma/client';

export interface IAnonymizeUserUseCase {
  execute(tenantId: string, userId: string): Promise<void>;
}

@Injectable()
export class AnonymizeUserUseCase implements IAnonymizeUserUseCase {
  constructor(
    @Inject(UsersRepositoryToken)
    private readonly usersRepository: IUsersRepository,
    private readonly prisma: PrismaClient,
  ) {}

  public async execute(tenantId: string, userId: string): Promise<void> {
    const user = await this.usersRepository.findById(
      this.prisma,
      userId,
      tenantId,
    );
    if (!user) {
      throw new Error('User not found');
    }
    if (user.isDeleted) {
      throw new UserDeletedException();
    }

    const anonymizedData = {
      email: `deleted_user_${userId}@deleted.com`,
      isDeleted: true,
    };

    await this.usersRepository.update(
      this.prisma,
      { id: userId, tenantId },
      anonymizedData,
    );
  }
}
