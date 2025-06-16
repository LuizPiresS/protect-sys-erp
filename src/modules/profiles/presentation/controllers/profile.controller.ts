import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateProfileInputDto } from '../dtos/create-profile.input.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserOutputDTO } from '../../../users/presentation/http/dtos/createUserOutputDTO';
import { ICreateProfileUseCase } from '../../application/use-cases/create-profile.use-case';
import { CreateProfileUseCaseToken } from '../../../../shared/inject-tokens/profile.tokens';

@ApiTags('Profiles')
@Controller('profile')
export class ProfileController {
  constructor(
    @Inject(CreateProfileUseCaseToken)
    private readonly createProfileUseCase: ICreateProfileUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new profile' })
  @ApiBody({
    type: CreateProfileInputDto,
    description: 'Profile creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'The profile has been successfully created.',
    type: CreateUserOutputDTO,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  public async createProfile(@Body() input: CreateProfileInputDto) {
    return this.createProfileUseCase.execute(input);
  }
}
