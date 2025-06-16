import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { AnonymizeUserUseCase } from './application/use-cases/anonymize-user.use-case';
import { UserController } from './presentation/http/controllers/users.controller';
import { HashingService } from '../../shared/hashing/domain/services/hashing.service';
import { UsersRepository } from './infrastructure/persistence/repositories/users.repository';
import { ValidatorService } from './infrastructure/services/validator.service';
import { UserMapperService } from './application/mappers/user-mapper.service';
import {
  AnonymizeUserUseCaseToken,
  CreateUserUseCaseToken,
  HashServiceToken,
  ListAllActiveUsersUseCaseToken,
  ListAllUsersUseCaseToken,
  UpdateUserUseCaseToken,
  UserMapperServiceToken,
  UsersRepositoryToken,
  ValidatorServiceToken,
} from '@inject-tokens/users.tokens';
import { HashingModule } from '../../shared/hashing/hashing.module';
import { PrismaClient } from '@prisma/client';
import { ListAllUsersUseCase } from './application/use-cases/list-all-users.use-case';
import { ListAllActiveUsersUseCase } from './application/use-cases/list-all-active-users';
import { TenantModule } from '../tenant/tenant.module';
import { ConfigModule } from '@nestjs/config';
import { AuditLogService } from 'src/shared/audition-logs/audit-log.service';

@Module({
  imports: [HashingModule, TenantModule, ConfigModule],
  controllers: [UserController],
  providers: [
    {
      provide: CreateUserUseCaseToken,
      useClass: CreateUserUseCase,
    },
    {
      provide: UpdateUserUseCaseToken,
      useClass: UpdateUserUseCase,
    },
    {
      provide: AnonymizeUserUseCaseToken,
      useClass: AnonymizeUserUseCase,
    },
    {
      provide: UsersRepositoryToken,
      useClass: UsersRepository,
    },
    {
      provide: HashServiceToken,
      useClass: HashingService,
    },
    {
      provide: ValidatorServiceToken,
      useClass: ValidatorService,
    },
    {
      provide: UserMapperServiceToken,
      useClass: UserMapperService,
    },
    {
      provide: ListAllUsersUseCaseToken,
      useClass: ListAllUsersUseCase,
    },
    {
      provide: ListAllActiveUsersUseCaseToken,
      useClass: ListAllActiveUsersUseCase,
    },
    PrismaClient,
    AuditLogService,
  ],
})
export class UserModule {}
