/**
 * Controller responsible for handling HTTP requests related to user management.
 *
 * @remarks
 * This controller provides endpoints for creating, updating, listing, and anonymizing users.
 * It uses dependency injection to interact with the corresponding use cases for each operation.
 *
 * @constructor
 * @param createUserUseCase - Use case for creating a new user.
 * @param updateUserUseCase - Use case for updating an existing user.
 * @param anonymizeUserUseCase - Use case for anonymizing (deleting) a user.
 * @param listAllUsersUseCase - Use case for listing all users.
 * @param listAllActiveUsersUseCase - Use case for listing all active users.
 *
 * @route /users
 *
 * @tags Users
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ICreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import { IUpdateUserUseCase } from '../../../application/use-cases/update-user.use-case';
import { UserCreateInputDto } from '../dtos/user.create.input.dto';
import { CreateUserOutputDTO } from '../dtos/createUserOutputDTO';
import { UserUpdateInputDto } from '../dtos/user.update.input.dto';
import {
  AnonymizeUserUseCaseToken,
  CreateUserUseCaseToken,
  ListAllActiveUsersUseCaseToken,
  ListAllUsersUseCaseToken,
  UpdateUserUseCaseToken,
} from '@inject-tokens/users.tokens';
import { IAnonymizeUserUseCase } from '../../../application/use-cases/anonymize-user.use-case';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IListAllUsersUseCase } from '../../../application/use-cases/list-all-users.use-case';
import { IListAllActiveUsersUseCase } from '../../../application/use-cases/list-all-active-users';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { ROLES_KEY } from '../../../../../shared/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/value-objects/roles.enum';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    @Inject(CreateUserUseCaseToken)
    private readonly createUserUseCase: ICreateUserUseCase,

    @Inject(UpdateUserUseCaseToken)
    private readonly updateUserUseCase: IUpdateUserUseCase,

    @Inject(AnonymizeUserUseCaseToken)
    private readonly anonymizeUserUseCase: IAnonymizeUserUseCase,

    @Inject(ListAllUsersUseCaseToken)
    private readonly listAllUsersUseCase: IListAllUsersUseCase,

    @Inject(ListAllActiveUsersUseCaseToken)
    private readonly listAllActiveUsersUseCase: IListAllActiveUsersUseCase,
  ) {}

  @Post()
  @ApiHeader({
    name: 'x-tenant-slug',
    description: 'Tenant identifier (slug)',
    required: true,
  })
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: UserCreateInputDto, description: 'User creation data' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: CreateUserOutputDTO,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Conflict - User already exists' })
  async create(
    @Body() createUserDto: UserCreateInputDto,
    @Req() req: Request,
  ): Promise<CreateUserOutputDTO> {
    const tenantId = req['tenant']?.id;
    const correlationId = req['correlationId'];
    return this.createUserUseCase.execute(
      { ...createUserDto, tenantId },
      correlationId,
    );
  }

  @ApiHeader({
    name: 'x-tenant-slug',
    description: 'Tenant identifier (slug)',
    required: true,
  })
  @ApiOperation({ summary: 'List all users' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TENANT_ADMIN)
  @Get()
  public async listAllUsers(
    @Req() req: Request,
  ): Promise<CreateUserOutputDTO[]> {
    const tenantId = req['tenant']?.id;
    const correlationId = req['correlationId'];

    return this.listAllUsersUseCase.execute(tenantId, 'userId', correlationId);
  }

  @ApiHeader({
    name: 'x-tenant-slug',
    description: 'Tenant identifier (slug)',
    required: true,
  })
  @ApiOperation({ summary: 'List all active users' })
  @Get('/list-all-active-users')
  public async listAllActiveUsers(
    @Req() req: Request,
  ): Promise<CreateUserOutputDTO[]> {
    const tenantId = req['tenant']?.id;
    const correlationId = req['correlationId'];
    return this.listAllActiveUsersUseCase.execute(
      tenantId,
      'teste',
      correlationId,
    );
  }

  @ApiHeader({
    name: 'x-tenant-slug',
    description: 'Tenant identifier (slug)',
    required: true,
  })
  @Put(':id')
  async update(
    @Param('id') userId: string,
    @Body() updateUserDto: UserUpdateInputDto,
    @Req() req: Request,
  ): Promise<CreateUserOutputDTO> {
    const tenantId = req['tenant']?.id;
    const correlationId = req['correlationId'];

    return this.updateUserUseCase.execute(
      userId,
      {
        ...updateUserDto,
        tenantId,
      },
      correlationId,
    );
  }

  @ApiHeader({
    name: 'x-tenant-slug',
    description: 'Tenant identifier (slug)',
    required: true,
  })
  @ApiOperation({ summary: 'Anonymize (delete) a user' })
  @Delete(':id')
  async anonymize(
    @Param('id') userId: string,
    @Req() req: Request,
  ): Promise<void> {
    const tenantId = req['tenant']?.id;
    return this.anonymizeUserUseCase.execute(tenantId, userId);
  }
}
