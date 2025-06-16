import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository } from '../../domain/interfaces/users.repository.interface';
import { IHashingService } from '../../../../shared/hashing/domain/services/interfaces/hashing.service.interface';
import { ConfigService } from '@nestjs/config';
import { IUserMapperService } from '../../domain/interfaces/user-mapper.service.interface';
import {
  HashServiceToken,
  UserMapperServiceToken,
  UsersRepositoryToken,
} from '@inject-tokens/users.tokens';
import { CreateUserOutputDTO } from '../../presentation/http/dtos/createUserOutputDTO';
import { PrismaClient } from '@prisma/client';
import { AuditLogService } from 'src/shared/audition-logs/audit-log.service';

export interface IListAllUsersUseCase {
  execute(
    tenantSlug: string,
    userId: string,
    correlationId: string,
  ): Promise<CreateUserOutputDTO[]>;
}

@Injectable()
export class ListAllUsersUseCase implements IListAllUsersUseCase {
  constructor(
    @Inject(UsersRepositoryToken)
    private readonly usersRepository: IUsersRepository,
    @Inject(UserMapperServiceToken)
    private readonly userMapperService: IUserMapperService,
    private readonly prisma: PrismaClient, // Use PrismaClient padrão
    private readonly auditLogService: AuditLogService,
  ) {}

  public async execute(
    tenantId: string,
    userId: string,
    correlationId: string,
  ): Promise<CreateUserOutputDTO[]> {
    const users = await this.usersRepository.findAll(this.prisma, tenantId);
    await this.auditLogService.log({
      tenantId: tenantId,
      action: 'LIST_ALL_USERS',
      details: `O usuário  ${userId} listou todos os usuário do tenant ${tenantId}`,
      level: 'info',
      correlationId,
    });
    return users.map((user) => this.userMapperService.toOutput(user));
  }
}
