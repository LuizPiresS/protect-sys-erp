import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository } from '../../domain/interfaces/users.repository.interface';
import { IHashingService } from '../../../../shared/hashing/domain/services/interfaces/hashing.service.interface';
import { ConfigService } from '@nestjs/config';
import { IUserMapperService } from '../../domain/interfaces/user-mapper.service.interface';
import { UserAlreadyExistsError } from '@errors/user-already-existis.error';
import { UserDeletedException } from '@exceptions/user-deleted.exception';
import {
  HashServiceToken,
  UserMapperServiceToken,
  UsersRepositoryToken,
} from '@inject-tokens/users.tokens';
import { UserUpdateInputDto } from '../../presentation/http/dtos/user.update.input.dto';
import { CreateUserOutputDTO } from '../../presentation/http/dtos/createUserOutputDTO';
import { PrismaClient } from '@prisma/client';
import { AuditLogService } from 'src/shared/audition-logs/audit-log.service';

// Definindo interfaces específicas para este use case
export interface IUpdateUserUseCase {
  execute(
    userId: string,
    input: UserUpdateInputDto,
    correlationId: string,
  ): Promise<CreateUserOutputDTO>;
}

@Injectable()
export class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(
    @Inject(UsersRepositoryToken)
    private readonly usersRepository: IUsersRepository,

    @Inject(HashServiceToken)
    private readonly hashService: IHashingService,

    private readonly configService: ConfigService,

    @Inject(UserMapperServiceToken)
    private readonly userMapperService: IUserMapperService,

    private readonly prisma: PrismaClient, // Use PrismaClient padrão

    private readonly auditLogService: AuditLogService,
  ) {}

  public async execute(
    userId: string,
    input: UserUpdateInputDto,
    correlationId: string,
  ): Promise<CreateUserOutputDTO> {
    // Busque o usuário pelo id e tenantId
    const user = await this.usersRepository.findById(
      this.prisma,
      userId,
      input.tenantId,
    );
    if (!user) {
      throw new Error('User not found');
    }
    if (user.isDeleted) {
      throw new UserDeletedException();
    }

    // Verifique se já existe outro usuário com o mesmo email no tenant
    const existentUser = await this.usersRepository.findByEmail(
      this.prisma,
      input.email,
      input.tenantId,
    );
    if (existentUser && existentUser.id !== userId) {
      throw new UserAlreadyExistsError();
    }

    const saltRounds = this.configService.get<number>('SALT_ROUNDS');
    const hashedPassword = await this.hashService.hashingPassword(
      input.password,
      saltRounds,
    );

    const updatedUser = await this.usersRepository.update(
      this.prisma,
      { id: userId, tenantId: input.tenantId },
      {
        email: input.email,
        password: hashedPassword,
      },
    );

    await this.auditLogService.log({
      tenantId: input.tenantId,
      action: 'EDIT_USER',
      details: `O usuário  ${input.email} teve seus dados alterador pelo usário ${userId}`,
      level: 'info',
      correlationId,
    });
    return this.userMapperService.toOutput(updatedUser);
  }
}
