import { UserCreateInputDto } from '../../presentation/http/dtos/user.create.input.dto';

export interface IValidatorService {
  validateUserInput(input: UserCreateInputDto): void;
}
