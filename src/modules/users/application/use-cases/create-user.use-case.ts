import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository } from '../../domain/interfaces/users.repository.interface';
import { IHashingService } from '../../../../shared/hashing/domain/services/interfaces/hashing.service.interface';
import { ConfigService } from '@nestjs/config';
import { IValidatorService } from '../../domain/interfaces/validator.service.interface';
import { IUserMapperService } from '../../domain/interfaces/user-mapper.service.interface';
import { UserAlreadyExistsError } from '@errors/user-already-existis.error';
import {
  HashServiceToken,
  UserMapperServiceToken,
  UsersRepositoryToken,
  ValidatorServiceToken,
} from '@inject-tokens/users.tokens';
import { UserCreateInputDto } from '../../presentation/http/dtos/user.create.input.dto';
import { CreateUserOutputDTO } from '../../presentation/http/dtos/createUserOutputDTO';
import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { AuditLogService } from 'src/shared/audition-logs/audit-log.service';

export interface ICreateUserUseCase {
  execute(
    input: UserCreateInputDto,
    correlationId?: string,
  ): Promise<CreateUserOutputDTO>;
}

@Injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    @Inject(UsersRepositoryToken)
    private readonly usersRepository: IUsersRepository,

    @Inject(HashServiceToken)
    private readonly hashService: IHashingService,

    private readonly configService: ConfigService,

    @Inject(ValidatorServiceToken)
    private readonly validatorService: IValidatorService,

    @Inject(UserMapperServiceToken)
    private readonly userMapperService: IUserMapperService,

    private readonly prisma: PrismaClient, // Use PrismaClient padrão

    private readonly auditLogService: AuditLogService,
  ) {}

  private readonly logger = new Logger(CreateUserUseCase.name);

  public async execute(
    input: UserCreateInputDto,
    correlationId?: string,
  ): Promise<CreateUserOutputDTO> {
    this.logger.log(
      `[${correlationId}] Criando usuário para tenant ${input.tenantId}`,
    );

    this.validatorService.validateUserInput(input);

    const existentUser = await this.usersRepository.findByEmail(
      this.prisma,
      input.email,
      input.tenantId,
    );
    if (existentUser) {
      throw new UserAlreadyExistsError();
    }

    const saltRounds = this.configService.get<number>('SALT_ROUNDS');
    if (!saltRounds) {
      throw new Error('SALT_ROUNDS is not defined');
    }

    const hashedPassword = await this.hashService.hashingPassword(
      input.password,
      saltRounds,
    );

    const newUser = await this.usersRepository.create(this.prisma, {
      email: input.email,
      password: hashedPassword,
      tenant: {
        connect: {
          id: input.tenantId,
        },
      },
    });

    await this.auditLogService.log({
      tenantId: input.tenantId,
      action: 'CREATE_USER',
      details: `Usuário criado: ${input.email}`,
      level: 'info',
      correlationId,
    });
    return this.userMapperService.toOutput(newUser);
  }
}
